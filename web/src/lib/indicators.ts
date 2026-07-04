// ================================================================
// 시장 지표 더미(가짜) 데이터 생성기
//
// 비유: 실제 증시 데이터를 가져오는 API(FRED, Yahoo Finance 등)를
// 연결하기 전에, "일단 화면이 잘 그려지는지" 확인하기 위한
// 가짜 재료입니다. 나중에 이 파일의 내용만 진짜 API 호출로
// 바꾸면, 화면 코드는 손댈 필요가 거의 없습니다.
// (Route Handler가 이 함수를 호출하는 구조라, 여기만 교체하면 되도록
//  설계했어요)
// ================================================================
import { generateWalk, type ChartPoint } from "@/lib/dummy-data";

export type { ChartPoint };

// 지표를 어떤 그룹으로 묶어서 보여줄지 정의
export type IndicatorGroup = "US" | "KR" | "RATES";

export interface IndicatorPoint {
  code: string; // 지표 코드. 예: "SP500"
  label: string; // 화면에 보여줄 이름. 예: "S&P 500"
  group: IndicatorGroup;
  value: number; // 현재 값
  changePct: number; // 전일 대비 변동률(%)
  unit?: string; // "pt", "%", "bp" 등 값의 단위 (없으면 지수 포인트로 간주)
}

export interface IndicatorsResponse {
  updatedAt: string; // 이 데이터를 만든 시각(ISO 문자열)
  indicators: IndicatorPoint[];
  fearGreed: {
    value: number; // 0~100. 0에 가까울수록 "극단적 공포", 100에 가까울수록 "극단적 탐욕"
    label: string; // "극단적 공포" | "공포" | "중립" | "탐욕" | "극단적 탐욕"
  };
  sp500History: ChartPoint[]; // S&P 500 최근 추이 (대표 차트용)
}

// 0~100 사이 공포탐욕지수 값을 보고 사람이 읽을 라벨로 바꿔주는 함수
function fearGreedLabel(value: number): string {
  if (value < 25) return "극단적 공포";
  if (value < 45) return "공포";
  if (value < 55) return "중립";
  if (value < 75) return "탐욕";
  return "극단적 탐욕";
}

// 실제로 화면에 내려줄 더미 스냅샷을 만드는 함수.
// Route Handler(app/api/indicators/route.ts)에서 이 함수를 호출합니다.
export function getDummyIndicatorsSnapshot(): IndicatorsResponse {
  const indicators: IndicatorPoint[] = [
    // --- 미국 시장 ---
    { code: "SP500", label: "S&P 500", group: "US", value: 5987.34, changePct: 0.42 },
    { code: "NASDAQ100", label: "나스닥100", group: "US", value: 21453.12, changePct: 0.65 },
    { code: "VIX", label: "VIX (변동성지수)", group: "US", value: 14.2, changePct: -3.51 },
    { code: "DXY", label: "달러인덱스", group: "US", value: 104.32, changePct: 0.15 },
    // --- 한국 시장 ---
    { code: "KOSPI", label: "코스피", group: "KR", value: 2650.77, changePct: -0.31 },
    { code: "KOSDAQ", label: "코스닥", group: "KR", value: 852.14, changePct: 0.24 },
    // --- 금리/신용 지표 ---
    { code: "US10Y", label: "미 국채 10년물 금리", group: "RATES", value: 4.28, changePct: 0.47, unit: "%" },
    { code: "HY_SPREAD", label: "하이일드 채권 스프레드", group: "RATES", value: 3.15, changePct: -1.56, unit: "%p" },
  ];

  return {
    updatedAt: new Date().toISOString(),
    indicators,
    fearGreed: {
      value: 62,
      label: fearGreedLabel(62),
    },
    sp500History: generateWalk(5987.34, 30, 0.012, 42),
  };
}
