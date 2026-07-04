// ================================================================
// "/api/account" 라우트 핸들러
//
// 지금은 더미 데이터를 돌려주지만, 나중에 KIS(한국투자증권) 등
// 증권사 API로 실제 보유종목·평가금액을 조회하도록 이 파일만
// 교체하면 됩니다. (계좌 API 키는 반드시 서버에서만 사용!)
// ================================================================
import { NextResponse } from "next/server";
import { getDummyAccountSnapshot } from "@/lib/account";

export async function GET() {
  const data = getDummyAccountSnapshot();
  return NextResponse.json(data);
}
