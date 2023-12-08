import { addLink, getLinksForProject, processLink } from "@/lib/api/links";
import { withAuth } from "@/lib/auth";
import { ratelimit } from "@/lib/upstash";
import {
  DUB_PROJECT_ID,
  GOOGLE_FAVICON_URL,
  LOCALHOST_IP,
  getApexDomain,
  log,
} from "@u0/utils";
import { NextResponse } from "next/server";

// GET /api/links – get all user links
export const GET = withAuth(
  async ({ headers, searchParams, project, session }) => {
    const { domain, tagId, search, sort, page, userId, showArchived } =
      searchParams as {
        domain?: string;
        tagId?: string;
        search?: string;
        sort?: "createdAt" | "clicks" | "lastClicked";
        page?: string;
        userId?: string;
        showArchived?: string;
      };
    const response = await getLinksForProject({
      projectId: project?.id || DUB_PROJECT_ID,
      domain,
      tagId,
      search,
      sort,
      page,
      userId: project?.id ? userId : session.user.id,
      showArchived: showArchived === "true" ? true : false,
    });
    return NextResponse.json(response, {
      headers,
    });
  },
);

// POST /api/links – create a new link
export const POST = withAuth(
  async ({ req, headers, session, project }) => {
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return new Response("Missing or invalid body.", { status: 400, headers });
    }

    const { link, error, status } = await processLink({
      payload: body,
      project,
      session,
    });

    if (error) {
      return new Response(error, { status, headers });
    }

    if (!session) {
      const ip = req.headers.get("x-forwarded-for") || LOCALHOST_IP;
      const { success } = await ratelimit(10, "1 d").limit(ip);

      if (!success) {
        return new Response(
          "Rate limited – you can only create up to 10 links per day without an account.",
          { status: 429 },
        );
      }
    }

    const [response, invalidFavicon] = await Promise.allSettled([
      addLink(link),
      ...(!project
        ? [
            fetch(`${GOOGLE_FAVICON_URL}${getApexDomain(link.url)}`).then(
              (res) => !res.ok,
            ),
          ]
        : []),
      // @ts-ignore
    ]).then((results) => results.map((result) => result.value));

    if (response === null) {
      return new Response("Duplicate key: this short link already exists.", {
        status: 409,
        headers,
      });
    }

    if (!project && invalidFavicon) {
      await log({
        message: `*${
          session?.user?.email || "Anonymous User"
        }* created a new link (${link.domain}/${link.key}) for ${link.url} ${
          invalidFavicon ? " but it has an invalid favicon :thinking_face:" : ""
        }`,
        type: "links",
        mention: true,
      });
    }

    return NextResponse.json(response, { headers });
  },
  {
    needNotExceededUsage: true,
    allowAnonymous: true,
  },
);
