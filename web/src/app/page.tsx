"use client";

// ================================================================
// 홈 화면 = "시장 지표 대시보드" (Phase 1)
//
// TanStack Query의 useQuery로 "/api/indicators"를 호출해서
// 데이터를 받아오고, 로딩 중에는 스켈레톤(회색 뼈대 UI)을,
// 완료되면 실제 카드/차트/게이지를 보여줍니다.
// ================================================================
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IndicatorCard } from "@/components/dashboard/indicator-card";
import { IndicatorChart } from "@/components/dashboard/indicator-chart";
import { FearGreedGauge } from "@/components/dashboard/fear-greed-gauge";
import type { IndicatorsResponse } from "@/lib/indicators";

async function fetchIndicators(): Promise<IndicatorsResponse> {
  const res = await fetch("/api/indicators");
  if (!res.ok) {
    throw new Error("지표 데이터를 가져오지 못했습니다.");
  }
  return res.json();
}

export default function HomePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["indicators"],
    queryFn: fetchIndicators,
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">시장 지표</h1>
        <p className="text-sm text-muted-foreground">
          미국·한국 주요 지수와 경제 지표를 한눈에 확인하세요. (현재는 더미 데이터입니다)
        </p>
      </div>

      {isError && (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            지표를 불러오는 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.
          </CardContent>
        </Card>
      )}

      {/* 지표 카드 그리드 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading || !data
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[104px] rounded-xl" />
            ))
          : data.indicators.map((indicator) => (
              <IndicatorCard key={indicator.code} indicator={indicator} />
            ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* S&P 500 추이 차트 (2/3 너비) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">S&amp;P 500 최근 30일 추이</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading || !data ? (
              <Skeleton className="h-[260px] w-full" />
            ) : (
              <IndicatorChart data={data.sp500History} />
            )}
          </CardContent>
        </Card>

        {/* 공포·탐욕 게이지 (1/3 너비) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">공포·탐욕 지수</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading || !data ? (
              <Skeleton className="h-[180px] w-full" />
            ) : (
              <FearGreedGauge value={data.fearGreed.value} label={data.fearGreed.label} />
            )}
          </CardContent>
        </Card>
      </div>

      {data && (
        <p className="text-right text-xs text-muted-foreground">
          마지막 갱신: {new Date(data.updatedAt).toLocaleString("ko-KR")}
        </p>
      )}
    </div>
  );
}
