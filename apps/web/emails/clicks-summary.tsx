import { U0_LOGO, nFormatter, truncate } from "@u0/utils";
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Link2, MousePointerClick } from "lucide-react";
import Footer from "./components/footer";

export default function ClicksSummary({
  email = "alan.turing@example.com",
  projectName = "Acme",
  projectSlug = "acme",
  totalClicks = 63689,
  createdLinks = 25,
  topLinks = [
    {
      link: "acme.com/sales",
      clicks: 2187,
    },
    {
      link: "acme.com/instagram",
      clicks: 1820,
    },
    {
      link: "acme.com/facebook",
      clicks: 1552,
    },
    {
      link: "acme.com/twitter",
      clicks: 1229,
    },
    {
      link: "acme.com/linkedin",
      clicks: 1055,
    },
  ],
}: {
  email: string;
  projectName: string;
  projectSlug: string;
  totalClicks: number;
  createdLinks: number;
  topLinks: {
    link: string;
    clicks: number;
  }[];
}) {
  return (
    <Html>
      <Head />
      <Preview>{projectName} 브랜드의 30일 U0 요약</Preview>
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
              {projectName} 브랜드의 30일 U0 요약
            </Heading>
            <Text className="text-sm leading-6 text-black">
              지난 30일 동안, 당신의 U0 브랜드인 <strong>{projectName}</strong>
              은 <strong>{nFormatter(totalClicks)} 링크 클릭</strong>을
              받았습니다. 그 기간 동안{" "}
              <strong>{createdLinks}개의 새로운 링크</strong>를 생성했습니다.
            </Text>
            <Section>
              <Row>
                <Column align="center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-200">
                    <MousePointerClick className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-black">
                    {nFormatter(totalClicks)} 클릭
                  </p>
                </Column>
                <Column align="center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-200">
                    <Link2 className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm font-semibold text-black">
                    {nFormatter(createdLinks)}개의 새로운 링크
                  </p>
                </Column>
              </Row>
            </Section>
            {topLinks.length > 0 && (
              <>
                <Text className="text-sm leading-6 text-black">
                  다음은 가장 잘 수행된 링크 {topLinks.length}개입니다:
                </Text>
                <Section>
                  <Row className="pb-2">
                    <Column align="left" className="text-sm text-gray-500">
                      링크
                    </Column>
                    <Column align="right" className="text-sm text-gray-500">
                      클릭
                    </Column>
                  </Row>
                  {topLinks.map(({ link, clicks }, index) => (
                    <div key={index}>
                      <Row>
                        <Column align="left" className="text-sm font-medium">
                          {truncate(link, 30)}
                        </Column>
                        <Column align="right" className="text-sm text-gray-600">
                          {nFormatter(clicks)}
                        </Column>
                      </Row>
                      {index !== topLinks.length - 1 && (
                        <Hr className="my-2 w-full border border-gray-200" />
                      )}
                    </div>
                  ))}
                </Section>
              </>
            )}
            {createdLinks === 0 ? (
              <>
                <Text className="text-sm leading-6 text-black">
                  지난 30일 동안 아무런 링크도 생성하지 않은 것 같습니다. 도움이
                  필요하다면 이 이메일에 답장하여 저희에게 연락해 주세요.
                </Text>

                <Section className="my-8 text-center">
                  <Link
                    className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
                    href={`https://app.u0.wtf/${projectSlug}`}
                  >
                    링크 생성 시작
                  </Link>
                </Section>
              </>
            ) : (
              <>
                <Text className="mt-10 text-sm leading-6 text-black">
                  아래 버튼을 클릭하면 전체 통계를 볼 수 있습니다.
                </Text>
                <Section className="my-8 text-center">
                  <Link
                    className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
                    href={`https://app.u0.wtf/${projectSlug}/analytics?interval=30d`}
                  >
                    내 통계 보기
                  </Link>
                </Section>
              </>
            )}
            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
