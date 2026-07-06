// ================================================================
// 뉴스 기사 카드 하나
// 제목, 출처/시각, 요약, 관련 종목, 그리고 기사 톤(긍정/중립/부정)을
// 보여줍니다.
// ================================================================
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { NewsArticle } from "@/lib/news";

function sentimentBadge(sentiment: NewsArticle["sentiment"]) {
  switch (sentiment) {
    case "POSITIVE":
      return { label: "긍정", className: "text-red-600 dark:text-red-400" };
    case "NEGATIVE":
      return { label: "부정", className: "text-blue-600 dark:text-blue-400" };
    default:
      return { label: "중립", className: "text-muted-foreground" };
  }
}

export function NewsCard({ article }: { article: NewsArticle }) {
  const { title, source, publishedAt, summary, relatedSymbols } = article;
  const sentiment = sentimentBadge(article.sentiment);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <Badge variant="outline" className={`border-none px-0 font-medium ${sentiment.className}`}>
          {sentiment.label}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-xs text-muted-foreground">
          {source} · {new Date(publishedAt).toLocaleString("ko-KR")}
        </p>

        <p className="text-sm text-muted-foreground">{summary}</p>

        {relatedSymbols.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {relatedSymbols.map((symbol) => (
              <Badge key={symbol} variant="secondary" className="font-normal">
                {symbol}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
