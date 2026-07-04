// ================================================================
// Prisma CLI 설정 파일 (Prisma 7부터 새로 생긴 파일)
//
// 예전에는 schema.prisma 안에 DB 접속 주소(url)를 바로 적었지만,
// Prisma 7부터는 "CLI가 마이그레이션할 때 쓰는 접속 주소"를
// 이 파일에서 따로 관리합니다. (실제 앱 코드에서 쓰는 접속은
// src/lib/prisma.ts 안의 어댑터가 담당해요)
// ================================================================
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
