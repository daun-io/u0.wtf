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

export default function DomainDeleted({
  email = "alan.turing@example.com",
  domain = "u0.wtf",
  projectSlug = "u0",
}: {
  email: string;
  domain: string;
  projectSlug: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>도메인이 삭제되었습니다.</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Section className="mt-8">
              <Img
                src={U0_LOGO}
                width="40"
                height="40"
                alt="Dub"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
              도메인이 삭제되었습니다.
            </Heading>
            <Text className="text-sm leading-6 text-black">
              U0 프로젝트{" "}
              <Link
                href={`https://app.u0.wtf/${projectSlug}`}
                className="font-medium text-blue-600 no-underline"
              >
                {projectSlug}↗
              </Link>{" "}
              에 대한 도메인 <code className="text-purple-600">{domain}</code>이
              30일 동안 유효하지 않았습니다. 결과적으로, U0에서 삭제되었습니다.
            </Text>
            <Text className="text-sm leading-6 text-black">
              도메인을 복원하려면 아래 링크를 통해 U0에서 쉽게 다시 생성할 수
              있습니다.
            </Text>
            <Section className="my-8 text-center">
              <Link
                className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={`https://app.u0.wtf/${projectSlug}/domains`}
              >
                도메인 추가
              </Link>
            </Section>
            <Text className="text-sm leading-6 text-black">
              이 도메인을 U0에서 계속 사용하고 싶지 않았다면, 이 이메일을
              무시하면 됩니다.
            </Text>
            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
