import prisma from "@/lib/prisma";
import { Background } from "@u0/ui";
import { constructMetadata } from "@u0/utils";
import PlaceholderContent from "./placeholder";

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}) {
  const title = `${params.domain.toUpperCase()} - A U0.wtf Custom Domain`;
  const description = `${params.domain.toUpperCase()} is a custom domain on U0 - a link management tool for modern marketing teams to create, share, and track short links.`;

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
