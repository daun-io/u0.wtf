import { STAGGER_CHILD_VARIANTS } from "@u0/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDebounce } from "use-debounce";

export default function Intro() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  return (
    <motion.div
      className="z-10"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      <motion.div
        variants={{
          show: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
        initial="hidden"
        animate="show"
        className="mx-5 flex flex-col items-center space-y-10 text-center sm:mx-auto"
      >
        <motion.h1
          className="font-display text-4xl font-bold text-gray-800 transition-colors sm:text-5xl"
          variants={STAGGER_CHILD_VARIANTS}
        >
          U0.WTF
        </motion.h1>
        <motion.p
          className="max-w-md text-gray-600 transition-colors sm:text-lg"
          variants={STAGGER_CHILD_VARIANTS}
        >
          U0.WTF는 URL 공유 성과를 측정하고 브랜드를 알릴 수 있도록 돕는 축약
          도구입니다.
        </motion.p>
        <motion.button
          variants={STAGGER_CHILD_VARIANTS}
          className="rounded-full bg-gray-800 px-10 py-2 font-medium text-white transition-colors hover:bg-black"
          onClick={() => router.push("/welcome?type=interim")}
        >
          시작하기
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
