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
import TextareaAutosize from "react-textarea-autosize";

export default function CommentsSection({
  props,
  data,
  setData,
}: {
  props?: LinkProps;
  data: LinkProps;
  setData: Dispatch<SetStateAction<LinkProps>>;
}) {
  const { comments } = data;
  const [enabled, setEnabled] = useState(!!comments);
  useEffect(() => {
    if (enabled) {
      // if enabling, add previous comments if exists
      setData({
        ...data,
        comments: props?.comments || comments,
      });
    } else {
      // if disabling, remove comments
      setData({ ...data, comments: null });
    }
  }, [enabled]);

  return (
    <div className="relative border-b border-gray-200 pb-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between space-x-2">
          <h2 className="text-sm font-medium text-gray-900">메모</h2>
          <InfoTooltip
            content={
              <TooltipContent title="메모를 추가해 짧은 URL에 자신과 팀을 위한 컨텍스트를 추가할 수 있습니다." />
            }
          />
        </div>
        <Switch fn={() => setEnabled(!enabled)} checked={enabled} />
      </div>
      {enabled && (
        <motion.div className="mt-3" {...FADE_IN_ANIMATION_SETTINGS}>
          <TextareaAutosize
            name="comments"
            minRows={3}
            className="block w-full rounded-md border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            placeholder="메모 추가하기"
            value={comments || ""}
            onChange={(e) => {
              setData({ ...data, comments: e.target.value });
            }}
          />
        </motion.div>
      )}
    </div>
  );
}
