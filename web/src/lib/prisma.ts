// ================================================================
// Prisma 클라이언트를 "딱 하나만" 만들어서 재사용하기 위한 파일
//
// 왜 필요할까요? 개발 모드(next dev)에서는 코드를 고칠 때마다
// 화면이 자동으로 새로고침되는데, 이때마다 새 Prisma 클라이언트를
// 만들면 DB 연결이 계속 쌓여서 "너무 많은 손님이 동시에 문을 두드리는"
// 상황이 됩니다. 그래서 global 객체에 딱 하나만 저장해두고
// 계속 재사용하는 방식(싱글턴 패턴)을 씁니다.
//
// ※ Prisma 7부터는 PrismaClient를 만들 때 "어댑터(adapter)"를
//   반드시 넘겨줘야 해요. 어댑터는 "어떤 방식으로 DB와 대화할지"를
//   정하는 통역사 같은 역할입니다. 여기서는 PostgreSQL용 통역사인
//   PrismaPg를 사용합니다 (Supabase도 PostgreSQL이라 그대로 사용 가능).
// ================================================================
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// DATABASE_URL이 아직 없어도(=.env.local 설정 전) 앱 실행 자체는 되도록
// 빈 문자열을 기본값으로 둡니다. 실제 DB 접근 시점에 값이 없으면 에러가 나며,
// 그때 .env.local에 DATABASE_URL을 채워 넣으면 됩니다.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? "",
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
