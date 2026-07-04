// ================================================================
// 지표 하나를 보여주는 카드
//
// 예: "S&P 500 | 5,987.34 | ▲ 0.42%" 형태로 이름/값/등락률을
// 깔끔한 카드 모양으로 보여줍니다. shadcn의 Card, Badge를 재사용해서
// 디자인을 통일했어요.
// ================================================================
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { IndicatorPoint } from "@/lib/indicators";

function formatValue(value: number, unit?: string) {
  const formatted = value.toLocaleString("ko-KR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return unit ? `${formatted}${unit}` : formatted;
}

export function IndicatorCard({ indicator }: { indicator: IndicatorPoint }) {
  const { label, value, changePct, unit } = indicator;

  // 변동률 부호에 따라 색깔과 아이콘을 다르게 보여줘서
  // 숫자를 굳이 안 읽어도 "오르는지 내리는지" 한눈에 알 수 있게 함
  const isUp = changePct > 0;
  const isDown = changePct < 0;
  const trendColor = isUp
    ? "text-red-600 dark:text-red-400" // 한국 증시 관례: 상승은 빨강
    : isDown
      ? "text-blue-600 dark:text-blue-400" // 하락은 파랑
      : "text-muted-foreground";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">
          {formatValue(value, unit)}
        </div>
        <Badge
          variant="outline"
          className={`mt-2 gap-1 border-none px-0 font-medium ${trendColor}`}
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
      </CardContent>
    </Card>
  );
}
