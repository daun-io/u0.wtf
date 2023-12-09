import {
  InfoTooltip,
  SimpleTooltipContent,
  Switch,
  TooltipContent,
} from "@u0/ui";
import { HOME_DOMAIN } from "@u0/utils";
import { type Link as LinkProps } from "@prisma/client";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function RewriteSection({
  data,
  setData,
}: {
  data: LinkProps;
  setData: Dispatch<SetStateAction<LinkProps>>;
}) {
  const { slug } = useParams() as { slug: string };

  const { rewrite } = data;
  const [enabled, setEnabled] = useState(rewrite);
  useEffect(() => {
    if (enabled) {
      // if enabling, set rewrite to true or props.rewrite
      setData({
        ...data,
        rewrite: true,
      });
    } else {
      // if disabling, set rewrite to false
      setData({ ...data, rewrite: false });
    }
  }, [enabled]);

  return (
    <div className="relative border-b border-gray-200 pb-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between space-x-2">
          <h2 className="text-sm font-medium text-gray-900">링크 감추기</h2>
          <InfoTooltip
            content={
              <TooltipContent title="사용자의 브라우저 주소창에 짧은 링크만 표시되도록 하고 대상 URL을 가립니다." />
            }
          />
        </div>
        <Switch
          fn={() => setEnabled(!enabled)}
          checked={enabled}
          // link cloaking is only available on custom domains
          {...(slug
            ? {}
            : {
                disabledTooltip: (
                  <TooltipContent title="사용자 정의 도메인을 사용하는 경우에만 링크 감추기를 사용할 수 있습니다." />
                ),
              })}
        />
      </div>
    </div>
  );
}
