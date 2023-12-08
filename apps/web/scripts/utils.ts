import { Redis } from "@upstash/redis";
import { Resend } from "resend";

// Initiate Redis instance by connecting to REST URL
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

export const resend = new Resend(process.env.RESEND_API_KEY);

export function linkConstructor({
  key,
  domain = "u0.wtf",
  localhost,
  pretty,
  noDomain,
}: {
  key: string;
  domain?: string;
  localhost?: boolean;
  pretty?: boolean;
  noDomain?: boolean;
}) {
  const link = `${
    localhost ? "http://home.localhost:8888" : `https://${domain}`
  }${key !== "_root" ? `/${key}` : ""}`;

  if (noDomain) return `/${key}`;
  return pretty ? link.replace(/^https?:\/\//, "") : link;
}
