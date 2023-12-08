import "dotenv-flow/config";
import prisma from "@/lib/prisma";

async function main() {
  const users = await prisma.link.groupBy({
    by: ["userId"],
    where: {
      domain: "u0.wtf",
    },
    _count: {
      userId: true,
    },
    orderBy: {
      _count: {
        userId: "desc",
      },
    },
    take: 100,
  });
  console.table(users);
}

main();
