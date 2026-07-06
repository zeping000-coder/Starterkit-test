// ================================================================
// 관심종목 카드 하나
// 종목명, 현재가, 등락률, 목표가, 그리고 "왜 관심종목으로 등록했는지"
// 메모를 보여줍니다.
// ================================================================
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { WatchlistItem } from "@/lib/watchlist";

function formatPrice(value: number, market: WatchlistItem["market"]) {
  const formatted = value.toLocaleString("ko-KR", {
    minimumFractionDigits: market === "US" ? 2 : 0,
    maximumFractionDigits: market === "US" ? 2 : 0,
  });
  return market === "US" ? `$${formatted}` : `${formatted}원`;
}

export function WatchlistCard({ item }: { item: WatchlistItem }) {
  const { name, symbol, market, currentPrice, changePct, targetPrice, memo } = item;

  // 한국 증시 관례: 상승은 빨강, 하락은 파랑
  const isUp = changePct > 0;
  const isDown = changePct < 0;
  const trendColor = isUp
    ? "text-red-600 dark:text-red-400"
    : isDown
      ? "text-blue-600 dark:text-blue-400"
      : "text-muted-foreground";

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <div>
          <CardTitle className="text-base">{name}</CardTitle>
          <p className="text-xs text-muted-foreground">
            {symbol} · {market === "KR" ? "국내" : "해외"}
          </p>
        </div>
        <Badge variant="secondary" className="font-normal">
          목표가 {formatPrice(targetPrice, market)}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight">
            {formatPrice(currentPrice, market)}
          </span>
          <Badge
            variant="outline"
            className={`gap-1 border-none px-0 font-medium ${trendColor}`}
          >
            {isUp ? (
              <TrendingUp className="size-3.5" />
            ) : isDown ? (
              <TrendingDown className="size-3.5" />
            ) : (
              <Minus className="size-3.5" />
            )}
            {changePct > 0 ? "+" : ""}
            {changePct.toFixed(2)}%
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">{memo}</p>
      </CardContent>
    </Card>
  );
}
