// ================================================================
// 포트폴리오 시뮬레이션 — 자산 하나의 비중 조절 행
//
// 이 컴포넌트는 자체 상태를 갖지 않고, 현재 비중(weight)과
// +/- 버튼을 눌렀을 때 실행할 콜백만 props로 받습니다.
// (실제 상태/계산은 portfolio-sim/page.tsx가 소유)
// ================================================================
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import type { SimAsset } from "@/lib/portfolio-sim";

export function PortfolioWeightRow({
  asset,
  weight,
  onIncrease,
  onDecrease,
}: {
  asset: SimAsset;
  weight: number;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{asset.name}</p>
          <p className="text-xs text-muted-foreground">{asset.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={`${asset.name} 비중 줄이기`}
            onClick={onDecrease}
          >
            <Minus />
          </Button>
          <span className="w-12 text-right text-sm font-semibold tabular-nums">
            {weight}%
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={`${asset.name} 비중 늘리기`}
            onClick={onIncrease}
          >
            <Plus />
          </Button>
        </div>
      </div>

      {/* 비중을 막대로 시각화 (0~100) */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${Math.min(weight, 100)}%` }}
        />
      </div>
    </div>
  );
}
