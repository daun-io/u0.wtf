"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { APP_DOMAIN, SHOW_BACKGROUND_SEGMENTS, cn, fetcher } from "@u0/utils";
import va from "@vercel/analytics";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";
import useSWR from "swr";
import { useScroll } from "./hooks";
import { LogoType } from "./icons";
import { MaxWidthWrapper } from "./max-width-wrapper";

export const navItems = [
  // {
  //   name: "Customers",
  //   slug: "customers",
  // },
  // {
  //   name: "Help",
  //   slug: "help",
  // },
  // {
  //   name: "Pricing",
  //   slug: "pricing",
  // },
];

export function Nav() {
  const { domain = "u0.wtf" } = useParams() as { domain: string };
  const scrolled = useScroll(80);
  const selectedLayout = useSelectedLayoutSegment();
  const helpCenter = selectedLayout === "help";
  const { data: session, isLoading } = useSWR(
    domain === "u0.wtf" && "/api/auth/session",
    fetcher,
    {
      dedupingInterval: 60000,
    },
  );

  return (
    <div
      className={cn(`sticky inset-x-0 top-0 z-30 w-full transition-all`, {
        "border-b border-gray-200 bg-white/75 backdrop-blur-lg": scrolled,
        "border-b border-gray-200 bg-white":
          selectedLayout && !SHOW_BACKGROUND_SEGMENTS.includes(selectedLayout),
      })}
    >
      <MaxWidthWrapper
        {...(helpCenter && {
          className: "max-w-screen-lg",
        })}
      >
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href={domain === "u0.wtf" ? "/" : `https://u0.wtf`}
              {...(domain !== "u0.wtf" && {
                onClick: () => {
                  va.track("Referred from custom domain", {
                    domain,
                    medium: "logo",
                  });
                },
              })}
            >
              <LogoType />
            </Link>
            {helpCenter ? (
              <div className="flex items-center">
                <div className="mr-3 h-5 border-l-2 border-gray-400" />
                <Link
                  href="/help"
                  className="font-display text-lg font-bold text-gray-700"
                >
                  Help Center
                </Link>
              </div>
            ) : (
              <NavigationMenuPrimitive.Root
                delayDuration={0}
                className="relative hidden lg:block"
              >
                <NavigationMenuPrimitive.List className="flex flex-row space-x-2 p-4">
                  {navItems.map(({ name, slug }) => (
                    <NavigationMenuPrimitive.Item key={slug} asChild>
                      <Link
                        id={`nav-${slug}`}
                        key={slug}
                        href={
                          domain === "u0.wtf"
                            ? `/${slug}`
                            : `https://u0.wtf/${slug}`
                        }
                        {...(domain !== "u0.wtf" && {
                          onClick: () => {
                            va.track("Referred from custom domain", {
                              domain,
                              medium: `navbar item (${slug})`,
                            });
                          },
                        })}
                        className={cn(
                          "rounded-md px-3 py-2 text-sm font-medium text-gray-500 transition-colors ease-out hover:text-black",
                          {
                            "text-black": selectedLayout === slug,
                          },
                        )}
                      >
                        {name}
                      </Link>
                    </NavigationMenuPrimitive.Item>
                  ))}
                </NavigationMenuPrimitive.List>

                <NavigationMenuPrimitive.Viewport className="data-[state=closed]:animate-scale-out-content data-[state=open]:animate-scale-in-content absolute left-0 top-full flex w-[var(--radix-navigation-menu-viewport-width)] origin-[top_center] justify-start rounded-lg border border-gray-200 bg-white shadow-lg" />
              </NavigationMenuPrimitive.Root>
            )}
          </div>

          <div className="hidden lg:block">
            {session && Object.keys(session).length > 0 ? (
              <Link
                href={APP_DOMAIN}
                className="animate-fade-in rounded-full border border-black bg-black px-4 py-1.5 text-sm text-white transition-all hover:bg-white hover:text-black"
              >
                대쉬보드
              </Link>
            ) : !isLoading ? (
              <>
                <Link
                  href={`${APP_DOMAIN}/login`}
                  {...(domain !== "u0.wtf" && {
                    onClick: () => {
                      va.track("Referred from custom domain", {
                        domain,
                        medium: `navbar item (login)`,
                      });
                    },
                  })}
                  className="animate-fade-in rounded-full px-4 py-1.5 text-sm font-medium text-gray-500 transition-colors ease-out hover:text-black"
                >
                  로그인
                </Link>
                <Link
                  href={`${APP_DOMAIN}/register`}
                  {...(domain !== "u0.wtf" && {
                    onClick: () => {
                      va.track("Referred from custom domain", {
                        domain,
                        medium: `navbar item (signup)`,
                      });
                    },
                  })}
                  className="animate-fade-in rounded-full border border-black bg-black px-4 py-1.5 text-sm text-white transition-all hover:bg-white hover:text-black"
                >
                  회원가입
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
