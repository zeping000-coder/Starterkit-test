"use client";

// ================================================================
// 뉴스 화면 (샘플 화면, 더미 데이터 기준)
//
// 최근 발행 시각 순으로 뉴스 기사를 보여줍니다.
// ================================================================
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NewsCard } from "@/components/dashboard/news-card";
import type { NewsResponse } from "@/lib/news";

async function fetchNews(): Promise<NewsResponse> {
  const res = await fetch("/api/news");
  if (!res.ok) {
    throw new Error("뉴스 데이터를 가져오지 못했습니다.");
  }
  return res.json();
}

export default function NewsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
  });

  const sortedArticles = data
    ? [...data.articles].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
    : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">뉴스</h1>
        <p className="text-sm text-muted-foreground">
          시장과 보유·관심 종목 관련 최근 뉴스를 확인하세요. (현재는 더미 데이터입니다)
        </p>
      </div>

      {isError && (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            뉴스를 불러오는 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.
          </CardContent>
        </Card>
      )}

      {isLoading || !data ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[130px] rounded-xl" />
          ))}
        </div>
      ) : sortedArticles.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          표시할 뉴스가 없어요.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {sortedArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
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
