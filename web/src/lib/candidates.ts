// ================================================================
// 투자 후보 종목 더미(가짜) 데이터 생성기
//
// 실제로는 보조지표(RSI 등) + 기관/외국인 수급 + 재무제표 + 뉴스를
// 종합해서 점수를 매기는 로직이 필요하지만(Phase 3에서 구현 예정),
// 지금은 화면부터 완성하기 위해 결과만 미리 흉내 낸 더미 데이터입니다.
// ================================================================

// Prisma 스키마(schema.prisma)의 InvestmentHorizon과 이름을 맞춰뒀어요.
export type Horizon = "SHORT" | "MEDIUM" | "LONG";

export interface CandidateReason {
  label: string; // 예: "RSI", "수급", "재무", "뉴스"
  detail: string; // 예: "32 (과매도 구간)"
}

export interface Candidate {
  symbol: string;
  name: string;
  horizon: Horizon;
  score: number; // 0~100. 높을수록 유망하다고 판단
  reasons: CandidateReason[];
}

export interface CandidatesResponse {
  updatedAt: string;
  candidates: Candidate[];
}

export function getDummyCandidatesSnapshot(): CandidatesResponse {
  const candidates: Candidate[] = [
    // --- 단기 후보: 짧은 기간의 수급/모멘텀 위주 ---
    {
      symbol: "005930",
      name: "삼성전자",
      horizon: "SHORT",
      score: 82,
      reasons: [
        { label: "RSI", detail: "32 (과매도 구간 반등 기대)" },
        { label: "수급", detail: "외국인 3일 연속 순매수" },
        { label: "뉴스", detail: "최근 7일 긍정 기사 6건" },
      ],
    },
    {
      symbol: "091990",
      name: "셀트리온헬스케어",
      horizon: "SHORT",
      score: 74,
      reasons: [
        { label: "수급", detail: "기관 순매수 전환" },
        { label: "모멘텀", detail: "5일 이평선 상향 돌파" },
      ],
    },
    {
      symbol: "META",
      name: "Meta Platforms",
      horizon: "SHORT",
      score: 69,
      reasons: [
        { label: "RSI", detail: "28 (단기 과매도)" },
        { label: "뉴스", detail: "실적 발표 앞두고 거래량 급증" },
      ],
    },
    // --- 중기 후보: 추세 전환/업황 개선 위주 ---
    {
      symbol: "000660",
      name: "SK하이닉스",
      horizon: "MEDIUM",
      score: 88,
      reasons: [
        { label: "업황", detail: "메모리 반도체 가격 상승 전환" },
        { label: "수급", detail: "외국인 보유비중 3개월 최고" },
        { label: "재무", detail: "영업이익률 개선 추세" },
      ],
    },
    {
      symbol: "035420",
      name: "NAVER",
      horizon: "MEDIUM",
      score: 71,
      reasons: [
        { label: "재무", detail: "클라우드 부문 매출 성장" },
        { label: "뉴스", detail: "AI 서비스 확대 기사 다수" },
      ],
    },
    {
      symbol: "NVDA",
      name: "NVIDIA",
      horizon: "MEDIUM",
      score: 85,
      reasons: [
        { label: "업황", detail: "AI 반도체 수요 지속 확대" },
        { label: "수급", detail: "기관 순매수 유지" },
      ],
    },
    // --- 장기 후보: 재무 우량/구조적 성장 위주 ---
    {
      symbol: "005380",
      name: "현대차",
      horizon: "LONG",
      score: 76,
      reasons: [
        { label: "재무", detail: "부채비율 낮고 배당수익률 안정적" },
        { label: "업황", detail: "하이브리드 판매 비중 증가" },
      ],
    },
    {
      symbol: "AAPL",
      name: "Apple",
      horizon: "LONG",
      score: 80,
      reasons: [
        { label: "재무", detail: "자사주 매입 지속, 현금흐름 우수" },
        { label: "브랜드", detail: "서비스 부문 매출 비중 확대" },
      ],
    },
    {
      symbol: "051910",
      name: "LG화학",
      horizon: "LONG",
      score: 65,
      reasons: [
        { label: "업황", detail: "배터리 소재 장기 계약 체결" },
        { label: "재무", detail: "R&D 투자 비중 확대" },
      ],
    },
  ];

  return {
    updatedAt: new Date().toISOString(),
    candidates,
  };
}
