"use client";

import { ModalContext } from "@/ui/modals/provider";
import { BlurImage } from "@/ui/shared/blur-image";
import Link from "next/link";
import { useContext } from "react";

export default function NoProjectsPlaceholder() {
  const { setShowAddProjectModal } = useContext(ModalContext);

  return (
    <div className="col-span-3 flex flex-col items-center justify-center rounded-md border border-gray-200 bg-white py-12">
      <h2 className="z-10 text-xl font-semibold text-gray-700">
        아직 만든 브랜드가 없습니다.
      </h2>
      <BlurImage
        src="/_static/illustrations/no-brand.webp"
        alt="No links yet"
        width={400}
        height={400}
        className="pointer-events-none"
      />
      <button
        onClick={() => setShowAddProjectModal(true)}
        className="rounded-md border border-black bg-black px-10 py-2 text-sm font-medium text-white transition-all duration-75 hover:bg-white hover:text-black active:scale-95"
      >
        브랜드 생성하기
      </button>
      <Link
        href="/links"
        className="mt-3 text-sm font-medium text-gray-500 transition-all hover:text-gray-800 active:scale-95"
      >
        또는 짧은 URL 만들기
      </Link>
    </div>
  );
}
