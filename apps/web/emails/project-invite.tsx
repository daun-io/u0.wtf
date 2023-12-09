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

export default function ProjectInvite({
  email = "team@empty.app",
  url = "http://localhost:8888/api/auth/callback/email?callbackUrl=http%3A%2F%2Fapp.localhost%3A3000%2Flogin&token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&email=youremail@gmail.com",
  projectName = "Acme",
  projectUser = "Alan Turing",
  projectUserEmail = "alan.turing@example.com",
}: {
  email: string;
  url: string;
  projectName: string;
  projectUser: string | null;
  projectUserEmail: string | null;
}) {
  return (
    <Html>
      <Head />
      <Preview>U0 {projectName}에 합류하기</Preview>
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
              U0 {projectName}에 합류하기
            </Heading>
            {projectUser && projectUserEmail ? (
              <Text className="text-sm leading-6 text-black">
                <strong>{projectUser}</strong> (
                <Link
                  className="text-blue-600 no-underline"
                  href={`mailto:${projectUserEmail}`}
                >
                  {projectUserEmail}
                </Link>
                )님이 U0의 <strong>{projectName}</strong> 브랜드에
                초대하였습니다!
              </Text>
            ) : (
              <Text className="text-sm leading-6 text-black">
                U0의 <strong>{projectName}</strong> 브랜드에 초대받았습니다!
              </Text>
            )}
            <Section className="mb-8 text-center">
              <Link
                className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={url}
              >
                브랜드 가입
              </Link>
            </Section>
            <Text className="text-sm leading-6 text-black">
              또는 이 URL을 브라우저에 복사 및 붙여넣기 하세요:
            </Text>
            <Text className="max-w-sm flex-wrap break-words font-medium text-purple-600 no-underline">
              {url.replace(/^https?:\/\//, "")}
            </Text>
            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
