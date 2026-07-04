"use client";

// ================================================================
// 공포·탐욕 지수를 "반원 게이지" 모양으로 보여주는 컴포넌트
//
// 0~100 사이의 숫자 하나를 자동차 계기판처럼 반원 막대로 표현해요.
// Recharts의 RadialBarChart를 "막대 1개짜리 게이지"로 활용하는
// 방식입니다. (recharts v3 공식 문서로 API 확인 완료)
// ================================================================
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

function gaugeColor(value: number) {
  if (value < 25) return "#2563eb"; // 극단적 공포: 파랑
  if (value < 45) return "#38bdf8"; // 공포: 하늘색
  if (value < 55) return "#a3a3a3"; // 중립: 회색
  if (value < 75) return "#f97316"; // 탐욕: 주황
  return "#dc2626"; // 극단적 탐욕: 빨강
}

export function FearGreedGauge({ value, label }: { value: number; label: string }) {
  const color = gaugeColor(value);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={180}>
        <RadialBarChart
          cx="50%"
          cy="100%"
          innerRadius="130%"
          outerRadius="220%"
          barSize={18}
          startAngle={180}
          endAngle={0}
          data={[{ value }]}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" background cornerRadius={9} fill={color} />
        </RadialBarChart>
      </ResponsiveContainer>
      {/* 게이지 중앙 하단에 숫자와 라벨을 겹쳐서 표시 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-2 flex flex-col items-center">
        <span className="text-3xl font-semibold" style={{ color }}>
          {value}
        </span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
