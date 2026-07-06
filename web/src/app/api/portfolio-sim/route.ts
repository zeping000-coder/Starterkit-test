// ================================================================
// "/api/portfolio-sim" 라우트 핸들러
//
// 지금은 더미 자산 목록만 돌려주고, 비중 조절에 따른 계산은
// 화면(클라이언트)에서 합니다. 나중에는 이 자리에서 사용자별로
// 저장된 자산 유니버스/기대수익률을 DB에서 읽어오도록 바꿀 예정입니다.
// ================================================================
import { NextResponse } from "next/server";
import { getDummyPortfolioSimSnapshot } from "@/lib/portfolio-sim";

export async function GET() {
  const data = getDummyPortfolioSimSnapshot();
  return NextResponse.json(data);
}
