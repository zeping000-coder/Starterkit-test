// ================================================================
// "/api/watchlist" 라우트 핸들러
//
// 지금은 더미 데이터를 돌려주지만, 나중에는 이 자리에서
// 사용자별 관심종목 목록을 Prisma로 DB에서 읽어와 반환하도록
// 바꿀 예정입니다.
// ================================================================
import { NextResponse } from "next/server";
import { getDummyWatchlistSnapshot } from "@/lib/watchlist";

export async function GET() {
  const data = getDummyWatchlistSnapshot();
  return NextResponse.json(data);
}
