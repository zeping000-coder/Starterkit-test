"use client";

// ================================================================
// 포트폴리오 시뮬레이션 화면 (샘플 화면, 더미 데이터 기준)
//
// 다른 화면들과 달리 "읽기 전용"이 아니라, 자산별 비중을 +/- 버튼으로
// 조절하면 예상 수익률·변동성·1년 후 예상 자산가치가 즉시 재계산되는
// 인터랙티브 화면입니다.
//
// 비동기로 도착하는 서버 데이터를 useState 초기값으로 그대로 쓰면
// useEffect에서 setState를 해야 해서 ESLint의
// react-hooks/set-state-in-effect 규칙에 걸립니다. 그래서 "기본값에서
// 얼마나 바꿨는지"만 담는 overrides(수정본) 맵을 상태로 두고, 실제
// 비중은 항상 "overrides[symbol] ?? 기본비중"으로 계산해서 씁니다.
// ================================================================
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IndicatorChart } from "@/components/dashboard/indicator-chart";
import { PortfolioWeightRow } from "@/components/dashboard/portfolio-weight-row";
import { generateBiasedWalk } from "@/lib/dummy-data";
import type { PortfolioSimResponse, SimAsset } from "@/lib/portfolio-sim";

const WEIGHT_STEP = 5; // 버튼 한 번에 조절되는 비중 단위(%p)

async function fetchPortfolioSim(): Promise<PortfolioSimResponse> {
  const res = await fetch("/api/portfolio-sim");
  if (!res.ok) {
    throw new Error("포트폴리오 시뮬레이션 데이터를 가져오지 못했습니다.");
  }
  return res.json();
}

function formatWon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

export default function PortfolioSimPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["portfolio-sim"],
    queryFn: fetchPortfolioSim,
  });

  // symbol -> 사용자가 조절한 비중(%). 아직 안 건드린 자산은 여기에 없음
  const [overrides, setOverrides] = useState<Record<string, number>>({});

  function getWeight(asset: SimAsset) {
    return overrides[asset.symbol] ?? asset.defaultWeightPct;
  }

  function adjustWeight(asset: SimAsset, deltaPct: number) {
    setOverrides((prev) => {
      const current = prev[asset.symbol] ?? asset.defaultWeightPct;
      const next = Math.min(100, Math.max(0, current + deltaPct));
      return { ...prev, [asset.symbol]: next };
    });
  }

  function resetWeights() {
    setOverrides({});
  }

  // 비중에 따른 예상 수익률/변동성/성장곡선 계산.
  // data가 없으면(로딩 중) 계산할 필요가 없으므로 null 처리.
  const simulation = useMemo(() => {
    if (!data) return null;

    const weights = data.assets.map((asset) => ({ asset, weight: getWeight(asset) }));
    const totalWeightPct = weights.reduce((sum, w) => sum + w.weight, 0);

    // ※ 단순화: 실제 포트폴리오 변동성은 자산 간 상관관계(공분산)를
    // 반영해야 정확하지만, 더미 시뮬레이션이라 가중평균으로 근사합니다.
    const expectedReturnPct =
      weights.reduce((sum, w) => sum + (w.weight * w.asset.expectedReturnPct) / 100, 0) || 0;
    const expectedVolatilityPct =
      weights.reduce((sum, w) => sum + (w.weight * w.asset.volatilityPct) / 100, 0) || 0;

    // 연 기대수익률을 하루 평균 변화율(drift)로 환산(영업일 252일 기준)
    const drift = expectedReturnPct / 100 / 252;
    const volatility = expectedVolatilityPct / 100;
    // ※ 단순화: generateBiasedWalk는 "오늘까지의 과거 180일" 형태로 날짜를
    // 찍어주는 함수라 실제 미래 날짜는 아닙니다. 값이 어떤 흐름으로
    // 오르내리는지 보여주는 용도로만 사용합니다(새 생성기를 만들지 않고
    // 기존 함수를 재사용).
    const growthHistory = generateBiasedWalk(data.baseAmount, 180, volatility, drift, 11);
    const projectedAmount = data.baseAmount * (1 + expectedReturnPct / 100);

    return { totalWeightPct, expectedReturnPct, expectedVolatilityPct, growthHistory, projectedAmount };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- overrides는 getWeight를 통해 이미 반영됨
  }, [data, overrides]);

  const isProfit = (simulation?.expectedReturnPct ?? 0) > 0;
  const trendColor = isProfit
    ? "text-red-600 dark:text-red-400"
    : "text-blue-600 dark:text-blue-400";
  const isWeightBalanced = Math.round(simulation?.totalWeightPct ?? 100) === 100;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">포트폴리오 시뮬레이션</h1>
          <p className="text-sm text-muted-foreground">
            자산 비중을 조절하며 예상 수익률과 변동성을 미리 확인하세요. (현재는 더미 데이터입니다)
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={resetWeights}>
          기본 비중으로 초기화
        </Button>
      </div>

      {isError && (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            시뮬레이션 데이터를 불러오는 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.
          </CardContent>
        </Card>
      )}

      {/* 요약 카드 4개: 예상 연수익률 / 예상 변동성 / 1년 후 예상 자산 / 비중 합계 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading || !data || !simulation ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[92px] rounded-xl" />
          ))
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  예상 연수익률
                </CardTitle>
              </CardHeader>
              <CardContent className={`text-2xl font-semibold tracking-tight ${trendColor}`}>
                {simulation.expectedReturnPct > 0 ? "+" : ""}
                {simulation.expectedReturnPct.toFixed(2)}%
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  예상 변동성
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold tracking-tight">
                {simulation.expectedVolatilityPct.toFixed(2)}%
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  1년 후 예상 자산
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold tracking-tight">
                {formatWon(simulation.projectedAmount)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  비중 합계
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                {Math.round(simulation.totalWeightPct)}%
                {!isWeightBalanced && (
                  <Badge variant="secondary" className="text-xs font-normal text-destructive">
                    100%로 맞춰주세요
                  </Badge>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* 자산별 비중 조절 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">자산 비중 조절</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || !data ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <div className="flex flex-col divide-y">
              {data.assets.map((asset) => (
                <PortfolioWeightRow
                  key={asset.symbol}
                  asset={asset}
                  weight={getWeight(asset)}
                  onIncrease={() => adjustWeight(asset, WEIGHT_STEP)}
                  onDecrease={() => adjustWeight(asset, -WEIGHT_STEP)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 예상 성장 곡선 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">예상 자산가치 흐름</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || !data || !simulation ? (
            <Skeleton className="h-[260px] w-full" />
          ) : (
            <IndicatorChart data={simulation.growthHistory} />
          )}
        </CardContent>
      </Card>

      {data && (
        <p className="text-right text-xs text-muted-foreground">
          마지막 갱신: {new Date(data.updatedAt).toLocaleString("ko-KR")}
        </p>
      )}
    </div>
  );
}
