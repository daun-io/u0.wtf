import { U0_LOGO } from "@u0/utils";
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
import Footer from "./components/footer";

export default function InvalidDomain({
  email = "alan.turing@example.com",
  domain = "u0.wtf",
  projectSlug = "u0",
  invalidDays = 14,
}: {
  email: string;
  domain: string;
  projectSlug: string;
  invalidDays: number;
}): JSX.Element {
  return (
    <Html>
      <Head />
      <Preview>잘못된 도메인 구성</Preview>
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
              잘못된 도메인 구성
            </Heading>
            <Text className="text-sm leading-6 text-black">
              U0 프로젝트{" "}
              <Link
                href={`https://app.u0.wtf/${projectSlug}`}
                className="font-medium text-blue-600 no-underline"
              >
                {projectSlug}↗
              </Link>{" "}
              의 도메인 <code className="text-purple-600">{domain}</code>이(가){" "}
              {invalidDays}일 동안 잘못 구성되어 있습니다.
            </Text>
            <Text className="text-sm leading-6 text-black">
              도메인이 30일 동안 구성되지 않으면 자동으로 U0에서 삭제됩니다.
              아래 링크를 클릭하여 도메인을 구성하십시오.
            </Text>
            <Section className="my-8 text-center">
              <Link
                className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={`https://app.u0.wtf/${projectSlug}/domains`}
              >
                도메인 구성
              </Link>
            </Section>
            <Text className="text-sm leading-6 text-black">
              이 도메인을 U0에서 유지하고 싶지 않다면,{" "}
              <Link
                href={`https://app.u0.wtf/${projectSlug}/domains`}
                className="font-medium text-blue-600 no-underline"
              >
                삭제
              </Link>{" "}
              하거나 이 이메일을 무시하십시오. 유저분의 메일함을 존중하기 위해,{" "}
              {invalidDays < 28
                ? `저희는 ${
                    28 - invalidDays
                  }일 후에 이에 대해 한 번 더 이메일을 보내드릴 것입니다.`
                : "이것이 이 문제에 대해 우리가 보내드릴 마지막 이메일입니다."}
            </Text>
            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
