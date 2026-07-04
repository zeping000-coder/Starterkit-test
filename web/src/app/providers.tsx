"use client";

// ================================================================
// TanStack Query(React Query) 제공자(Provider) 컴포넌트
//
// 비유: QueryClient는 "데이터 캐시를 관리하는 사서"예요. 이 사서가
// 앱 전체를 담당해야 하므로, 최상위(layout.tsx)에서 한 번만 만들어
// 앱 전체를 감싸줍니다. useState로 만들어서, 화면이 리렌더링돼도
// 같은 사서(같은 캐시)를 계속 쓰도록 합니다.
// ================================================================
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분 동안은 "신선한 데이터"로 보고 재요청 안 함
            refetchInterval: 60 * 1000, // 1분마다 자동으로 최신 데이터 다시 가져오기
            refetchOnWindowFocus: false, // 창을 다시 클릭할 때마다 요청하지는 않도록
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
