"use client";

import useProject from "@/lib/swr/use-project";
import { ModalContext } from "@/ui/modals/provider";
import PlanBadge from "@/ui/projects/plan-badge";
import { Divider, InfinityIcon } from "@/ui/shared/icons";
import { Button, InfoTooltip, NumberTooltip } from "@u0/ui";
import { fetcher, getFirstAndLastDay, nFormatter } from "@u0/utils";
import va from "@vercel/analytics";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

export default function ProjectBillingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { slug, plan, usage, usageLimit, billingCycleStart } = useProject();

  const { data: links } = useSWR<number>(
    `/api/projects/${slug}/links/count`,
    fetcher,
  );
  const [clicked, setClicked] = useState(false);

  const [billingStart, billingEnd] = useMemo(() => {
    if (billingCycleStart) {
      const { firstDay, lastDay } = getFirstAndLastDay(billingCycleStart);
      const start = firstDay.toLocaleDateString("en-us", {
        month: "short",
        day: "numeric",
      });
      const end = lastDay.toLocaleDateString("en-us", {
        month: "short",
        day: "numeric",
      });
      return [start, end];
    }
    return [];
  }, [billingCycleStart]);

  const { setShowUpgradePlanModal } = useContext(ModalContext);

  useEffect(() => {
    if (searchParams?.get("success")) {
      toast.success("Upgrade success!");
      setTimeout(() => {
        mutate(`/api/projects/${slug}`);
        // track upgrade to pro event
        va.track("Upgraded Plan", {
          plan: "pro",
        });
      }, 1000);
    }
  }, [searchParams]);

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="flex flex-col space-y-3 p-10">
          <h2 className="text-xl font-medium">Plan &amp; Usage</h2>
          <p className="text-sm text-gray-500">
            You are currently on the{" "}
            {plan ? (
              <PlanBadge plan={plan} />
            ) : (
              <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-200">
                load
              </span>
            )}{" "}
            plan.
            {billingStart && billingEnd && (
              <>
                {" "}
                Current billing cycle:{" "}
                <span className="font-medium text-black">
                  {billingStart} - {billingEnd}
                </span>
                .
              </>
            )}
          </p>
        </div>
        <div className="border-b border-gray-200" />
        <div className="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <div className="p-10">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium">Total Link Clicks</h3>
              <InfoTooltip content="Number of billable link clicks across all your projects." />
            </div>
            {plan === "enterprise" ? (
              <div className="mt-4 flex items-center">
                {usage || usage === 0 ? (
                  <NumberTooltip value={usage}>
                    <p className="text-2xl font-semibold text-black">
                      {nFormatter(usage)}
                    </p>
                  </NumberTooltip>
                ) : (
                  <div className="h-8 w-8 animate-pulse rounded-md bg-gray-200" />
                )}
                <Divider className="h-8 w-8 text-gray-500" />
                <InfinityIcon className="h-8 w-8 text-gray-500" />
              </div>
            ) : (
              <div className="mt-2 flex flex-col space-y-2">
                {usage !== undefined && usageLimit ? (
                  <p className="text-sm text-gray-600">
                    <NumberTooltip value={usage}>
                      <span>{nFormatter(usage)} </span>
                    </NumberTooltip>
                    / {nFormatter(usageLimit)} clicks (
                    {((usage / usageLimit) * 100).toFixed(1)}%)
                  </p>
                ) : (
                  <div className="h-5 w-32 animate-pulse rounded-md bg-gray-200" />
                )}
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        usage !== undefined && usageLimit
                          ? (usage / usageLimit) * 100 + "%"
                          : "0%",
                    }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className={`${
                      usage && usageLimit && usage > usageLimit
                        ? "bg-red-500"
                        : "bg-blue-500"
                    } h-3 rounded-full`}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="p-10">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium">Number of Links</h3>
              <InfoTooltip content="Number of short links in your project." />
            </div>
            <div className="mt-4 flex items-center">
              {links || links === 0 ? (
                <NumberTooltip value={links} unit="links">
                  <p className="text-2xl font-semibold text-black">
                    {nFormatter(links)}
                  </p>
                </NumberTooltip>
              ) : (
                <div className="h-8 w-8 animate-pulse rounded-md bg-gray-200" />
              )}
              <Divider className="h-8 w-8 text-gray-500" />
              <InfinityIcon className="h-8 w-8 text-gray-500" />
            </div>
          </div>
        </div>
        <div className="border-b border-gray-200" />
        <div className="flex flex-col items-center justify-between space-y-3 px-10 py-4 text-center sm:flex-row sm:space-y-0 sm:text-left">
          {plan ? (
            <p className="text-sm text-gray-500">
              {plan === "enterprise"
                ? "On the Enterprise plan, the sky's the limit! Thank you for your support."
                : `For higher limits, upgrade to the ${
                    plan === "free" ? "Pro" : "Enterprise"
                  } plan.`}
            </p>
          ) : (
            <div className="h-3 w-28 animate-pulse rounded-full bg-gray-200" />
          )}
          <div>
            {plan ? (
              plan === "free" ? (
                <Button
                  text="Upgrade"
                  onClick={() => setShowUpgradePlanModal(true)}
                  variant="success"
                />
              ) : (
                <Button
                  text="Manage Subscription"
                  onClick={() => {
                    setClicked(true);
                    fetch(`/api/projects/${slug}/billing/manage`, {
                      method: "POST",
                    })
                      .then(async (res) => {
                        const url = await res.json();
                        router.push(url);
                      })
                      .catch((err) => {
                        alert(err);
                        setClicked(false);
                      });
                  }}
                  loading={clicked}
                />
              )
            ) : (
              <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
