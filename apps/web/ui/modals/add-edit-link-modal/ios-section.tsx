import {
  InfoTooltip,
  SimpleTooltipContent,
  Switch,
  TooltipContent,
} from "@u0/ui";
import { FADE_IN_ANIMATION_SETTINGS, HOME_DOMAIN } from "@u0/utils";
import { type Link as LinkProps } from "@prisma/client";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function IOSSection({
  props,
  data,
  setData,
}: {
  props?: LinkProps;
  data: LinkProps;
  setData: Dispatch<SetStateAction<LinkProps>>;
}) {
  const { ios } = data;
  const [enabled, setEnabled] = useState(!!ios);
  useEffect(() => {
    if (enabled) {
      // if enabling, add previous ios link if exists
      setData({
        ...data,
        ios: props?.ios || ios,
      });
    } else {
      // if disabling, remove ios link
      setData({ ...data, ios: null });
    }
  }, [enabled]);

  return (
    <div className="relative border-b border-gray-200 pb-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between space-x-2">
          <h2 className="text-sm font-medium text-gray-900">iOS 타게팅</h2>
          <InfoTooltip
            content={
              <TooltipContent title="iOS 유저를 별도 지정한 링크로 리다이렉트합니다. 플랫폼에 따른 스토어 이동에 활용할 수 있습니다." />
            }
          />
        </div>
        <Switch fn={() => setEnabled(!enabled)} checked={enabled} />
      </div>
      {enabled && (
        <motion.div
          className="mt-3 flex rounded-md shadow-sm"
          {...FADE_IN_ANIMATION_SETTINGS}
        >
          <input
            name="ios-url"
            id="ios-url"
            type="url"
            placeholder="https://apps.apple.com/app/1611158928"
            value={ios || ""}
            onChange={(e) => {
              setData({ ...data, ios: e.target.value });
            }}
            className="block w-full rounded-md border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            aria-invalid="true"
          />
        </motion.div>
      )}
    </div>
  );
}
