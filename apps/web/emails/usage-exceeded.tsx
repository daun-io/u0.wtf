import { U0_LOGO, capitalize, nFormatter } from "@u0/utils";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { ProjectProps } from "../lib/types";
import Footer from "./components/footer";

export default function UsageExceeded({
  email = "alan.turing@example.com",
  project = {
    id: "ckqf1q3xw0000gk5u2q1q2q1q",
    name: "Acme",
    slug: "acme",
    usage: 2410,
    usageLimit: 1000,
    plan: "free",
  },
  type = "first",
}: {
  email: string;
  project: ProjectProps;
  type: "first" | "second";
}) {
  const { slug, name, usage, usageLimit, plan } = project;
  return (
    <Html>
      <Head />
      <Preview>사용량 한도에 도달했어요.</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Section className="mt-8">
              <Img
                src={U0_LOGO}
                width="40"
                height="40"
                alt="U0"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
              사용량 한도에 도달했어요.
            </Heading>
            <Text className="text-sm leading-6 text-black">
              U0 브랜드인 <strong> {name} </strong>이(가)
              <strong> {capitalize(plan)} 플랜 </strong>
              한도인 <strong>{nFormatter(usageLimit)} 링크 클릭</strong>을
              초과했습니다. 현재 청구 주기에서 모든 브랜드에 대해
              <strong>{nFormatter(usage, { digits: 2 })} 링크 클릭</strong>을
              사용했습니다.
            </Text>
            <Text className="text-sm leading-6 text-black">
              기존의 모든 링크는 계속 작동하며, 데이터를 수집하고 있지만, 통계를
              보거나, 링크를 수정하거나, 링크를 추가하려면 업그레이드가
              필요합니다.
            </Text>
            <Section className="my-8 text-center">
              <Link
                className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={`https://app.u0.wtf/${slug}/settings/billing`}
              >
                플랜 업그레이드
              </Link>
            </Section>
            <Text className="text-sm leading-6 text-black">
              당신의 메일함을 존중하기 위해,
              {type === "first"
                ? "3일 후에 이에 대해 한 번 더 이메일을 보내드릴 것입니다"
                : "현재 청구 주기에 대해 이에 대해 이메일을 보내드릴 마지막 시간입니다"}
              . 업그레이드를 계획하지 않는 경우 이 이메일을 무시하거나, 질문이
              있으면 알려주세요!
            </Text>
            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
