import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { randomBadgeColor } from "@/ui/links/tag-badge";
import { NextResponse } from "next/server";

// GET /api/projects/[slug]/tags - get all tags for a project
export const GET = withAuth(async ({ project, headers }) => {
  const tags = await prisma.tag.findMany({
    where: {
      projectId: project.id,
    },
    select: {
      id: true,
      name: true,
      color: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  return NextResponse.json(tags, { headers });
});

// POST /api/projects/[slug]/tags - create a tag for a project
export const POST = withAuth(async ({ req, project, headers }) => {
  const tagsCount = await prisma.tag.count({
    where: {
      projectId: project.id,
    },
  });
  if (project.plan === "free" && tagsCount >= 3) {
    return new Response(
      "무료 플랜에서는 3개의 태그만 생성할 수 있습니다. 무제한 태그를 생성하려면 프로로 업그레이드하세요.",
      {
        status: 403,
      },
    );
  }
  const { tag } = await req.json();
  const response = await prisma.tag.create({
    data: {
      name: tag,
      color: randomBadgeColor(),
      projectId: project.id,
    },
  });
  return NextResponse.json(response, { headers });
});
