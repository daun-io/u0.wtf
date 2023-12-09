import { getStripe } from "@/lib/stripe/client";
import { PLANS } from "@/lib/stripe/utils";
import { CheckCircleFill } from "@/ui/shared/icons";
import { Badge, Button, Logo, Modal } from "@u0/ui";
import { HOME_DOMAIN, STAGGER_CHILD_VARIANTS, capitalize } from "@u0/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import Confetti from "react-dom-confetti";

function UpgradePlanModal({
  showUpgradePlanModal,
  setShowUpgradePlanModal,
  defaultPlan,
}: {
  showUpgradePlanModal: boolean;
  setShowUpgradePlanModal: Dispatch<SetStateAction<boolean>>;
  defaultPlan: "Pro" | "Enterprise";
}) {
  const router = useRouter();
  const params = useParams() as { slug: string };
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const welcomeFlow = pathname === "/welcome";
  const slug = welcomeFlow ? searchParams?.get("slug") : params.slug;

  const [plan, setPlan] = useState<"Pro" | "Enterprise">(defaultPlan);
  const [period, setPeriod] = useState<"monthly" | "yearly">("yearly");
  const features = useMemo(() => {
    return [
      `매월 ${
        plan === "Enterprise" ? "무제한" : "50배 더 많은"
      } 링크 클릭 추적`,
      "무제한 사용자 정의 도메인",
      "무제한 팀 멤버",
      "무제한 링크 이력",
      "무제한 태그",
      "루트 도메인 리디렉션",
      "사용자 정의 QR 코드 로고",
      "API 접근",
      ...(plan === "Enterprise" ? ["우선 지원"] : []),
    ];
  }, [plan]);
  const [clicked, setClicked] = useState(false);

  return (
    <Modal
      showModal={showUpgradePlanModal}
      setShowModal={setShowUpgradePlanModal}
      className="max-w-lg"
      preventDefaultClose={welcomeFlow}
      {...(welcomeFlow && { onClose: () => router.back() })}
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
        animate="show"
        className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-8 sm:px-16"
      >
        <motion.div variants={STAGGER_CHILD_VARIANTS}>
          <Logo />
        </motion.div>
        <motion.h3
          className="text-lg font-medium"
          variants={STAGGER_CHILD_VARIANTS}
        >
          {plan === "Enterprise"
            ? "엔터프라이즈"
            : plan === "Pro"
            ? "프로"
            : "무료"}
          로 업그레이드
        </motion.h3>
        <motion.p
          className="text-center text-sm text-gray-500"
          variants={STAGGER_CHILD_VARIANTS}
        >
          {plan === "Enterprise"
            ? "엔터프라이즈"
            : plan === "Pro"
            ? "프로"
            : "무료"}{" "}
          플랜으로 업그레이드하면 더 높은 한도와 추가 기능을 이용할 수 있습니다.
        </motion.p>
      </motion.div>
      <div className="bg-gray-50 px-4 py-8 text-left sm:px-16">
        <motion.div
          className="flex flex-col space-y-3"
          variants={STAGGER_CHILD_VARIANTS}
          initial="hidden"
          animate="show"
        >
          <div className="mb-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-gray-900">
                  {plan} {capitalize(period)}
                </h4>
                <Badge
                  variant="neutral"
                  className="text-sm font-normal normal-case"
                >
                  {PLANS.find((p) => p.name === plan)!.price[
                    period
                  ].amount.toLocaleString()}
                  원/
                  {period.replace("ly", "")}
                </Badge>
              </div>
              <Confetti
                active={period === "yearly"}
                config={{ elementCount: 200, spread: 90 }}
              />
              <button
                onClick={() => {
                  setPeriod(period === "monthly" ? "yearly" : "monthly");
                }}
                className="text-xs text-gray-500 underline underline-offset-4 transition-colors hover:text-gray-800"
              >
                {period === "monthly"
                  ? "무료 2개월 추가 🎁"
                  : "월간 결제로 변경"}
              </button>
            </div>
            <motion.div
              variants={{
                show: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
              initial="hidden"
              animate="show"
              className="flex flex-col space-y-2"
            >
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  variants={STAGGER_CHILD_VARIANTS}
                  className="flex items-center space-x-2 text-sm text-gray-500"
                >
                  <CheckCircleFill className="h-5 w-5 text-green-500" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
          <Button
            text={`${
              plan === "Enterprise"
                ? "엔터프라이즈"
                : plan === "Pro"
                ? "프로"
                : "무료"
            }로 업그레이드하기`}
            loading={clicked}
            onClick={() => {
              setClicked(true);
              fetch(
                `/api/projects/${slug}/billing/upgrade?priceId=${
                  PLANS.find((p) => p.name === plan)!.price[period].priceIds[
                    process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
                      ? "production"
                      : "test"
                  ]
                }`,
                {
                  method: "POST",
                },
              )
                .then(async (res) => {
                  const data = await res.json();
                  const { id: sessionId } = data;
                  const stripe = await getStripe();
                  stripe?.redirectToCheckout({ sessionId });
                })
                .catch((err) => {
                  alert(err);
                  setClicked(false);
                });
            }}
          />
          {welcomeFlow ? (
            <Link
              href={`/${slug}`}
              className="text-center text-xs text-gray-500 underline underline-offset-4 transition-colors hover:text-gray-800"
            >
              Skip for now
            </Link>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => {
                  setPlan(plan === "Pro" ? "Enterprise" : "Pro");
                }}
                className="text-center text-xs text-gray-500 underline-offset-4 transition-all hover:text-gray-800 hover:underline"
              >
                U0 {plan === "Pro" ? "엔터프라이즈" : "프로"}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </Modal>
  );
}

export function useUpgradePlanModal(
  { defaultPlan } = { defaultPlan: "Pro" } as {
    defaultPlan: "Pro" | "Enterprise";
  },
) {
  const [showUpgradePlanModal, setShowUpgradePlanModal] = useState(false);

  const UpgradePlanModalCallback = useCallback(() => {
    return (
      <UpgradePlanModal
        showUpgradePlanModal={showUpgradePlanModal}
        setShowUpgradePlanModal={setShowUpgradePlanModal}
        defaultPlan={defaultPlan}
      />
    );
  }, [showUpgradePlanModal, setShowUpgradePlanModal, defaultPlan]);

  return useMemo(
    () => ({
      setShowUpgradePlanModal,
      UpgradePlanModal: UpgradePlanModalCallback,
    }),
    [setShowUpgradePlanModal, UpgradePlanModalCallback],
  );
}
