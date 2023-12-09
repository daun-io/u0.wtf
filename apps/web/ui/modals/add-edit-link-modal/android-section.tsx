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

export default function AndroidSection({
  props,
  data,
  setData,
}: {
  props?: LinkProps;
  data: LinkProps;
  setData: Dispatch<SetStateAction<LinkProps>>;
}) {
  const { android } = data;
  const [enabled, setEnabled] = useState(!!android);
  useEffect(() => {
    if (enabled) {
      // if enabling, add previous android link if exists
      setData({
        ...data,
        android: props?.android || android,
      });
    } else {
      // if disabling, remove android link
      setData({ ...data, android: null });
    }
  }, [enabled]);

  return (
    <div className="relative border-b border-gray-200 pb-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between space-x-2">
          <h2 className="text-sm font-medium text-gray-900">
            안드로이드 타게팅
          </h2>
          <InfoTooltip
            content={
              <TooltipContent title="안드로이드 유저를 별도 지정한 링크로 리다이렉트합니다. 플랫폼에 따른 스토어 이동에 활용할 수 있습니다." />
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
            name="android-url"
            id="android-url"
            type="url"
            placeholder="https://play.google.com/store/apps/details?id=com.disney.disneyplus"
            value={android || ""}
            onChange={(e) => {
              setData({ ...data, android: e.target.value });
            }}
            className="block w-full rounded-md border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            aria-invalid="true"
          />
        </motion.div>
      )}
    </div>
  );
}
