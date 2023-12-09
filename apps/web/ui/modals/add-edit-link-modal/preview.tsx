import { BlurImage } from "@/ui/shared/blur-image";
import { Facebook, LinkedIn, LoadingCircle, Photo, Twitter } from "@u0/ui";
import { getDomainWithoutWWW } from "@u0/utils";
import { type Link as LinkProps } from "@prisma/client";
import { useMemo } from "react";
import { useDebounce } from "use-debounce";
import { MessageCircle } from "lucide-react";

export default function Preview({
  data,
  generatingMetatags,
}: {
  data: LinkProps;
  generatingMetatags: boolean;
}) {
  const { title, description, image, url, password } = data;
  const [debouncedUrl] = useDebounce(url, 500);
  const hostname = useMemo(() => {
    if (password) return "u0.wtf";
    return getDomainWithoutWWW(debouncedUrl);
  }, [password, debouncedUrl]);

  const previewImage = useMemo(() => {
    if (generatingMetatags) {
      return (
        <div className="flex h-[250px] w-full flex-col items-center justify-center space-y-4 border-b border-gray-300 bg-gray-100">
          <LoadingCircle />
        </div>
      );
    }
    if (image) {
      if (image.startsWith("https://res.cloudinary.com")) {
        return (
          <BlurImage
            src={image}
            alt="Preview"
            width={1200}
            height={627}
            className="h-[250px] w-full border-b border-gray-300 object-cover"
          />
        );
      } else {
        return (
          <img
            src={image}
            alt="Preview"
            className="h-[250px] w-full border-b border-gray-300 object-cover"
          />
        );
      }
    } else {
      return (
        <div className="flex h-[250px] w-full flex-col items-center justify-center space-y-4 border-b border-gray-300 bg-gray-100">
          <Photo className="h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-400">
            링크를 입력해 미리보기를 생성하세요..
          </p>
        </div>
      );
    }
  }, [image, generatingMetatags]);

  return (
    <div>
      <div className="z-10 flex items-center justify-center border-b border-gray-200 bg-white px-5 py-10 sm:sticky sm:top-0">
        <h2 className="text-lg font-medium">소셜 미디어 미리보기</h2>
      </div>
      <div className="grid gap-5 p-5">
        {/* Kakaotalk */}
        <div>
          <div className="relative mb-2">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <div className="flex items-center space-x-2 bg-white px-3">
                <MessageCircle className="h-4 w-4 fill-[#3a1a1c]" />
                <p className="text-sm text-gray-400">카카오톡</p>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-md border border-gray-300">
            {previewImage}
            <div className="grid gap-1 p-3">
              {title ? (
                <h3 className="truncate text-base text-[#0f1419]">{title}</h3>
              ) : (
                <div className="mb-1 h-4 w-full rounded-md bg-gray-100" />
              )}
              {description ? (
                <p className="line-clamp-1 text-sm text-[#536471]">
                  {description}
                </p>
              ) : (
                <div className="grid gap-2">
                  <div className="h-4 w-full rounded-md bg-gray-100" />
                  <div className="h-4 w-48 rounded-md bg-gray-100" />
                </div>
              )}
              {hostname ? (
                <p className="text-sm text-[#536471]/50">{hostname}</p>
              ) : (
                <div className="mb-1 h-4 w-24 rounded-md bg-gray-100" />
              )}
            </div>
          </div>
        </div>
        {/* Twitter */}
        <div>
          <div className="relative mb-2">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <div className="flex items-center space-x-2 bg-white px-3">
                <Twitter className="h-4 w-4 text-[#1DA1F2]" />
                <p className="text-sm text-gray-400">트위터 또는 X</p>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-md border border-gray-300">
            {previewImage}
            <div className="grid gap-1 p-3">
              {hostname ? (
                <p className="text-sm text-[#536471]">{hostname}</p>
              ) : (
                <div className="mb-1 h-4 w-24 rounded-md bg-gray-100" />
              )}
              {title ? (
                <h3 className="truncate text-sm text-[#0f1419]">{title}</h3>
              ) : (
                <div className="mb-1 h-4 w-full rounded-md bg-gray-100" />
              )}
              {description ? (
                <p className="line-clamp-2 text-sm text-[#536471]">
                  {description}
                </p>
              ) : (
                <div className="grid gap-2">
                  <div className="h-4 w-full rounded-md bg-gray-100" />
                  <div className="h-4 w-48 rounded-md bg-gray-100" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Facebook */}
        <div>
          <div className="relative mb-2">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <div className="flex items-center space-x-2 bg-white px-3">
                <Facebook className="h-4 w-4" />
                <p className="text-sm text-gray-400">페이스북</p>
              </div>
            </div>
          </div>
          <div className="border border-gray-300">
            {previewImage}
            <div className="grid gap-1 bg-[#f2f3f5] p-3">
              {hostname ? (
                <p className="text-[0.8rem] uppercase text-[#606770]">
                  {hostname}
                </p>
              ) : (
                <div className="mb-1 h-4 w-24 rounded-md bg-gray-200" />
              )}
              {title ? (
                <h3 className="truncate font-semibold text-[#1d2129]">
                  {title}
                </h3>
              ) : (
                <div className="mb-1 h-5 w-full rounded-md bg-gray-200" />
              )}
              {description ? (
                <p className="line-clamp-2 text-sm text-[#606770]">
                  {description}
                </p>
              ) : (
                <div className="grid gap-2">
                  <div className="h-4 w-full rounded-md bg-gray-200" />
                  <div className="h-4 w-48 rounded-md bg-gray-200" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LinkedIn */}
        <div>
          <div className="relative mb-2">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <div className="flex items-center space-x-2 bg-white px-3">
                <LinkedIn className="h-4 w-4" />
                <p className="text-sm text-gray-400">링크드인</p>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_2px_3px_rgba(0,0,0,0.2)]">
            {previewImage}
            <div className="grid gap-1 bg-white p-3">
              {title ? (
                <h3 className="truncate font-semibold text-[#000000E6]">
                  {title}
                </h3>
              ) : (
                <div className="mb-1 h-5 w-full rounded-md bg-gray-200" />
              )}
              {hostname ? (
                <p className="text-xs text-[#00000099]">{hostname}</p>
              ) : (
                <div className="mb-1 h-4 w-24 rounded-md bg-gray-200" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
