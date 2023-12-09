"use client";

import { APP_DOMAIN, cn, fetcher } from "@u0/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { navItems } from "./nav";

export function NavMobile() {
  const { domain = "u0.wtf" } = useParams() as { domain: string };
  const [open, setOpen] = useState(false);
  const [openFeatures, setOpenFeatures] = useState(false);
  // prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  const { data: session, isLoading } = useSWR(
    domain === "u0.wtf" && "/api/auth/session",
    fetcher,
    {
      dedupingInterval: 60000,
    },
  );

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed right-3 top-3 z-40 rounded-full p-2 transition-colors duration-200 hover:bg-gray-200 focus:outline-none active:bg-gray-300 lg:hidden",
          open && "hover:bg-gray-100 active:bg-gray-200",
        )}
      >
        {open ? (
          <X className="h-5 w-5 text-gray-600" />
        ) : (
          <Menu className="h-5 w-5 text-gray-600" />
        )}
      </button>
      <nav
        className={cn(
          "fixed inset-0 z-20 hidden w-full bg-white px-5 py-16 lg:hidden",
          open && "block",
        )}
      >
        <ul className="grid divide-y divide-gray-200">
          {navItems.map(({ name, slug }) => (
            <li key={slug} className="py-3">
              <Link
                href={
                  domain === "u0.wtf" ? `/${slug}` : `https://u0.wtf/${slug}`
                }
                onClick={() => setOpen(false)}
                className="flex w-full font-semibold capitalize"
              >
                {name}
              </Link>
            </li>
          ))}

          {session && Object.keys(session).length > 0 ? (
            <li className="py-3">
              <Link
                href={APP_DOMAIN}
                className="flex w-full font-semibold capitalize"
              >
                대쉬보드
              </Link>
            </li>
          ) : (
            <>
              <li className="py-3">
                <Link
                  href={`${APP_DOMAIN}/login`}
                  className="flex w-full font-semibold capitalize"
                >
                  로그인
                </Link>
              </li>

              <li className="py-3">
                <Link
                  href={`${APP_DOMAIN}/register`}
                  className="flex w-full font-semibold capitalize"
                >
                  회원가입
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}
