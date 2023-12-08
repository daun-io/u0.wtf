"use client";

import { InlineSnippet } from "@u0/ui";
import { STAGGER_CHILD_VARIANTS } from "@u0/utils";
import Spline from "@splinetool/react-spline";
import va from "@vercel/analytics";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useDebounce } from "use-debounce";

export default function PlaceholderContent() {
  const { domain } = useParams() as { domain: string };
  const [loading, setLoading] = useState(true);
  const onLoad = () => {
    setLoading(false);
  };
  // workarouond to avoid the blinking effect when Spline loads
  const [opacity] = useDebounce(loading ? 0 : 1, 200);

  const [showText] = useDebounce(loading ? false : true, 800);

  return (
    <motion.div
      className="z-10 mb-20"
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
        animate={showText ? "show" : "hidden"}
        className="mx-5 flex flex-col items-center space-y-10 text-center sm:mx-auto"
      >
        <motion.h1
          className="font-display text-4xl font-bold text-gray-800 transition-colors sm:text-5xl"
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
          Create Your Free Branded Link
        </motion.a>
      </motion.div>
    </motion.div>
  );
}
