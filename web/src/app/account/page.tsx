"use client";

// ================================================================
// 내 계좌 화면 (Phase 2 — 샘플 화면, 더미 데이터 기준)
//
// 시장 지표 화면(src/app/page.tsx)과 똑같은 패턴을 씁니다:
// useQuery로 "/api/account"를 호출 → 로딩 중엔 스켈레톤 →
// 완료되면 카드/차트/표를 보여줍니다.
// ================================================================
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IndicatorChart } from "@/components/dashboard/indicator-chart";
import { HoldingsTable } from "@/components/dashboard/holdings-table";
import type { AccountResponse } from "@/lib/account";

async function fetchAccount(): Promise<AccountResponse> {
  const res = await fetch("/api/account");
  if (!res.ok) {
    throw new Error("계좌 데이터를 가져오지 못했습니다.");
  }
  return res.json();
}

function formatWon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

export default function AccountPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["account"],
    queryFn: fetchAccount,
  });

  const isProfit = (data?.profitAmount ?? 0) > 0;
  const isLoss = (data?.profitAmount ?? 0) < 0;
  const trendColor = isProfit
    ? "text-red-600 dark:text-red-400"
    : isLoss
      ? "text-blue-600 dark:text-blue-400"
      : "text-muted-foreground";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">내 계좌</h1>
        <p className="text-sm text-muted-foreground">
          보유종목과 계좌 전체 수익률을 확인하세요. (현재는 더미 데이터입니다)
        </p>
      </div>

      {isError && (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            계좌 정보를 불러오는 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.
          </CardContent>
        </Card>
      )}

      {/* 요약 카드 4개: 투자원금 / 평가금액 / 수익금 / 수익률 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading || !data ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[92px] rounded-xl" />
          ))
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  투자원금
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold tracking-tight">
                {formatWon(data.principal)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  평가금액
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold tracking-tight">
                {formatWon(data.totalValue)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  수익금
                </CardTitle>
              </CardHeader>
              <CardContent className={`text-2xl font-semibold tracking-tight ${trendColor}`}>
                {data.profitAmount > 0 ? "+" : ""}
                {formatWon(data.profitAmount)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  수익률
                </CardTitle>
              </CardHeader>
              <CardContent className={`text-2xl font-semibold tracking-tight ${trendColor}`}>
                {data.profitRatePct > 0 ? "+" : ""}
                {data.profitRatePct.toFixed(2)}%
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* 수익률 추이 차트 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">수익률 추이 (최근 90일)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || !data ? (
            <Skeleton className="h-[260px] w-full" />
          ) : (
            <IndicatorChart data={data.profitRateHistory} />
          )}
        </CardContent>
      </Card>

      {/* 보유종목 표 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">보유종목</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || !data ? (
            <Skeleton className="h-[240px] w-full" />
          ) : (
            <HoldingsTable holdings={data.holdings} />
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
