// ================================================================
// 포트폴리오 시뮬레이션용 자산 더미(가짜) 데이터
//
// 실제로는 각 자산의 기대수익률/변동성을 과거 데이터로 추정해야
// 하지만, 지금은 화면부터 완성하기 위해 결과만 미리 흉내 낸
// 더미 값입니다. 비중을 조절했을 때의 "가중 합산" 계산은 여기서
// 하지 않고 화면(page.tsx)에서 합니다 — 이 파일은 순수하게
// "자산 목록 + 기본값"만 제공합니다.
// ================================================================

export interface SimAsset {
  symbol: string;
  name: string;
  description: string; // 자산 한 줄 설명
  expectedReturnPct: number; // 연 기대수익률(%)
  volatilityPct: number; // 연 변동성(%). 클수록 위험이 큼
  defaultWeightPct: number; // 기본 비중(%). 전체 합 100
}

export interface PortfolioSimResponse {
  updatedAt: string;
  baseAmount: number; // 시뮬레이션 기준 투자금(원)
  assets: SimAsset[];
}

// 실제로 화면에 내려줄 더미 스냅샷을 만드는 함수.
// Route Handler(app/api/portfolio-sim/route.ts)에서 이 함수를 호출합니다.
export function getDummyPortfolioSimSnapshot(): PortfolioSimResponse {
  const assets: SimAsset[] = [
    {
      symbol: "069500",
      name: "국내주식 ETF",
      description: "코스피200을 추종하는 국내 대표 지수 ETF",
      expectedReturnPct: 7.5,
      volatilityPct: 18,
      defaultWeightPct: 30,
    },
    {
      symbol: "SPY",
      name: "미국주식 ETF",
      description: "S&P 500을 추종하는 미국 대표 지수 ETF",
      expectedReturnPct: 9.0,
      volatilityPct: 16,
      defaultWeightPct: 30,
    },
    {
      symbol: "148070",
      name: "국내채권 ETF",
      description: "국고채 3년물 중심의 안정적인 채권형 자산",
      expectedReturnPct: 3.5,
      volatilityPct: 5,
      defaultWeightPct: 20,
    },
    {
      symbol: "GLD",
      name: "금",
      description: "인플레이션 헤지 목적의 실물 금 연동 자산",
      expectedReturnPct: 5.0,
      volatilityPct: 12,
      defaultWeightPct: 10,
    },
    {
      symbol: "CASH",
      name: "현금성 자산",
      description: "MMF 등 원금 보장에 가까운 저위험 자산",
      expectedReturnPct: 3.0,
      volatilityPct: 0.5,
      defaultWeightPct: 10,
    },
  ];

  return {
    updatedAt: new Date().toISOString(),
    baseAmount: 10_000_000,
    assets,
  };
}
