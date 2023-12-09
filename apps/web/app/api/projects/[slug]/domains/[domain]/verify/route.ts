import { withAuth } from "@/lib/auth";
import {
  getConfigResponse,
  getDomainResponse,
  verifyDomain,
} from "@/lib/api/domains";
import prisma from "@/lib/prisma";
import { DomainVerificationStatusProps } from "@/lib/types";
import { NextResponse } from "next/server";

// GET /api/projects/[slug]/domains/[domain]/verify - get domain verification status
export const GET = withAuth(async ({ domain }) => {
  let status: DomainVerificationStatusProps = "올바르게 설정됨";

  const [domainJson, configJson] = await Promise.all([
    getDomainResponse(domain),
    getConfigResponse(domain),
  ]);

  if (domainJson?.error?.code === "not_found") {
    // 도메인을 찾지 못함 on Vercel project
    status = "도메인을 찾지 못함";
    return NextResponse.json({ status, response: { configJson, domainJson } });
  } else if (domainJson.error) {
    status = "알 수 없는 오류";
    return NextResponse.json({ status, response: { configJson, domainJson } });
  }

  /**
   * Domain has DNS conflicts
   */
  if (configJson?.conflicts.length > 0) {
    status = "DNS 레코드 충돌";
    return NextResponse.json({ status, response: { configJson, domainJson } });
  }

  /**
   * If domain is not verified, we try to verify now
   */
  if (!domainJson.verified) {
    status = "인증 대기중";
    const verificationJson = await verifyDomain(domain);

    if (verificationJson && verificationJson.verified) {
      /**
       * Domain was just verified
       */
      status = "올바르게 설정됨";
    }

    return NextResponse.json({
      status,
      response: { configJson, domainJson, verificationJson },
    });
  }

  let prismaResponse: any = null;
  if (!configJson.misconfigured) {
    prismaResponse = await prisma.domain.update({
      where: {
        slug: domain,
      },
      data: {
        verified: true,
        lastChecked: new Date(),
      },
    });
  } else {
    status = "유효하지 않은 설정";
    prismaResponse = await prisma.domain.update({
      where: {
        slug: domain,
      },
      data: {
        verified: false,
        lastChecked: new Date(),
      },
    });
  }

  return NextResponse.json({
    status,
    response: { configJson, domainJson, prismaResponse },
  });
});
