// ================================================================
// 관심종목 더미(가짜) 데이터 생성기
//
// 실제로는 사용자가 "관심종목"으로 등록한 종목 목록을 DB(Prisma)에서
// 읽어와야 하지만, 지금은 화면부터 완성하기 위해 결과만 미리 흉내
// 낸 더미 데이터입니다. 나중에 이 파일의 내용만 실제 조회 로직으로
// 바꾸면, 화면 코드는 손댈 필요가 거의 없습니다.
// ================================================================

export type Market = "KR" | "US";

export interface WatchlistItem {
  symbol: string;
  name: string;
  market: Market;
  currentPrice: number;
  changePct: number; // 전일 대비 변동률(%)
  targetPrice: number; // 목표가
  memo: string; // 관심종목으로 등록한 이유
  addedAt: string; // 관심 등록일(ISO 문자열)
}

export interface WatchlistResponse {
  updatedAt: string;
  items: WatchlistItem[];
}

// 실제로 화면에 내려줄 더미 스냅샷을 만드는 함수.
// Route Handler(app/api/watchlist/route.ts)에서 이 함수를 호출합니다.
export function getDummyWatchlistSnapshot(): WatchlistResponse {
  const items: WatchlistItem[] = [
    {
      symbol: "005930",
      name: "삼성전자",
      market: "KR",
      currentPrice: 78500,
      changePct: 1.29,
      targetPrice: 90000,
      memo: "HBM 공급 확대 기대, 목표가 근처 오면 분할 매수",
      addedAt: "2026-05-12T09:00:00.000Z",
    },
    {
      symbol: "035420",
      name: "NAVER",
      market: "KR",
      currentPrice: 214500,
      changePct: -0.65,
      targetPrice: 250000,
      memo: "AI 서비스 확대, 실적 발표 이후 재검토",
      addedAt: "2026-04-28T09:00:00.000Z",
    },
    {
      symbol: "AAPL",
      name: "Apple",
      market: "US",
      currentPrice: 231.42,
      changePct: 0.38,
      targetPrice: 260,
      memo: "서비스 부문 매출 비중 확대 추세 확인 중",
      addedAt: "2026-03-15T09:00:00.000Z",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA",
      market: "US",
      currentPrice: 142.8,
      changePct: 2.14,
      targetPrice: 170,
      memo: "AI 반도체 수요 지속, 조정 시 추가 편입 검토",
      addedAt: "2026-06-02T09:00:00.000Z",
    },
    {
      symbol: "000660",
      name: "SK하이닉스",
      market: "KR",
      currentPrice: 198000,
      changePct: -1.12,
      targetPrice: 230000,
      memo: "메모리 가격 상승 사이클, 실적 시즌 주목",
      addedAt: "2026-06-20T09:00:00.000Z",
    },
  ];

  return {
    updatedAt: new Date().toISOString(),
    items,
  };
}
