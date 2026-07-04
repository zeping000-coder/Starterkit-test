"use client";

// ================================================================
// 투자 후보 화면 (Phase 3 — 샘플 화면, 더미 데이터 기준)
//
// 단기/중기/장기 탭으로 후보 종목을 나눠서 보여줍니다.
// 각 탭 안에서는 점수(score)가 높은 순서로 정렬했어요.
// ================================================================
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CandidateCard } from "@/components/dashboard/candidate-card";
import type { Candidate, CandidatesResponse, Horizon } from "@/lib/candidates";

async function fetchCandidates(): Promise<CandidatesResponse> {
  const res = await fetch("/api/candidates");
  if (!res.ok) {
    throw new Error("투자 후보 데이터를 가져오지 못했습니다.");
  }
  return res.json();
}

const HORIZON_TABS: { value: Horizon; label: string }[] = [
  { value: "SHORT", label: "단기" },
  { value: "MEDIUM", label: "중기" },
  { value: "LONG", label: "장기" },
];

function sortByScoreDesc(candidates: Candidate[]) {
  return [...candidates].sort((a, b) => b.score - a.score);
}

export default function CandidatesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["candidates"],
    queryFn: fetchCandidates,
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">투자 후보</h1>
        <p className="text-sm text-muted-foreground">
          보조지표·수급·재무·뉴스를 종합해 뽑은 후보 종목이에요. (현재는 더미 데이터입니다)
        </p>
      </div>

      {isError && (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            후보 종목을 불러오는 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.
          </CardContent>
        </Card>
      )}

      {isLoading || !data ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[150px] rounded-xl" />
          ))}
        </div>
      ) : (
        <Tabs defaultValue="SHORT">
          <TabsList>
            {HORIZON_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {HORIZON_TABS.map((tab) => {
            const filtered = sortByScoreDesc(
              data.candidates.filter((c) => c.horizon === tab.value)
            );
            return (
              <TabsContent key={tab.value} value={tab.value} className="mt-4">
                {filtered.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    해당 기간의 후보 종목이 없어요.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((candidate) => (
                      <CandidateCard key={candidate.symbol} candidate={candidate} />
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}

      {data && (
        <p className="text-right text-xs text-muted-foreground">
          마지막 갱신: {new Date(data.updatedAt).toLocaleString("ko-KR")}
        </p>
      )}
    </div>
  );
}
