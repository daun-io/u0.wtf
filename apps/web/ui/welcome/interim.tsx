import { BlurImage } from "@/ui/shared/blur-image";
import { Logo } from "@u0/ui";
import { STAGGER_CHILD_VARIANTS } from "@u0/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Interim() {
  const router = useRouter();
  return (
    <motion.div
      className="z-10 mx-5 my-auto flex flex-col items-center space-y-10 text-center sm:mx-auto"
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        show: {
          opacity: 1,
          scale: 1,
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
      initial="hidden"
      animate="show"
      exit="hidden"
      transition={{ duration: 0.3, type: "spring" }}
    >
      <motion.div
        variants={STAGGER_CHILD_VARIANTS}
        className="flex flex-col items-center space-y-5 text-center"
      >
        <Logo className="h-11 w-11" />
        <h1 className="font-display text-3xl font-semibold text-gray-800 transition-colors sm:text-4xl">
          시작하기
        </h1>
      </motion.div>
      <motion.p
        className="text-gray-600 transition-colors sm:text-lg"
        variants={STAGGER_CHILD_VARIANTS}
      >
        나만의 도메인이 있으신가요? 무료로 짧은 URL을 만들어 보세요.
        <br className="hidden sm:block" />
        도메인이 없나요?{" "}
        <a
          className="text-gray-500 underline transition-colors hover:text-gray-700"
          target="_blank"
          rel="noreferrer"
          href="https://u0.wtf"
        >
          u0.wtf
        </a>{" "}
        도메인으로 짧은 URL을 만들어보세요.
      </motion.p>
      <motion.div
        variants={STAGGER_CHILD_VARIANTS}
        className="grid w-full grid-cols-1 divide-y divide-gray-100 overflow-hidden rounded-md border border-gray-200 bg-white md:grid-cols-2 md:divide-x"
      >
        <button
          onClick={() => router.push("/welcome?type=project")}
          className="flex flex-col items-center justify-center overflow-hidden p-5 transition-colors hover:bg-gray-50 md:p-10"
        >
          <BlurImage
            src="/_static/illustrations/shopping-call.svg"
            alt="No links yet"
            width={250}
            height={250}
            className="pointer-events-none -mb-3 -mt-8 w-48 sm:w-60"
          />
          <p>도메인이 있습니다.</p>
        </button>
        <button
          onClick={() => router.push("/welcome?type=link")}
          className="flex flex-col items-center justify-center overflow-hidden p-5 transition-colors hover:bg-gray-50 md:p-10"
        >
          <BlurImage
            src="/_static/illustrations/call-waiting.svg"
            alt="No links yet"
            width={250}
            height={250}
            className="pointer-events-none -mb-3 -mt-8 w-48 sm:w-60"
          />
          <p>도메인이 없습니다.</p>
        </button>
      </motion.div>
    </motion.div>
  );
}
