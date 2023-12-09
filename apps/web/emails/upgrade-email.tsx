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

export default function UpgradeEmail({
  name = "Brendon Urie",
  email = "alan.turing@example.com",
  plan = "Pro",
}: {
  name: string | null;
  email: string;
  plan: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>U0 {plan} 플랜을 구매해주셔서 감사합니다!</Preview>
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
              U0 {plan} 플랜을 구매해주셔서 감사합니다!
            </Heading>
            <Section className="my-8">
              <Img
                src="https://public.blob.vercel-storage.com/kmKY9FhOzDRAX28c/thank-you-PCJDehD1yOJdagchd7TuDCI0JnXVo7.png"
                alt="Thank you"
                className="max-w-[500px]"
              />
            </Section>
            <Text className="text-sm leading-6 text-black">
              안녕하세요{name && `, ${name}`}님!
            </Text>
            <Text className="text-sm leading-6 text-black">
              U0를 개발하고 있는 다운이라고 해요. 유저분들의 지원은 우리에게
              매우 중요하며, U0를 계속 개발하고 개선하는 데 도움이 됩니다.
            </Text>
            <Text className="text-sm leading-6 text-black">
              {plan} 플랜에서는 다음에 액세스할 수 있습니다:
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ {plan === "Enterprise" ? "무제한" : "최대 50K"} 링크 클릭/월
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ QR 코드에 대한 사용자 정의 브랜딩
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ 루트 도메인을 선택한 URL로 리디렉션
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ 무제한 팀원
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ 무제한 링크 기록
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ 무제한 태그
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ API 액세스
            </Text>
            {plan === "Enterprise" && (
              <Text className="ml-1 text-sm leading-4 text-black">
                ◆ 우선 지원
              </Text>
            )}
            <Text className="text-sm leading-6 text-black">
              궁금한 점이나 피드백이 있으면 언제든지 알려주세요. 도와드리기 위해
              항상 준비되어 있습니다!
            </Text>
            <Text className="text-sm font-light leading-6 text-gray-400">
              U0의 다운 드림
            </Text>

            <Footer email={email} marketing />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
