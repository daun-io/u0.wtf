import prisma from "@/lib/prisma";
import { Background } from "@u0/ui";
import { constructMetadata } from "@u0/utils";
import PlaceholderContent from "./placeholder";

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}) {
  const title = `${params.domain.toUpperCase()} - 브랜드를 알리는 짧은 URL, U0`;
  const description = `${params.domain.toUpperCase()} 커스텀 도메인, 소셜 미디어 카드, 애널리틱스, 개인화까지 갖춘 현대적인 짧은 URL`;

  return constructMetadata({
    title,
    description,
  });
}

export async function generateStaticParams() {
  const domains =
    process.env.VERCEL_ENV === "production"
      ? await prisma.domain.findMany({
          where: {
            verified: true,
            target: null,
            NOT: {
              slug: "u0.wtf",
            },
          },
          select: {
            slug: true,
          },
        })
      : [];
  return domains.map(({ slug: domain }) => ({
    domain,
  }));
}

export default function CustomDomainPage() {
  return (
    <>
      <Background />
      <PlaceholderContent />
    </>
  );
}
