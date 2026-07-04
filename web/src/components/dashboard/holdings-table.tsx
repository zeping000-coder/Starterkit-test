// ================================================================
// 보유종목 테이블
// 지금 계좌에 들고 있는 종목들을 표 형태로 보여줍니다.
// ================================================================
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Holding } from "@/lib/account";

function formatWon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

export function HoldingsTable({ holdings }: { holdings: Holding[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>종목명</TableHead>
          <TableHead className="text-right">수량</TableHead>
          <TableHead className="text-right">평단가</TableHead>
          <TableHead className="text-right">현재가</TableHead>
          <TableHead className="text-right">평가손익</TableHead>
          <TableHead className="text-right">손익률</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {holdings.map((h) => {
          const isUp = h.profitAmount > 0;
          const isDown = h.profitAmount < 0;
          const color = isUp
            ? "text-red-600 dark:text-red-400"
            : isDown
              ? "text-blue-600 dark:text-blue-400"
              : "text-muted-foreground";

          return (
            <TableRow key={h.symbol}>
              <TableCell>
                <div className="font-medium">{h.name}</div>
                <div className="text-xs text-muted-foreground">{h.symbol}</div>
              </TableCell>
              <TableCell className="text-right">{h.quantity.toLocaleString("ko-KR")}주</TableCell>
              <TableCell className="text-right">{formatWon(h.avgPrice)}</TableCell>
              <TableCell className="text-right">{formatWon(h.currentPrice)}</TableCell>
              <TableCell className={`text-right font-medium ${color}`}>
                {h.profitAmount > 0 ? "+" : ""}
                {formatWon(h.profitAmount)}
              </TableCell>
              <TableCell className={`text-right font-medium ${color}`}>
                {h.profitRatePct > 0 ? "+" : ""}
                {h.profitRatePct.toFixed(2)}%
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
