"use client";

import { BlurImage } from "@/ui/shared/blur-image";
import { STAGGER_CHILD_VARIANTS } from "@u0/utils";
import va from "@vercel/analytics";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import useSWR from "swr";

export default function PlaceholderContent() {
  const { domain } = useParams() as { domain: string };
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data } = useSWR("/api/landing", fetcher);

  return (
    <motion.div
      className="z-10 my-20"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <motion.div
        variants={{
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
        initial="hidden"
        animate={"show"}
        className="flex flex-col items-center space-y-10 text-center sm:mx-auto"
      >
        <div className="mx-5 flex flex-col items-center gap-16 lg:mx-0">
          <motion.h1
            className="gap-2 text-5xl font-bold tabular-nums text-black transition-colors sm:text-7xl"
            variants={STAGGER_CHILD_VARIANTS}
          >
            <span className="bg-gradient-to-r from-gray-500 via-gray-700 to-black bg-clip-text text-transparent">
              브랜드
            </span>
            를 <br />
            알리는 <br /> 짧은 URL
          </motion.h1>
          <motion.p
            className="gap-2 text-lg font-medium tabular-nums tracking-tight text-gray-500 transition-colors sm:text-2xl"
            variants={STAGGER_CHILD_VARIANTS}
          >
            u0.wtf가 7월 1일 서비스를 종료합니다.
          </motion.p>
          <motion.a
            variants={STAGGER_CHILD_VARIANTS}
            href="https://app.u0.wtf"
            onClick={() =>
              va.track("Referred from custom domain", {
                domain,
                medium: "button",
              })
            }
            className="rounded-full bg-gray-800 px-10 py-2 font-medium text-white transition-colors hover:bg-black"
          >
            무료로 짧은 브랜드 URL 만들기
          </motion.a>
          <BlurImage
            src="/_static/screen.jpg"
            alt="screenshot of u0.wtf"
            width={1002}
            height={759}
            className="rounded-lg border border-black/10"
          />
        </div>
        <motion.p
          className="gap-2 text-left text-lg font-medium tabular-nums tracking-tight text-gray-500 transition-colors sm:text-2xl"
          variants={STAGGER_CHILD_VARIANTS}
        >
          최고의 브랜드들이 U0로 링크를 생성하기 시작했습니다.
        </motion.p>
        {data && (
          <motion.div
            className="z-10 grid w-screen grid-cols-3 border-y bg-gray-100/50 py-16 tabular-nums backdrop-blur"
            variants={STAGGER_CHILD_VARIANTS}
          >
            <div className="flex w-full flex-col gap-2">
              <div className="text-5xl font-bold text-black">
                {data?.activeProjects}
              </div>
              <div className="font-bold text-gray-500">활성 브랜드</div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <div className="text-5xl font-bold text-black">
                {data?.totalLinks}
              </div>
              <div className="font-bold text-gray-500">생성된 링크</div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <div className="text-5xl font-bold text-black">
                {data?.analyzedClicks}
              </div>
              <div className="font-bold text-gray-500">분석된 클릭</div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
