// ================================================================
// 내 계좌 더미(가짜) 데이터 생성기
//
// 실제 증권사 API(KIS 등)를 연결하기 전에 화면부터 완성하기 위한
// 가짜 재료입니다. 보유종목 목록에서 투자원금/평가금액을 역산해서
// "숫자가 서로 앞뒤가 맞는" 계좌 요약을 만들어줍니다.
// ================================================================
import { generateBiasedWalk, type ChartPoint } from "@/lib/dummy-data";

export type { ChartPoint };

export interface Holding {
  symbol: string; // 종목코드
  name: string; // 종목명
  quantity: number; // 보유 수량
  avgPrice: number; // 평단가
  currentPrice: number; // 현재가
  profitAmount: number; // 평가손익 금액
  profitRatePct: number; // 평가손익률(%)
}

export interface AccountResponse {
  updatedAt: string;
  principal: number; // 투자원금
  totalValue: number; // 평가금액
  profitAmount: number; // 수익금
  profitRatePct: number; // 전체 수익률(%)
  profitRateHistory: ChartPoint[]; // 최근 90일 수익률(%) 추이
  holdings: Holding[];
}

// 보유수량/평단가/현재가만 넣으면 나머지(손익, 손익률)는 자동 계산
function makeHolding(
  symbol: string,
  name: string,
  quantity: number,
  avgPrice: number,
  currentPrice: number
): Holding {
  const profitAmount = Math.round((currentPrice - avgPrice) * quantity);
  const profitRatePct = ((currentPrice - avgPrice) / avgPrice) * 100;
  return {
    symbol,
    name,
    quantity,
    avgPrice,
    currentPrice,
    profitAmount,
    profitRatePct: Math.round(profitRatePct * 100) / 100,
  };
}

export function getDummyAccountSnapshot(): AccountResponse {
  // ※ 국내/해외 주식이 섞여 있으면 원래는 통화를 통일해서 합산해야 해요.
  //   여기서는 계산이 꼬이지 않도록, 해외 주식(AAPL/MSFT/TSLA)도
  //   원화 환산가(환율 1,400원/달러 가정)로 이미 바꿔서 넣었습니다.
  const holdings: Holding[] = [
    makeHolding("005930", "삼성전자", 120, 68000, 74200),
    makeHolding("000660", "SK하이닉스", 30, 178000, 205500),
    makeHolding("035420", "NAVER", 15, 189000, 176000),
    makeHolding("AAPL", "Apple", 8, 294700, 324520),
    makeHolding("MSFT", "Microsoft", 5, 581280, 632940),
    makeHolding("TSLA", "Tesla", 6, 371000, 333760),
  ];

  // 보유종목들로부터 계좌 전체 원금/평가금액을 역산
  const principal = Math.round(
    holdings.reduce((sum, h) => sum + h.avgPrice * h.quantity, 0)
  );
  const totalValue = Math.round(
    holdings.reduce((sum, h) => sum + h.currentPrice * h.quantity, 0)
  );
  const profitAmount = totalValue - principal;
  const profitRatePct = Math.round((profitAmount / principal) * 100 * 100) / 100;

  return {
    updatedAt: new Date().toISOString(),
    principal,
    totalValue,
    profitAmount,
    profitRatePct,
    // 90일 전 0%에서 시작해 완만히 우상향하다가 등락하는 수익률 곡선
    profitRateHistory: generateBiasedWalk(1, 90, 0.02, 0.0012, 7).map((p) => ({
      time: p.time,
      value: Math.round((p.value - 1) * 100 * 100) / 100, // 배율 → 수익률(%)로 변환
    })),
    holdings,
  };
}
