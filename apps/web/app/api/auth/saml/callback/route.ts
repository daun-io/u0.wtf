import jackson from "@/lib/jackson";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { oauthController } = await jackson();

  const formData = await req.formData();

  const RelayState = formData.get("RelayState");
  const SAMLResponse = formData.get("SAMLResponse");

  const { redirect_url } = await oauthController.samlResponse({
    RelayState: RelayState as string,
    SAMLResponse: SAMLResponse as string,
  });

  if (!redirect_url) {
    return new Response("리다이렉트 URL을 찾지 못했습니다.", {
      status: 400,
    });
  }

  return NextResponse.redirect(redirect_url, {
    status: 302,
  });
}
