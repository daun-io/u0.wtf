import {
  InfoTooltip,
  SimpleTooltipContent,
  Switch,
  TooltipContent,
} from "@u0/ui";
import {
  FADE_IN_ANIMATION_SETTINGS,
  HOME_DOMAIN,
  getDateTimeLocal,
} from "@u0/utils";
import { type Link as LinkProps } from "@prisma/client";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function ExpirationSection({
  props,
  data,
  setData,
}: {
  props?: LinkProps;
  data: LinkProps;
  setData: Dispatch<SetStateAction<LinkProps>>;
}) {
  const { expiresAt } = data;
  const [enabled, setEnabled] = useState(!!expiresAt);
  useEffect(() => {
    if (enabled) {
      // if enabling, add previous expiration date if exists
      setData({
        ...data,
        expiresAt: props?.expiresAt || expiresAt,
      });
    } else {
      // if disabling, remove expiration date
      setData({ ...data, expiresAt: null });
    }
  }, [enabled]);

  return (
    <div className="relative border-b border-gray-200 pb-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between space-x-2">
          <h2 className="text-sm font-medium text-gray-900">만료일</h2>
          <InfoTooltip
            content={
              <TooltipContent title="링크에 만료일 설정 - 만료일 이후에는 액세스할 수 없습니다." />
            }
          />
        </div>
        <Switch fn={() => setEnabled(!enabled)} checked={enabled} />
      </div>
      {enabled && (
        <motion.div className="mt-3" {...FADE_IN_ANIMATION_SETTINGS}>
          <input
            type="datetime-local"
            id="expiresAt"
            name="expiresAt"
            min={getDateTimeLocal()}
            value={expiresAt ? getDateTimeLocal(expiresAt) : ""}
            step="60" // need to add step to prevent weird date bug (https://stackoverflow.com/q/19284193/10639526)
            onChange={(e) => {
              setData({ ...data, expiresAt: new Date(e.target.value) });
            }}
            className="flex w-full items-center justify-center space-x-2 rounded-md border border-gray-300 px-3 py-2 text-gray-500 shadow-sm transition-all hover:border-gray-800 focus:border-gray-800 focus:outline-none focus:ring-gray-500 sm:text-sm"
          />
        </motion.div>
      )}
    </div>
  );
}
