# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 저장소 구조

이 저장소는 현재 `web/` 안에 있는 Next.js 앱 하나로 구성되어 있습니다. 별도의 백엔드, 워커, 자동매매 엔진은 없습니다 — 초기 계획 단계에서는 자동매매 엔진도 고려했지만, 현재 범위는 **읽기 전용 투자 대시보드**(시장 지표, 계좌 보유종목, 후보 종목 스크리닝)로 의도적으로 축소되었습니다. 아래 모든 명령어는 `web/` 안에서 실행합니다.

## 명령어 (`web/`에서 실행)

```bash
npm run dev              # 개발 서버 실행 (Turbopack), http://localhost:3000
npm run build            # 프로덕션 빌드 (TypeScript 타입 체크도 함께 수행)
npm run start            # 프로덕션 빌드 결과 실행
npm run lint             # ESLint (flat config, eslint.config.mjs)
npx tsc --noEmit          # 타입 체크만 실행 (전체 빌드보다 빠름)

npx prisma generate       # prisma/schema.prisma 수정 후 Prisma 클라이언트 재생성
```

이 프로젝트에는 아직 테스트 프레임워크가 설정되어 있지 않습니다(`package.json`에 test 스크립트 없음).

## ⚠️ 최신(불안정) 버전의 의존성 — API를 추측하지 말고 먼저 확인할 것

이 프로젝트의 주요 라이브러리들은 전부 아주 최근 메이저 버전으로 고정되어 있고, 이전에 흔히 알려진 버전과 API가 크게 다른 경우가 많습니다. **학습 데이터에 있는 옛 지식으로 이 라이브러리들을 판단하지 말고, 설치된 문서를 확인하거나 Context7을 먼저 사용하세요.**

- **Next.js 16** (`web/AGENTS.md`에 명시적으로 경고가 적혀 있음 — 라우팅/캐싱 코드를 작성하기 전에 `web/node_modules/next/dist/docs/`를 먼저 읽을 것). 이 프로젝트에서는 Cache Components / PPR(`next.config.ts`의 `cacheComponents`)이 **비활성화**되어 있으므로, Route Handler와 페이지는 예전(PPR 이전) 방식의 렌더링/캐싱 모델을 그대로 씁니다 — 이게 켜져 있다고 가정하고 `use cache`/`cacheLife`를 추가하지 마세요.
- **Prisma 7** — datasource `url`이 더 이상 `schema.prisma`에 있지 않습니다. `web/prisma.config.ts`에서 `defineConfig`로 설정합니다. `PrismaClient`는 반드시 드라이버 어댑터(`@prisma/adapter-pg`의 `PrismaPg`)와 함께 생성해야 하며, `web/src/lib/prisma.ts`를 참고하세요. generator는 `provider = "prisma-client"`를 사용하고(예전 `prisma-client-js` 아님) 커스텀 `output`이 필수라서, 생성된 클라이언트는 `web/src/generated/prisma`(gitignore 처리됨)에 위치하고 `@/generated/prisma/client`로 임포트합니다 — `@prisma/client`가 **아닙니다**.
- **shadcn/ui `base-nova` 프리셋** — 컴포넌트가 Radix UI가 아니라 `@base-ui/react`(Base UI) 기반으로 만들어져 있습니다. 컴포넌트 이름(예: `Tabs`)은 일반적인 shadcn 관례를 따르지만, prop 형태는 Radix가 아닌 Base UI의 API를 따릅니다.
- **lightweight-charts v5** — 시리즈를 만들 때 `chart.addSeries(LineSeries, options)`를 사용합니다. 제거된 `chart.addLineSeries(options)`가 아닙니다.
- **recharts v3**, **lucide-react v1.x**, **Tailwind CSS v4**(`globals.css`에서 `@import "tailwindcss"` + `@theme inline`을 쓰는 CSS 우선 설정 방식, `tailwind.config.js` 없음)도 설치되어 있습니다 — v2 시절 API를 그대로 가정하지 말고 현재 문법을 먼저 확인하세요.

## 아키텍처

### 데이터 흐름 패턴 (모든 기능에 동일하게 적용)

세 화면 모두 동일한 계층 구조를 따르고 있어서, 나중에 더미 데이터를 실제 연동으로 바꿀 때 파일 하나만 건드리면 됩니다.

1. **`src/lib/<domain>.ts`** — 데이터 형태를 만드는 순수 함수들(타입 + `getDummy<Domain>Snapshot()` 생성 함수). 나중에 실제 데이터 소스(KIS API, FRED, Yahoo Finance 등)를 연결할 때 **유일하게** 수정해야 할 파일입니다.
2. **`src/app/api/<domain>/route.ts`** — `lib`의 생성 함수를 호출해서 JSON으로 반환하는 얇은 `GET` Route Handler. 여기에는 비즈니스 로직이 없습니다.
3. **`src/app/<domain>/page.tsx`** (클라이언트 컴포넌트) — TanStack Query(`useQuery`, `src/app/providers.tsx`에서 1분 `refetchInterval`로 설정됨)로 `/api/<domain>`을 호출하고, shadcn/ui 기본 컴포넌트(`src/components/ui/`)와 기능별 컴포넌트(`src/components/dashboard/`)로 화면을 그립니다.

차트용 가짜 시계열 데이터는 `src/lib/dummy-data.ts`의 시드 기반 의사난수(`mulberry32`, `generateWalk`, `generateBiasedWalk`)로 생성해서, 매 요청마다 완전히 랜덤한 노이즈가 아니라 "그럴듯하게 이어지는" 값이 나오도록 했습니다.

### 세 화면

- `/` — 시장 지표 (한국·미국 지수, VIX, 달러인덱스, 금리, 공포·탐욕 게이지). 데이터: `src/lib/indicators.ts`.
- `/account` — 계좌 요약 (투자원금/평가금액/손익 카드, 수익률 차트, 보유종목 표). 데이터: `src/lib/account.ts`. 참고: 더미 해외주식 보유종목은 미리 원화로 환산(환율 1,400원/달러 가정)해뒀기 때문에 통화가 달라도 계좌 합계가 어긋나지 않습니다 — 실제 증권사 데이터를 연결하면 진짜 환율 변환 로직이 필요합니다.
- `/candidates` — `SHORT`/`MEDIUM`/`LONG` 투자기간 탭으로 나뉜 후보 종목 목록, 각 종목마다 점수와 사람이 읽을 수 있는 "근거"(RSI, 수급, 재무, 뉴스 등)가 붙어 있습니다. 데이터: `src/lib/candidates.ts`.

세 화면 모두 현재는 100% 더미 데이터입니다 — 아직 외부 시장/증권사 API나 DB 조회는 일어나지 않습니다.

### 데이터베이스 (설계는 되어 있으나 아직 미연결)

`prisma/schema.prisma`에 의도한 저장 구조가 모델링되어 있습니다(`IndicatorSnapshot`, `AccountSnapshot`, `Holding`, `Candidate` — `Candidate`는 후보 종목 더미 데이터에서 쓰는 `SHORT`/`MEDIUM`/`LONG` `InvestmentHorizon` enum과 이름을 맞춰뒀습니다). `web/.env`에는 현재 **임시(더미)** `DATABASE_URL`이 들어 있으며, 아직 앱 코드 어디에서도 실제로 Prisma 쿼리를 실행하지 않습니다. `src/lib/prisma.ts`는 나중에 이 연동을 할 때 바로 쓸 수 있는 싱글턴 클라이언트를 내보내고 있습니다.

### 테마(다크모드)

다크모드는 `next-themes`(`attribute="class"`, `src/components/theme-provider.tsx` 참고, `src/app/layout.tsx`에 연결됨)를 사용하고, 상단 네비게이션의 `src/components/layout/theme-toggle.tsx`에서 토글합니다. 두 테마의 색상 값은 `globals.css`의 `:root` / `.dark` 아래 CSS 변수로 정의되어 있습니다. `useTheme()`은 클라이언트에서 마운트되기 전까지 `undefined`를 반환하기 때문에, 토글 버튼은 `useEffect` + `setState` 대신 `useSyncExternalStore`로 클라이언트 마운트 여부를 판단합니다(ESLint의 `react-hooks/set-state-in-effect` 규칙을 만족시키기 위함).

### 경로 별칭(path alias)

`@/*`는 `web/src/*`를 가리킵니다 (`tsconfig.json` / `components.json` 참고).
