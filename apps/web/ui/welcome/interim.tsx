import { BlurImage } from "@/ui/shared/blur-image";
import { Logo, Tooltip } from "@u0/ui";
import { STAGGER_CHILD_VARIANTS } from "@u0/utils";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import Link from "next/link";
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
        <Tooltip content="홈페이지나 서비스를 위해 사용되는 도메인이 아닌 도메인을 사용해주세요. (예: 서비스용 도메인 example.com, 짧은 URL 도메인 exa.mp)">
          <strong className="cursor-default">나만의 남는 도메인</strong>
        </Tooltip>
        이 있으신가요? 무료로 짧은 URL을 만들어 보세요.
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
        <Tooltip content="홈페이지나 서비스를 위해 사용되는 도메인이 아닌 도메인을 사용해주세요. (예: 서비스용 도메인 example.com, 짧은 URL 도메인 exa.mp)">
          <button
            onClick={() => router.push("/welcome?type=project")}
            className="group flex flex-col items-center justify-center overflow-hidden p-5 text-gray-700 transition-colors hover:bg-gray-50 md:p-10"
          >
            <BlurImage
              src="/_static/illustrations/have-domain.webp"
              alt="I have domain"
              width={200}
              height={200}
              className="pointer-events-none my-4 w-48 rounded-xl ring ring-black/5 grayscale group-hover:grayscale-0"
            />
            <p>
              <strong>남는</strong>
              도메인이 있습니다.
            </p>
          </button>
        </Tooltip>
        <button
          onClick={() => router.push("/welcome?type=link")}
          className="group flex flex-col items-center justify-center overflow-hidden p-5 text-gray-700 transition-colors hover:bg-gray-50 md:p-10"
        >
          <BlurImage
            src="/_static/illustrations/no-domain.webp"
            alt="I don't have domain"
            width={200}
            height={200}
            className="pointer-events-none my-4 w-48 rounded-xl ring ring-black/5 grayscale group-hover:grayscale-0"
          />
          <p>
            <strong>남는</strong> 도메인이 없습니다.
          </p>
        </button>
      </motion.div>
      <Link
        className="text-gray-500 underline transition-colors hover:text-gray-700"
        target="_blank"
        rel="noreferrer"
        href="/"
      >
        또는 대쉬보드로 이동
      </Link>
    </motion.div>
  );
}
