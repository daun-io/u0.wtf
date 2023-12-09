"use client";

import { ALL_TOOLS } from "@u0/utils";
import va from "@vercel/analytics";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FEATURES_LIST } from "./content";
import { LogoType } from "./icons";
import { MaxWidthWrapper } from "./max-width-wrapper";

const navigation = {
  features: FEATURES_LIST.map(({ shortTitle, slug }) => ({
    name: shortTitle,
    href: `/${slug}`,
  })),
  product: [
    { name: "Blog", href: "/blog" },
    { name: "Changelog", href: "/changelog" },
    { name: "Customer Stories", href: "/customers" },
    { name: "Help Center", href: "/help" },
    { name: "Pricing", href: "/pricing" },
  ],
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Abuse", href: "/abuse" },
  ],
  tools: ALL_TOOLS.map(({ name, slug }) => ({
    name,
    href: `/tools/${slug}`,
  })),
};

export function Footer() {
  const { domain = "u0.wtf" } = useParams() as { domain: string };

  const createHref = (href: string) =>
    domain === "u0.wtf" ? href : `https://u0.wtf${href}`;

  return (
    <footer className="z-10 border-t border-gray-200 bg-white/50 py-8 backdrop-blur-lg">
      <MaxWidthWrapper className="pt-10">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link
              href={createHref("/")}
              {...(domain !== "u0.wtf" && {
                onClick: () => {
                  va.track("Referred from custom domain", {
                    domain,
                    medium: `footer item (logo)`,
                  });
                },
              })}
            >
              <span className="sr-only">U0.wtf Logo</span>
              <LogoType className="h-7 text-gray-600" />
            </Link>
            <p className="max-w-xs text-sm text-gray-500">
              U0.WTF는 URL 공유 성과를 측정하고 브랜드를 알릴 수 있도록 돕는
              축약 도구입니다.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-4 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-600">Legal</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={createHref(item.href)}
                        {...(domain !== "u0.wtf" && {
                          onClick: () => {
                            va.track("Referred from custom domain", {
                              domain,
                              medium: `footer item (${item.name})`,
                            });
                          },
                        })}
                        className="text-sm text-gray-500 hover:text-gray-900"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-sm leading-5 text-gray-500">
            © {new Date().getFullYear()} U0.wtf
          </p>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}
