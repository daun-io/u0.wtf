import { BlurImage } from "@/ui/shared/blur-image";
import { Button, Modal } from "@u0/ui";
import { GOOGLE_FAVICON_URL, getApexDomain, linkConstructor } from "@u0/utils";
import { type Link as LinkProps } from "@prisma/client";
import { useParams, useSearchParams } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { mutate } from "swr";

function DeleteLinkModal({
  showDeleteLinkModal,
  setShowDeleteLinkModal,
  props,
}: {
  showDeleteLinkModal: boolean;
  setShowDeleteLinkModal: Dispatch<SetStateAction<boolean>>;
  props: LinkProps;
}) {
  const params = useParams() as { slug?: string };
  const { slug } = params;
  const searchParams = useSearchParams();
  const [deleting, setDeleting] = useState(false);
  const apexDomain = getApexDomain(props.url);

  const { key, domain } = props;

  const shortlink = useMemo(() => {
    return linkConstructor({
      key,
      domain,
      pretty: true,
    });
  }, [key, domain]);

  return (
    <Modal
      showModal={showDeleteLinkModal}
      setShowModal={setShowDeleteLinkModal}
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 text-center sm:px-16">
        <BlurImage
          src={`${GOOGLE_FAVICON_URL}${apexDomain}`}
          alt={apexDomain}
          className="h-10 w-10 rounded-full"
          width={20}
          height={20}
        />
        <h3 className="text-lg font-medium">{shortlink} 삭제하기</h3>
        <p className="text-sm text-gray-500">
          이 링크를 삭제하면 해당 통계가 모두 제거됩니다. 이 작업은 은 되돌릴 수
          없습니다.
        </p>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setDeleting(true);
          fetch(`/api/links/${props.id}${slug ? `?projectSlug=${slug}` : ""}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }).then(async (res) => {
            if (res.status === 200) {
              await mutate(
                (key) =>
                  typeof key === "string" && key.startsWith("/api/links"),
                undefined,
                { revalidate: true },
              );
              setShowDeleteLinkModal(false);
              toast.success("짧은 URL을 삭제했습니다.");
            } else {
              const { error } = await res.json();
              toast.error(error);
            }
            setDeleting(false);
          });
        }}
        className="flex flex-col space-y-6 bg-gray-50 px-4 py-8 text-left sm:px-16"
      >
        <div>
          <label htmlFor="verification" className="block text-sm text-gray-700">
            <span className="font-semibold">{shortlink}</span> 을 입력해 삭제를
            확인해주세요.
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="text"
              name="verification"
              id="verification"
              pattern={shortlink}
              required
              autoFocus
              autoComplete="off"
              className="block w-full rounded-md border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
          </div>
        </div>

        <Button variant="danger" text="링크 삭제하기" loading={deleting} />
      </form>
    </Modal>
  );
}

export function useDeleteLinkModal({ props }: { props?: LinkProps }) {
  const [showDeleteLinkModal, setShowDeleteLinkModal] = useState(false);

  const DeleteLinkModalCallback = useCallback(() => {
    return props ? (
      <DeleteLinkModal
        showDeleteLinkModal={showDeleteLinkModal}
        setShowDeleteLinkModal={setShowDeleteLinkModal}
        props={props}
      />
    ) : null;
  }, [showDeleteLinkModal, setShowDeleteLinkModal]);

  return useMemo(
    () => ({
      setShowDeleteLinkModal,
      DeleteLinkModal: DeleteLinkModalCallback,
    }),
    [setShowDeleteLinkModal, DeleteLinkModalCallback],
  );
}
