import { BlurImage } from "@/ui/shared/blur-image";
import { Tooltip, TooltipContent } from "@u0/ui";

export default function NoLinksPlaceholder({
  AddEditLinkButton,
}: {
  AddEditLinkButton: () => JSX.Element;
}) {
  return (
    <div className="mb-12 flex flex-col items-center justify-center rounded-md border border-gray-200 bg-white py-12">
      <h2 className="z-10 text-xl font-semibold text-gray-700">
        아직 생성한 링크가 없습니다.
      </h2>

      <Tooltip
        content={<TooltipContent title="아차차... 이 링크가 아닌데..." />}
      >
        <div>
          <BlurImage
            src="/_static/illustrations/no-link.webp"
            alt="No links yet"
            width={400}
            height={400}
            className="pointer-events-none"
          />
        </div>
      </Tooltip>
      <AddEditLinkButton />
    </div>
  );
}
