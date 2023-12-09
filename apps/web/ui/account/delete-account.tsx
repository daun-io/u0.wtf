"use client";
import { useDeleteAccountModal } from "@/ui/modals/delete-account-modal";
import { Button } from "@u0/ui";

export default function DeleteAccountSection() {
  const { setShowDeleteAccountModal, DeleteAccountModal } =
    useDeleteAccountModal();

  return (
    <div className="rounded-lg border border-red-600 bg-white">
      <DeleteAccountModal />
      <div className="flex flex-col space-y-3 p-5 sm:p-10">
        <h2 className="text-xl font-medium">계정 삭제</h2>
        <p className="text-sm text-gray-500">
          내 계정과 모든 U0.wtf 링크 및 해당 통계를 영구 삭제합니다. 이 작업은
          되돌릴 수 없으니 신중하게 진행하시기 바랍니다.
        </p>
      </div>
      <div className="border-b border-red-600" />

      <div className="flex items-center justify-end p-3 sm:px-10">
        <div>
          <Button
            text="계정 삭제"
            variant="danger"
            onClick={() => setShowDeleteAccountModal(true)}
          />
        </div>
      </div>
    </div>
  );
}
