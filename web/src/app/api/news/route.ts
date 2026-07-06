// ================================================================
// "/api/news" 라우트 핸들러
//
// 지금은 더미 데이터를 돌려주지만, 나중에는 이 자리에서
// 실제 뉴스 API(네이버 금융, Bloomberg, Finnhub 등)를 호출해서
// 최근 기사를 가져오도록 바꿀 예정입니다.
// ================================================================
import { NextResponse } from "next/server";
import { getDummyNewsSnapshot } from "@/lib/news";

export async function GET() {
  const data = getDummyNewsSnapshot();
  return NextResponse.json(data);
}
