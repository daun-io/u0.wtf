import { BlurImage } from "@/ui/shared/blur-image";
import { Button, Modal, useToastWithUndo } from "@u0/ui";
import { GOOGLE_FAVICON_URL, getApexDomain, linkConstructor } from "@u0/utils";
import { type Link as LinkProps } from "@prisma/client";
import { useParams } from "next/navigation";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { mutate } from "swr";

const sendArchiveRequest = (archived: boolean, id: string, slug?: string) => {
  const baseUrl = `/api/links/${id}/archive`;
  const queryString = slug ? `?projectSlug=${slug}` : "";
  return fetch(`${baseUrl}${queryString}`, {
    method: archived ? "POST" : "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const revalidateLinks = () => {
  return mutate(
    (key) => typeof key === "string" && key.startsWith("/api/links"),
    undefined,
    { revalidate: true },
  );
};

function ArchiveLinkModal({
  showArchiveLinkModal,
  setShowArchiveLinkModal,
  props,
  archived,
}: {
  showArchiveLinkModal: boolean;
  setShowArchiveLinkModal: Dispatch<SetStateAction<boolean>>;
  props: LinkProps;
  archived: boolean;
}) {
  const toastWithUndo = useToastWithUndo();

  const params = useParams() as { slug?: string };
  const { slug } = params;
  const [archiving, setArchiving] = useState(false);
  const apexDomain = getApexDomain(props.url);

  const { key, domain } = props;

  const shortlink = useMemo(() => {
    return linkConstructor({
      key,
      domain,
      pretty: true,
    });
  }, [key, domain]);

  const handleArchiveRequest = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setArchiving(true);
    const res = await sendArchiveRequest(archived, props.id, slug);
    setArchiving(false);

    if (!res.ok) {
      toast.error(res.statusText);
      return;
    }

    revalidateLinks();
    setShowArchiveLinkModal(false);
    toastWithUndo({
      id: "link-archive-undo-toast",
      message: `링크를 성공적으로 ${archived ? "보관" : "보관 취소"}했습니다!`,
      undo: undoAction,
      duration: 5000,
    });
  };

  const undoAction = () => {
    toast.promise(sendArchiveRequest(!archived, props.id, slug), {
      loading: "실행 취소 진행 중...",
      error: "변경 사항을 되돌리지 못했습니다. 오류가 발생했습니다.",
      success: () => {
        revalidateLinks();
        return "실행 취소 성공! 변경 사항이 되돌려졌습니다.";
      },
    });
  };

  return (
    <Modal
      showModal={showArchiveLinkModal}
      setShowModal={setShowArchiveLinkModal}
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 text-center sm:px-16">
        <BlurImage
          src={`${GOOGLE_FAVICON_URL}${apexDomain}`}
          alt={apexDomain}
          className="h-10 w-10 rounded-full"
          width={20}
          height={20}
        />
        <h3 className="text-lg font-medium">
          {shortlink} {archived ? "보관하기" : "보관 취소"}
        </h3>
        <p className="text-sm text-gray-500">
          {archived
            ? "보관된 링크는 여전히 동작하지만, 대쉬보드에서 숨겨집니다."
            : "보관을 취소하면 링크를 다시 대쉬보드에서 확인할 수 있습니다."}
        </p>
      </div>

      <div className="flex flex-col space-y-6 bg-gray-50 px-4 py-8 text-left sm:px-16">
        <Button
          onClick={handleArchiveRequest}
          autoFocus
          loading={archiving}
          text={`${archived ? "보관하기" : "보관 취소"}`}
        />
      </div>
    </Modal>
  );
}

export function useArchiveLinkModal({
  props,
  archived = true,
}: {
  props: LinkProps;
  archived: boolean;
}) {
  const [showArchiveLinkModal, setShowArchiveLinkModal] = useState(false);

  const ArchiveLinkModalCallback = useCallback(() => {
    return props ? (
      <ArchiveLinkModal
        showArchiveLinkModal={showArchiveLinkModal}
        setShowArchiveLinkModal={setShowArchiveLinkModal}
        props={props}
        archived={archived}
      />
    ) : null;
  }, [showArchiveLinkModal, setShowArchiveLinkModal]);

  return useMemo(
    () => ({
      setShowArchiveLinkModal,
      ArchiveLinkModal: ArchiveLinkModalCallback,
    }),
    [setShowArchiveLinkModal, ArchiveLinkModalCallback],
  );
}
