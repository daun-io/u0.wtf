import { detectBot, getFinalUrl, parse } from "@/lib/middleware/utils";
import { recordClick } from "@/lib/tinybird";
import { ratelimit, redis } from "@/lib/upstash";
import { DUB_HEADERS, LOCALHOST_GEO_DATA, LOCALHOST_IP } from "@u0/utils";
import { ipAddress } from "@vercel/edge";
import {
  NextFetchEvent,
  NextRequest,
  NextResponse,
  userAgent,
} from "next/server";
import { isBlacklistedReferrer } from "../edge-config";
import { getLinkViaEdge } from "../planetscale";

export default async function LinkMiddleware(
  req: NextRequest,
  ev: NextFetchEvent,
) {
  const { domain, fullKey: key } = parse(req);

  if (!domain || !key) {
    return NextResponse.next();
  }

  if (
    process.env.NODE_ENV !== "development" &&
    domain === "u0.wtf" &&
    key === "github"
  ) {
    if (await isBlacklistedReferrer(req.headers.get("referer"))) {
      return new Response("Don't DDoS me pls 🥺", { status: 429 });
    }
    const ip = ipAddress(req) || LOCALHOST_IP;
    const { success } = await ratelimit(10, "1 d").limit(
      `${ip}:${domain}:${key}`,
    );

    if (!success) {
      return new Response("Don't DDoS me pls 🥺", { status: 429 });
    }
  }

  const inspectMode = key.endsWith("+");

  const response = await redis.get<{
    url: string;
    password?: boolean;
    proxy?: boolean;
    rewrite?: boolean;
    iframeable?: boolean;
    ios?: string;
    android?: string;
    geo?: object;
  }>(
    // if inspect mode is enabled, remove the trailing `+` from the key
    `${domain}:${inspectMode ? key.slice(0, -1) : key}`,
  );

  const {
    url: target,
    password,
    proxy,
    rewrite,
    iframeable,
    ios,
    android,
    geo,
  } = response || {};

  if (target) {
    // only show inspect model if the link is not password protected
    if (inspectMode && !password) {
      return NextResponse.rewrite(
        new URL(`/inspect/${domain}/${encodeURIComponent(key)}`, req.url),
      );
    }

    if (password) {
      const pw = req.nextUrl.searchParams.get("pw");

      // rewrite to auth page (/protected/[domain]/[key]) if:
      // - no `pw` param is provided
      // - the `pw` param is incorrect
      // this will also ensure that no clicks are tracked unless the password is correct
      if (!pw || (await getLinkViaEdge(domain, key))?.password !== pw) {
        return NextResponse.rewrite(
          new URL(`/protected/${domain}/${encodeURIComponent(key)}`, req.url),
        );
      } else if (pw) {
        // strip it from the URL if it's correct
        req.nextUrl.searchParams.delete("pw");
      }
    }

    // only track the click when there is no `u0-no-track` header
    if (!req.headers.get("u0-no-track")) {
      ev.waitUntil(recordClick({ req, domain, key }));
    }

    const isBot = detectBot(req);

    const { country } =
      process.env.VERCEL === "1" && req.geo ? req.geo : LOCALHOST_GEO_DATA;

    // rewrite to proxy page (/_proxy/[domain]/[key]) if it's a bot and proxy is enabled
    if (isBot && proxy) {
      return NextResponse.rewrite(
        new URL(`/proxy/${domain}/${encodeURIComponent(key)}`, req.url),
      );

      // rewrite to target URL if link cloaking is enabled
    } else if (rewrite) {
      if (iframeable) {
        return NextResponse.rewrite(
          new URL(`/rewrite/${target}`, req.url),
          DUB_HEADERS,
        );
      } else {
        // if link is not iframeable, use Next.js rewrite instead
        return NextResponse.rewrite(decodeURIComponent(target), DUB_HEADERS);
      }

      // redirect to iOS link if it is specified and the user is on an iOS device
    } else if (ios && userAgent(req).os?.name === "iOS") {
      return NextResponse.redirect(getFinalUrl(ios, { req }), DUB_HEADERS);

      // redirect to Android link if it is specified and the user is on an Android device
    } else if (android && userAgent(req).os?.name === "Android") {
      return NextResponse.redirect(getFinalUrl(android, { req }), DUB_HEADERS);

      // redirect to geo-specific link if it is specified and the user is in the specified country
    } else if (geo && country && country in geo) {
      return NextResponse.redirect(
        getFinalUrl(geo[country], { req }),
        DUB_HEADERS,
      );

      // regular redirect
    } else {
      return NextResponse.redirect(getFinalUrl(target, { req }), DUB_HEADERS);
    }
  } else {
    // short link not found, redirect to root
    return NextResponse.redirect(new URL("/", req.url), DUB_HEADERS);
  }
}
