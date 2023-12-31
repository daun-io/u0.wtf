import { pretendard, satoshi } from "@/styles/fonts";
import { GeistMono } from "geist/font/mono";
import "@/styles/globals.css";
import { cn, constructMetadata } from "@u0/utils";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={cn(satoshi.variable, pretendard.variable, GeistMono.variable)}
    >
      <body>
        <Toaster closeButton />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
