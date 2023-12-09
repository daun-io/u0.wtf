import { UploadCloud } from "@/ui/shared/icons";
import {
  InfoTooltip,
  LoadingCircle,
  Popover,
  SimpleTooltipContent,
  Switch,
  Unsplash,
} from "@u0/ui";
import { FADE_IN_ANIMATION_SETTINGS, HOME_DOMAIN } from "@u0/utils";
import { type Link as LinkProps } from "@prisma/client";
import { motion } from "framer-motion";
import { Link2 } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import TextareaAutosize from "react-textarea-autosize";
import UnsplashSearch from "./unsplash-search";

export default function OGSection({
  props,
  data,
  setData,
  generatingMetatags,
}: {
  props?: LinkProps;
  data: LinkProps;
  setData: Dispatch<SetStateAction<LinkProps>>;
  generatingMetatags: boolean;
}) {
  const { title, description, image, proxy } = data;

  const [fileError, setFileError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const onChangePicture = useCallback(
    (e) => {
      setFileError(null);
      const file = e.target.files[0];
      if (file) {
        if (file.size / 1024 / 1024 > 5) {
          setFileError("File size too big (max 5MB)");
        } else if (file.type !== "image/png" && file.type !== "image/jpeg") {
          setFileError("File type not supported (.png or .jpg only)");
        } else {
          const reader = new FileReader();
          reader.onload = (e) => {
            setData((prev) => ({ ...prev, image: e.target?.result as string }));
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [setData],
  );

  useEffect(() => {
    if (proxy && props) {
      // if custom OG is enabled
      setData((prev) => ({
        ...prev,
        title: props.title || title,
        description: props.description || description,
        image: props.image || image,
      }));
    }
  }, [proxy]);

  const [cooldown, setCooldown] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  function handleSet() {
    if (cooldown) return;
    setOpenPopover(!openPopover);
    setCooldown(true);
    setTimeout(() => {
      setCooldown(false);
    }, 200);
  }
  return (
    <div className="relative grid gap-5 border-b border-gray-200 pb-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between space-x-2">
          <h2 className="text-sm font-medium text-gray-900">
            커스텀 소셜 미디어 카드
          </h2>
          <InfoTooltip
            content={
              <SimpleTooltipContent
                title="Customize how your links look when shared on social media."
                cta="Learn more."
                href={`${HOME_DOMAIN}/help/article/how-to-create-link#custom-social-media-cards`}
              />
            }
          />
        </div>
        <Switch
          fn={() => setData((prev) => ({ ...prev, proxy: !proxy }))}
          checked={proxy}
        />
      </div>

      {proxy && (
        <motion.div
          key="og-options"
          {...FADE_IN_ANIMATION_SETTINGS}
          className="grid gap-5"
        >
          <div>
            <div className="flex items-center justify-between">
              <p className="block text-sm font-medium text-gray-700">이미지</p>
              {fileError ? (
                <p className="text-sm text-red-500">{fileError}</p>
              ) : (
                <div className="flex items-center justify-between">
                  <button
                    className="mr-1 flex h-6 w-6 items-center justify-center rounded-md transition-colors duration-75 hover:bg-gray-100 active:bg-gray-200"
                    type="button"
                    onClick={() => {
                      const image = window.prompt(
                        "Paste a URL to an image (max 5MB)",
                        "https://",
                      );
                      if (image) {
                        setData((prev) => ({ ...prev, image }));
                      }
                    }}
                  >
                    <Link2 className="h-4 w-4 text-gray-500" />
                  </button>
                  <Popover
                    content={
                      <UnsplashSearch
                        setData={setData}
                        setOpenPopover={handleSet}
                      />
                    }
                    openPopover={openPopover}
                    setOpenPopover={handleSet}
                  >
                    <div
                      onClick={handleSet}
                      className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md transition-colors duration-75 hover:bg-gray-100 active:bg-gray-200"
                    >
                      <Unsplash className="h-3 w-3 text-gray-500" />
                    </div>
                  </Popover>
                </div>
              )}
            </div>
            <label
              htmlFor="image"
              className="group relative mt-1 flex h-[14rem] cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50"
            >
              {generatingMetatags && (
                <div className="absolute z-[5] flex h-full w-full items-center justify-center rounded-md bg-white">
                  <LoadingCircle />
                </div>
              )}
              <div
                className="absolute z-[5] h-full w-full rounded-md"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                  setFileError(null);
                  const file = e.dataTransfer.files && e.dataTransfer.files[0];
                  if (file) {
                    if (file.size / 1024 / 1024 > 5) {
                      setFileError("File size too big (max 5MB)");
                    } else if (
                      file.type !== "image/png" &&
                      file.type !== "image/jpeg"
                    ) {
                      setFileError(
                        "File type not supported (.png or .jpg only)",
                      );
                    } else {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setData((prev) => ({
                          ...prev,
                          image: e.target?.result as string,
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }
                }}
              />
              <div
                className={`${
                  dragActive
                    ? "cursor-copy border-2 border-black bg-gray-50 opacity-100"
                    : ""
                } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md bg-white transition-all ${
                  image
                    ? "opacity-0 group-hover:opacity-100"
                    : "group-hover:bg-gray-50"
                }`}
              >
                <UploadCloud
                  className={`${
                    dragActive ? "scale-110" : "scale-100"
                  } h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
                />
                <p className="mt-2 text-center text-sm text-gray-500">
                  끌어다 놓거나 클릭하여 업로드합니다.
                </p>
                <p className="mt-2 text-center text-sm text-gray-500">
                  추천: 1200 x 630 픽셀 (최대 5MB)
                </p>
                <span className="sr-only">OG 이미지 업로드</span>
              </div>
              {image && (
                <img
                  src={image}
                  alt="Preview"
                  className="h-full w-full rounded-md object-cover"
                />
              )}
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onChangePicture}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="block text-sm font-medium text-gray-700">제목</p>
              <p className="text-sm text-gray-500">{title?.length || 0}/120</p>
            </div>
            <div className="relative mt-1 flex rounded-md shadow-sm">
              {generatingMetatags && (
                <div className="absolute flex h-full w-full items-center justify-center rounded-md border border-gray-300 bg-white">
                  <LoadingCircle />
                </div>
              )}
              <TextareaAutosize
                name="title"
                id="title"
                minRows={3}
                maxLength={120}
                className="block w-full rounded-md border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                placeholder="U0 - 브랜드를 알리는 짧은 URL"
                value={title || ""}
                onChange={(e) => {
                  setData({ ...data, title: e.target.value });
                }}
                aria-invalid="true"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="block text-sm font-medium text-gray-700">설명</p>
              <p className="text-sm text-gray-500">
                {description?.length || 0}/240
              </p>
            </div>
            <div className="relative mt-1 flex rounded-md shadow-sm">
              {generatingMetatags && (
                <div className="absolute flex h-full w-full items-center justify-center rounded-md border border-gray-300 bg-white">
                  <LoadingCircle />
                </div>
              )}
              <TextareaAutosize
                name="description"
                id="description"
                minRows={3}
                maxLength={240}
                className="block w-full rounded-md border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                placeholder="커스텀 도메인, 소셜 미디어 카드, 애널리틱스, 개인화까지 갖춘 현대적인 짧은 URL U0"
                value={description || ""}
                onChange={(e) => {
                  setData({
                    ...data,
                    description: e.target.value,
                  });
                }}
                aria-invalid="true"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
