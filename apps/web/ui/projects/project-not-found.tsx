import { BlurImage } from "@/ui/shared/blur-image";
import { MaxWidthWrapper } from "@u0/ui";
import { FileX2 } from "lucide-react";
import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <MaxWidthWrapper>
      <div className="my-10 flex flex-col items-center justify-center rounded-md border border-gray-200 bg-white py-12">
        <div className="rounded-full bg-gray-100 p-3">
          <FileX2 className="h-6 w-6 text-gray-600" />
        </div>
        <h1 className="my-3 text-xl font-semibold text-gray-700">
          브랜드를 찾지 못했습니다.
        </h1>
        <p className="z-10 max-w-sm text-center text-sm text-gray-600">
          찾고 계신 브랜드가 존재하지 않습니다. 잘못된 URL을 입력했거나 브랜드에
          대한 액세스 권한이 없습니다.
        </p>
        <BlurImage
          src="/_static/illustrations/coffee-call.svg"
          alt="No links yet"
          width={400}
          height={400}
        />
        <Link
          href="/"
          className="z-10 rounded-md border border-black bg-black px-10 py-2 text-sm font-medium text-white transition-all duration-75 hover:bg-white hover:text-black"
        >
          대쉬보드로 돌아가기
        </Link>
      </div>
    </MaxWidthWrapper>
  );
}
