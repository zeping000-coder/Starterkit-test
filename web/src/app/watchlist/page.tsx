"use client";

// ================================================================
// 관심종목 화면 (샘플 화면, 더미 데이터 기준)
//
// 관심종목으로 등록한 종목들을 최근 등록일 순으로 보여줍니다.
// ================================================================
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WatchlistCard } from "@/components/dashboard/watchlist-card";
import type { WatchlistResponse } from "@/lib/watchlist";

async function fetchWatchlist(): Promise<WatchlistResponse> {
  const res = await fetch("/api/watchlist");
  if (!res.ok) {
    throw new Error("관심종목 데이터를 가져오지 못했습니다.");
  }
  return res.json();
}

export default function WatchlistPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["watchlist"],
    queryFn: fetchWatchlist,
  });

  const sortedItems = data
    ? [...data.items].sort(
        (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      )
    : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">관심종목</h1>
        <p className="text-sm text-muted-foreground">
          지켜보고 있는 종목과 목표가, 등록 이유를 확인하세요. (현재는 더미 데이터입니다)
        </p>
      </div>

      {isError && (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            관심종목을 불러오는 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.
          </CardContent>
        </Card>
      )}

      {isLoading || !data ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[150px] rounded-xl" />
          ))}
        </div>
      ) : sortedItems.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          등록된 관심종목이 없어요.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedItems.map((item) => (
            <WatchlistCard key={item.symbol} item={item} />
          ))}
        </div>
      )}

      {data && (
        <p className="text-right text-xs text-muted-foreground">
          마지막 갱신: {new Date(data.updatedAt).toLocaleString("ko-KR")}
        </p>
      )}
    </div>
  );
}
