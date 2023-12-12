import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/landing – get consumer metrics
export const GET = async () => {
  const totalLinks = await prisma.link.count();
  const activeProjects = await prisma.project.count();
  const analyzedClicks = await prisma.link.aggregate({
    _sum: {
      clicks: true,
    },
  });

  return new NextResponse(
    JSON.stringify({
      totalLinks,
      activeProjects,
      analyzedClicks: analyzedClicks._sum.clicks,
    }),
  );
};
