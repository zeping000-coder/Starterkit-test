// ================================================================
// 투자 후보 종목 카드 하나
// 종목명, 점수(막대 게이지), 그리고 "왜 후보로 뽑혔는지" 근거를
// 작은 배지들로 보여줍니다.
// ================================================================
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Candidate } from "@/lib/candidates";

function scoreColor(score: number) {
  if (score >= 80) return "bg-red-600"; // 매우 유망
  if (score >= 65) return "bg-orange-500";
  return "bg-zinc-400";
}

export function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <div>
          <CardTitle className="text-base">{candidate.name}</CardTitle>
          <p className="text-xs text-muted-foreground">{candidate.symbol}</p>
        </div>
        <span className="text-xl font-semibold tabular-nums">{candidate.score}</span>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {/* 점수를 막대 게이지로 시각화 (0~100) */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full ${scoreColor(candidate.score)}`}
            style={{ width: `${candidate.score}%` }}
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {candidate.reasons.map((reason) => (
            <Badge key={reason.label} variant="secondary" className="font-normal">
              <span className="font-medium">{reason.label}</span>
              <span className="text-muted-foreground">· {reason.detail}</span>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
