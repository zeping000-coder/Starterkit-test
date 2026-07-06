// ================================================================
// 뉴스 더미(가짜) 데이터 생성기
//
// 실제로는 뉴스 API(네이버 금융, Bloomberg, Finnhub 등)에서 최근
// 기사를 가져와야 하지만, 지금은 화면부터 완성하기 위해 결과만
// 미리 흉내 낸 더미 데이터입니다. 나중에 이 파일의 내용만 실제
// API 호출로 바꾸면, 화면 코드는 손댈 필요가 거의 없습니다.
// ================================================================

export type Sentiment = "POSITIVE" | "NEUTRAL" | "NEGATIVE";

export interface NewsArticle {
  id: string;
  title: string;
  source: string; // 예: "한국경제", "Bloomberg"
  publishedAt: string; // ISO 문자열
  summary: string;
  relatedSymbols: string[]; // 관련 종목 코드/티커 (없을 수도 있음)
  sentiment: Sentiment;
}

export interface NewsResponse {
  updatedAt: string;
  articles: NewsArticle[];
}

// 실제로 화면에 내려줄 더미 스냅샷을 만드는 함수.
// Route Handler(app/api/news/route.ts)에서 이 함수를 호출합니다.
export function getDummyNewsSnapshot(): NewsResponse {
  const articles: NewsArticle[] = [
    {
      id: "1",
      title: "삼성전자, HBM4 공급 확대 위해 대규모 투자 발표",
      source: "한국경제",
      publishedAt: "2026-07-05T23:10:00.000Z",
      summary: "삼성전자가 차세대 HBM4 생산라인 증설을 위해 대규모 설비 투자를 발표했다.",
      relatedSymbols: ["005930"],
      sentiment: "POSITIVE",
    },
    {
      id: "2",
      title: "미 연준, 기준금리 동결 시사...시장 안도",
      source: "Bloomberg",
      publishedAt: "2026-07-05T18:40:00.000Z",
      summary: "연준 위원들이 인플레이션 둔화를 근거로 당분간 금리를 동결할 가능성을 시사했다.",
      relatedSymbols: [],
      sentiment: "POSITIVE",
    },
    {
      id: "3",
      title: "NVIDIA, 차세대 AI 칩 양산 지연 우려 제기",
      source: "Reuters",
      publishedAt: "2026-07-05T09:15:00.000Z",
      summary: "일부 공급망 업체들이 신규 패키징 공정의 수율 문제를 언급하며 우려를 표했다.",
      relatedSymbols: ["NVDA"],
      sentiment: "NEGATIVE",
    },
    {
      id: "4",
      title: "SK하이닉스, 2분기 잠정 실적 컨센서스 부합",
      source: "매일경제",
      publishedAt: "2026-07-04T22:30:00.000Z",
      summary: "메모리 가격 상승에 힘입어 시장 예상치에 부합하는 잠정 실적을 발표했다.",
      relatedSymbols: ["000660"],
      sentiment: "NEUTRAL",
    },
    {
      id: "5",
      title: "코스피, 외국인 순매도에 소폭 하락 마감",
      source: "연합뉴스",
      publishedAt: "2026-07-04T07:05:00.000Z",
      summary: "외국인 투자자들의 차익실현 매물이 출회되며 코스피가 약보합으로 마감했다.",
      relatedSymbols: [],
      sentiment: "NEGATIVE",
    },
  ];

  return {
    updatedAt: new Date().toISOString(),
    articles,
  };
}
