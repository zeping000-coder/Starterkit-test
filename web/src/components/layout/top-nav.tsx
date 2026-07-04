"use client";

// ================================================================
// 상단 네비게이션 바
//
// 이 앱의 전체 그림(3개 화면)을 미리 보여주는 메뉴입니다.
// - 시장 지표: Phase 1에서 완성 (지금 이 단계)
// - 내 계좌: Phase 2에서 구현 예정 (지금은 "준비중" 안내 페이지)
// - 투자 후보: Phase 3에서 구현 예정 (지금은 "준비중" 안내 페이지)
// ================================================================
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const NAV_ITEMS = [
  { href: "/", label: "시장 지표" },
  { href: "/account", label: "내 계좌" },
  { href: "/candidates", label: "투자 후보" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <span className="font-semibold tracking-tight">투자 대시보드</span>
        <nav className="flex flex-1 items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
