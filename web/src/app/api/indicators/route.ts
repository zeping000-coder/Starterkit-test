// ================================================================
// "/api/indicators" 라우트 핸들러
//
// 비유: 이 파일은 손님(브라우저)이 "지표 데이터 주세요!"라고
// 요청했을 때 응답해주는 "창구 직원"이에요. 지금은 진짜 은행(외부
// API)에 안 가고 미리 준비된 견본(더미 데이터)을 건네주고 있어요.
//
// 다음 단계(실데이터 연결)에서 할 일:
//   1) FRED/Yahoo Finance/Finnhub 등에서 실제 값을 fetch로 가져오기
//   2) Prisma로 IndicatorSnapshot 테이블에 저장(캐시)하기
//   3) Vercel Cron으로 주기적으로 이 저장 작업을 실행하기
//   4) 이 GET 함수는 "저장된 최신 값"만 DB에서 읽어 응답하도록 변경
// 이렇게 하면 화면 쪽 코드는 전혀 안 바꿔도 됩니다.
// ================================================================
import { NextResponse } from "next/server";
import { getDummyIndicatorsSnapshot } from "@/lib/indicators";

export async function GET() {
  const data = getDummyIndicatorsSnapshot();
  return NextResponse.json(data);
}
