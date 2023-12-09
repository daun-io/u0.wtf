import { U0_LOGO, DUB_THUMBNAIL } from "@u0/utils";
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

export default function WelcomeEmail({
  name = "Alan Turing",
  email = "alan.turing@example.com",
}: {
  name: string | null;
  email: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>U0에 가입해주셔서 감사합니다.</Preview>
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
              U0에 가입해주셔서 감사합니다.
            </Heading>
            <Section className="my-8">
              <Img src={DUB_THUMBNAIL} alt="Dub" className="max-w-[500px]" />
            </Section>
            <Text className="text-sm leading-6 text-black">
              가입해주셔서 감사해요, {name && `, ${name}`}님!
            </Text>
            <Text className="text-sm leading-6 text-black">
              U0에서 바로 사용해볼 수 있는 기능들이에요.
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆{" "}
              <Link
                href="https://app.u0.wtf/links"
                className="font-medium text-blue-600 no-underline"
              >
                U0.wtf 짧은 URL
              </Link>
              {" 생성하기"}
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ 나만의{" "}
              <Link
                href="https://app.u0.wtf"
                className="font-medium text-blue-600 no-underline"
              >
                브랜드
              </Link>{" "}
              와 커스텀 도메인 추가하기
            </Text>

            <Footer email={email} marketing />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
