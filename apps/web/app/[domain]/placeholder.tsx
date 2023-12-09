"use client";

import { BlurImage } from "@/ui/shared/blur-image";
import { STAGGER_CHILD_VARIANTS } from "@u0/utils";
import va from "@vercel/analytics";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

export default function PlaceholderContent() {
  const { domain } = useParams() as { domain: string };

  return (
    <motion.div
      className="z-10 my-40"
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
        <div className="mx-5 flex flex-col items-start gap-16 lg:mx-0">
          <motion.h1
            className=" gap-2 text-left text-5xl font-bold tabular-nums text-gray-800 transition-colors sm:text-7xl"
            variants={STAGGER_CHILD_VARIANTS}
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              브랜드
            </span>
            를 <br />
            알리는 <br /> 짧은 URL
          </motion.h1>
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
      </motion.div>
    </motion.div>
  );
}
