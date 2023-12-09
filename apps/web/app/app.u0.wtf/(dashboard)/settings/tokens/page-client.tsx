"use client";

import { useDeleteTokenModal } from "@/ui/modals/delete-token-modal";
import { useTokenCreatedModal } from "@/ui/modals/token-created-modal";
import { Form, IconMenu, LoadingSpinner, Popover, TokenAvatar } from "@u0/ui";
import { fetcher, timeAgo } from "@u0/utils";
import { Token } from "@prisma/client";
import { FolderOpen, MoreVertical, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export default function TokensPageClient() {
  const {
    data: tokens,
    mutate,
    isLoading,
  } = useSWR<Token[]>("/api/user/tokens", fetcher);

  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const { TokenCreatedModal, setShowTokenCreatedModal } = useTokenCreatedModal({
    token: createdToken || "",
  });
  return (
    <>
      <TokenCreatedModal />
      <Form
        title="새 API 키 생성"
        description="다른 키와 구분할 수 있도록 API 키의 고유 이름을 입력하세요."
        inputData={{
          name: "name",
          defaultValue: "",
          placeholder: "프로덕션 키",
          maxLength: 140,
        }}
        helpText="<a href='https://u0.wtf/docs' target='_blank'>API에 대해 더 알아보기</a>"
        buttonText="제출"
        handleSubmit={(data) =>
          fetch("/api/user/tokens", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }).then(async (res) => {
            if (res.status === 200) {
              const { token } = await res.json();
              setCreatedToken(token);
              setShowTokenCreatedModal(true);
              mutate();
              toast.success("Successfully created a new token!");
            } else {
              const errorMessage = await res.text();
              toast.error(errorMessage || "오류가 발생했습니다");
            }
          })
        }
      />
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="flex flex-col space-y-3 p-5 sm:p-10">
          <h2 className="text-xl font-medium">내 API 키</h2>
          <p className="text-sm text-gray-500">
            이 API 키를 사용하면 다른 앱에서 내 계정에 액세스할 수 있습니다.
            주의 - 다른 사람과 API 키를 공유하거나 브라우저 또는 클라이언트 측
            코드에 브라우저 또는 기타 클라이언트 측 코드에 노출하지 마세요.
          </p>
        </div>
        {isLoading || !tokens ? (
          <div className="flex flex-col items-center justify-center space-y-4 pb-20 pt-10">
            <LoadingSpinner className="h-6 w-6 text-gray-500" />
            <p className="text-sm text-gray-500">API 키 불러오는 중...</p>
          </div>
        ) : tokens.length > 0 ? (
          <div>
            <div className="grid grid-cols-5 border-b border-gray-200 px-5 py-2 text-sm font-medium text-gray-500 sm:px-10">
              <div className="col-span-3">이름</div>
              <div>키</div>
              <div className="text-center">최근 사용</div>
            </div>
            <div className="divide-y divide-gray-200">
              {tokens.map((token) => (
                <TokenRow key={token.id} {...token} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 pb-20 pt-10">
            <FolderOpen className="h-6 w-6 text-gray-500" />
            <p className="text-sm text-gray-500">
              아직 생성한 API 키가 없습니다.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

const TokenRow = (token: Token) => {
  const [openPopover, setOpenPopover] = useState(false);
  const { DeleteTokenModal, setShowDeleteTokenModal } = useDeleteTokenModal({
    token,
  });
  return (
    <>
      <DeleteTokenModal />
      <div className="relative grid grid-cols-5 items-center px-5 py-3 sm:px-10">
        <div className="col-span-3 flex items-center space-x-3">
          <TokenAvatar id={token.id} />
          <div className="flex flex-col space-y-px">
            <p className="font-semibold text-gray-700">{token.name}</p>
            <p className="text-sm text-gray-500" suppressHydrationWarning>
              Created {timeAgo(token.createdAt, { withAgo: true })}
            </p>
          </div>
        </div>
        <div className="font-mono text-sm">{token.partialKey}</div>
        <div
          className="text-center text-sm text-gray-500"
          suppressHydrationWarning
        >
          {timeAgo(token.lastUsed)}
        </div>
        <Popover
          content={
            <div className="grid w-full gap-1 p-2 sm:w-48">
              <button
                onClick={() => {
                  setOpenPopover(false);
                  setShowDeleteTokenModal(true);
                }}
                className="rounded-md p-2 text-left text-sm font-medium text-red-600 transition-all duration-75 hover:bg-red-600 hover:text-white"
              >
                <IconMenu
                  text="Delete API Key"
                  icon={<Trash className="h-4 w-4" />}
                />
              </button>
            </div>
          }
          align="end"
          openPopover={openPopover}
          setOpenPopover={setOpenPopover}
        >
          <button
            onClick={() => {
              setOpenPopover(!openPopover);
            }}
            className="absolute right-4 rounded-md px-1 py-2 transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
          >
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>
        </Popover>
      </div>
    </>
  );
};
