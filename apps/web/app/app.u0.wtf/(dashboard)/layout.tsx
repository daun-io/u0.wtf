import { constructMetadata } from "@u0/utils";
import { Divider } from "@/ui/shared/icons";
import { Logo, LogoType, MaxWidthWrapper } from "@u0/ui";
import { HOME_DOMAIN } from "@u0/utils";
import Link from "next/link";
import { ReactNode, Suspense } from "react";
import UserDropdown from "@/ui/layout/user-dropdown";
import ProjectSelect from "@/ui/layout/project-select";
import NavTabs from "@/ui/layout/nav-tabs";
import UpgradeBanner from "@/ui/layout/upgrade-banner";
import Providers from "./providers";

export const dynamic = "force-static";
export const metadata = constructMetadata();

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen w-full bg-gray-50">
        <div className="sticky left-0 right-0 top-0 z-20 border-b border-gray-200 bg-white">
          <MaxWidthWrapper>
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <Link
                  href="/"
                  className="flex items-center gap-1 transition-all duration-75 active:scale-95"
                >
                  <Logo className="h-8 w-8" />
                  <span className="font-mono">U0</span>
                </Link>
                <Divider className="h-8 w-8 text-gray-200 sm:ml-3" />
                <ProjectSelect />
                <UpgradeBanner />
              </div>
              <div className="flex items-center space-x-6">
                <UserDropdown />
              </div>
            </div>
            <Suspense fallback={<div className="h-12 w-full" />}>
              <NavTabs />
            </Suspense>
          </MaxWidthWrapper>
        </div>
        {children}
      </div>
    </Providers>
  );
}
