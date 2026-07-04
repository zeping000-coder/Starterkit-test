"use client";

// ================================================================
// 라이트/다크 모드 전환 버튼
//
// useTheme()의 setTheme으로 테마를 바꿉니다. 처음 화면이 그려질 때는
// 서버와 브라우저가 "지금이 라이트인지 다크인지" 서로 다르게 알 수
// 있어서(hydration mismatch), "지금 브라우저에서 렌더링 중인지"를
// useSyncExternalStore로 확인해서 그 전까지는 빈 자리만 보여줍니다.
// (useEffect 안에서 setState를 부르는 방식은 불필요한 리렌더링을
// 유발할 수 있어 피하고, 이 방식을 사용합니다)
// ================================================================
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

function subscribe() {
  return () => {};
}

// 서버에서 렌더링할 때는 항상 false, 브라우저에서 하이드레이션이
// 끝난 뒤에는 true를 반환 → "지금 클라이언트에서 실행 중인지" 판별
function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsClient();

  if (!mounted) {
    return <Button variant="ghost" size="icon" disabled />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
