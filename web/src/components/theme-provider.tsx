"use client";

// ================================================================
// 다크모드 제공자(Provider)
//
// next-themes 라이브러리가 <html> 태그에 "dark" 클래스를 붙였다 뗐다
// 해주는 역할을 합니다. globals.css를 보면 ".dark { ... }" 안에
// 어두운 테마용 색상들이 이미 정의되어 있어서, 이 클래스만
// 붙여주면 자동으로 다크모드 색상이 적용돼요.
// ================================================================
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
