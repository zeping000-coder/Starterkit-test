// ================================================================
// 여러 화면(지표/계좌/후보)에서 공통으로 쓰는 "가짜 데이터 생성 도구"
//
// 왜 따로 뺐을까요? 지표 화면, 계좌 화면, 투자 후보 화면 모두
// "그럴듯하게 오르내리는 시계열 데이터"가 필요해서, 매번 같은
// 코드를 복사하는 대신 한 곳에 모아두고 재사용하기 위함입니다.
// ================================================================

export interface ChartPoint {
  time: string; // "YYYY-MM-DD" 형식 (lightweight-charts가 요구하는 형식)
  value: number;
}

// 시드 기반의 단순 의사난수(seeded pseudo-random) — 매번 다른 값이 아니라
// 같은 seed면 항상 같은 순서로 값이 나오도록 해서, 새로고침해도
// "그럴듯하게 이어지는" 흐름을 만들기 위해 사용
export function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 시작값에서부터 N일치 랜덤워크(하루하루 조금씩 오르내리는) 시계열을 생성
export function generateWalk(
  start: number,
  days: number,
  volatility: number,
  seed: number
): ChartPoint[] {
  const rand = mulberry32(seed);
  const points: ChartPoint[] = [];
  let value = start;
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    // rand()는 0~1 사이 값이라, -0.5~0.5 범위로 바꿔서 오르내림을 표현
    value = value * (1 + (rand() - 0.5) * volatility);
    points.push({
      time: date.toISOString().slice(0, 10),
      value: Math.round(value * 100) / 100,
    });
  }
  return points;
}

// 랜덤워크지만 "오르는 쪽으로 살짝 치우친" 시계열 (계좌 수익률 그래프처럼
// 완만하게 우상향하는 느낌을 내고 싶을 때 사용)
export function generateBiasedWalk(
  start: number,
  days: number,
  volatility: number,
  drift: number, // 하루 평균 변화율 (예: 0.003 = 하루 평균 +0.3%)
  seed: number
): ChartPoint[] {
  const rand = mulberry32(seed);
  const points: ChartPoint[] = [];
  let value = start;
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    value = value * (1 + drift + (rand() - 0.5) * volatility);
    points.push({
      time: date.toISOString().slice(0, 10),
      value: Math.round(value * 100) / 100,
    });
  }
  return points;
}
