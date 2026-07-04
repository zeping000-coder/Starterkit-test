// ================================================================
// "/api/candidates" 라우트 핸들러
//
// 지금은 더미 데이터를 돌려주지만, Phase 3에서는 이 자리에
// "보조지표 + 수급 + 재무 + 뉴스를 모아 점수 계산하는 배치 결과"를
// DB에서 읽어와 반환하도록 바꿀 예정입니다.
// ================================================================
import { NextResponse } from "next/server";
import { getDummyCandidatesSnapshot } from "@/lib/candidates";

export async function GET() {
  const data = getDummyCandidatesSnapshot();
  return NextResponse.json(data);
}
