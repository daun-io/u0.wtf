"use client";

import { Logo } from "@u0/ui";
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
              staggerChildren: 0.3,
            },
          },
        }}
        initial="hidden"
        animate={"show"}
        className="mx-5 flex flex-col items-center space-y-10 text-center sm:mx-auto"
      >
        <motion.h1
          className="flex items-center justify-center gap-2 font-mono text-4xl font-medium tabular-nums text-gray-800 transition-colors"
          variants={STAGGER_CHILD_VARIANTS}
        >
          U0.WTF
        </motion.h1>
        <motion.a
          variants={STAGGER_CHILD_VARIANTS}
          href="https://u0.wtf"
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
      </motion.div>
    </motion.div>
  );
}
