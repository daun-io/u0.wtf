"use client";

import useProject from "@/lib/swr/use-project";
import { Button } from "@u0/ui";
import { cn } from "@u0/utils";
import { useDeleteProjectModal } from "@/ui/modals/delete-project-modal";

export default function DeleteProject() {
  const { setShowDeleteProjectModal, DeleteProjectModal } =
    useDeleteProjectModal();

  const { plan, isOwner } = useProject();
  return (
    <div
      className={cn("rounded-lg border border-red-600 bg-white", {
        "border-gray-200": plan === "enterprise" && !isOwner,
      })}
    >
      <DeleteProjectModal />
      <div className="flex flex-col space-y-3 p-5 sm:p-10">
        <h2 className="text-xl font-medium">프로젝트 삭제</h2>
        <p className="text-sm text-gray-500">
          프로젝트, 사용자 정의 도메인 및 관련된 모든 링크와 해당 통계를 영구
          삭제합니다. 이 작업은 되돌릴 수 없습니다.
        </p>
      </div>
      <div
        className={cn("border-b border-red-600", {
          "border-gray-200": plan === "enterprise" && !isOwner,
        })}
      />

      <div className="flex items-center justify-end px-5 py-4 sm:px-10">
        <div>
          <Button
            text="프로젝트 삭제"
            variant="danger"
            onClick={() => setShowDeleteProjectModal(true)}
            {...(plan === "enterprise" &&
              !isOwner && {
                disabledTooltip: "Only project owners can delete a project.",
              })}
          />
        </div>
      </div>
    </div>
  );
}
