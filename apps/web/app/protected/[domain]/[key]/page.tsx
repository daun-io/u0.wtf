import { Background, Logo } from "@u0/ui";
import { constructMetadata, isDubDomain } from "@u0/utils";
import prisma from "@/lib/prisma";
import PasswordForm from "./form";
import { notFound, redirect } from "next/navigation";

const title = "비밀번호가 필요합니다.";
const description =
  "이 링크는 비밀번호로 보호되어 있습니다. 확인하려면 비밀번호를 입력하십시오.";
const image = "https://u0.wtf/_static/password-protected.png";

export async function generateMetadata({
  params,
}: {
  params: { domain: string; key: string };
}) {
  const domain = params.domain;
  const key = decodeURIComponent(params.key);

  const link = await prisma.link.findUnique({
    where: {
      domain_key: {
        domain,
        key,
      },
    },
    select: {
      project: {
        select: {
          logo: true,
          plan: true,
        },
      },
    },
  });

  if (!link) {
    notFound();
  }

  return constructMetadata({
    title,
    description,
    image,
    ...(!isDubDomain(domain) &&
      link.project?.plan !== "free" &&
      link.project?.logo && {
        icons: link.project.logo,
      }),
    noIndex: true,
  });
}

export async function generateStaticParams() {
  const passwordProtectedLinks = await prisma.link.findMany({
    where: {
      password: {
        not: null,
      },
    },
    select: {
      domain: true,
      key: true,
    },
  });

  return passwordProtectedLinks.map(({ domain, key }) => ({
    params: {
      domain,
      key: encodeURIComponent(key),
    },
  }));
}

export default async function PasswordProtectedLinkPage({
  params,
}: {
  params: { domain: string; key: string };
}) {
  const domain = params.domain;
  const key = decodeURIComponent(params.key);

  const link = await prisma.link.findUnique({
    where: {
      domain_key: {
        domain,
        key,
      },
    },
    select: {
      password: true,
      url: true,
      project: {
        select: {
          name: true,
          logo: true,
          plan: true,
        },
      },
    },
  });

  if (!link) {
    notFound();
  }

  if (!link.password) {
    redirect(link.url);
  }

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <Background />
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          {!isDubDomain(domain) &&
          link.project?.plan !== "free" &&
          link.project?.logo ? (
            <img
              src={link.project.logo}
              alt={link.project.name}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <a href="https://u0.wtf" target="_blank" rel="noreferrer">
              <Logo />
            </a>
          )}
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <PasswordForm />
      </div>
    </main>
  );
}
