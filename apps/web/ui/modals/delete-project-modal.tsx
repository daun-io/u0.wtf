import useProject from "@/lib/swr/use-project";
import { BlurImage } from "@/ui/shared/blur-image";
import { Button, Modal } from "@u0/ui";
import { cn } from "@u0/utils";
import { useParams, useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { mutate } from "swr";

function DeleteProjectModal({
  showDeleteProjectModal,
  setShowDeleteProjectModal,
}: {
  showDeleteProjectModal: boolean;
  setShowDeleteProjectModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { slug } = useParams() as { slug: string };
  const { id, logo, plan, isOwner } = useProject();

  const [deleting, setDeleting] = useState(false);

  async function deleteProject() {
    return new Promise((resolve, reject) => {
      setDeleting(true);
      fetch(`/api/projects/${slug}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        if (res.ok) {
          await mutate("/api/projects");
          router.push("/");
          resolve(null);
        } else {
          setDeleting(false);
          const error = await res.text();
          reject(error);
        }
      });
    });
  }

  return (
    <Modal
      showModal={showDeleteProjectModal}
      setShowModal={setShowDeleteProjectModal}
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 sm:px-16">
        <BlurImage
          src={logo || `https://avatar.vercel.sh/${id}`}
          alt={id || "브랜드 삭제"}
          className="h-10 w-10 rounded-full border border-gray-200"
          width={20}
          height={20}
        />
        <h3 className="text-lg font-medium">브랜드 삭제</h3>
        <p className="text-center text-sm text-gray-500">
          브랜드, 사용자 정의 도메인 및 관련된 모든 링크와 해당 통계를 영구
          삭제합니다. 이 작업은 되돌릴 수 없습니다.
        </p>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          toast.promise(deleteProject(), {
            loading: "브랜드 삭제중...",
            success: "브랜드가 삭제되었습니다.",
            error: (err) => err,
          });
        }}
        className="flex flex-col space-y-6 bg-gray-50 px-4 py-8 text-left sm:px-16"
      >
        <div>
          <label
            htmlFor="project-slug"
            className="block text-sm font-medium text-gray-700"
          >
            계속하려면 브랜드 식별자{" "}
            <span className="font-semibold text-black">{slug}</span> 를
            입력해주세요:
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="text"
              name="project-slug"
              id="project-slug"
              autoFocus={false}
              autoComplete="off"
              pattern={slug}
              disabled={plan === "enterprise" && !isOwner}
              className={cn(
                "block w-full rounded-md border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm",
                {
                  "cursor-not-allowed bg-gray-100":
                    plan === "enterprise" && !isOwner,
                },
              )}
            />
          </div>
        </div>

        <div>
          <label htmlFor="verification" className="block text-sm text-gray-700">
            확인을 위해{" "}
            <span className="font-semibold text-black">브랜드 삭제</span>를
            입력해주세요.
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="text"
              name="verification"
              id="verification"
              pattern="브랜드 삭제"
              required
              autoFocus={false}
              autoComplete="off"
              disabled={plan === "enterprise" && !isOwner}
              className={cn(
                "block w-full rounded-md border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm",
                {
                  "cursor-not-allowed bg-gray-100":
                    plan === "enterprise" && !isOwner,
                },
              )}
            />
          </div>
        </div>

        <Button
          text="브랜드를 삭제합니다."
          variant="danger"
          loading={deleting}
          {...(plan === "enterprise" &&
            !isOwner && {
              disabledTooltip: "Only project owners can delete a project.",
            })}
        />
      </form>
    </Modal>
  );
}

export function useDeleteProjectModal() {
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);

  const DeleteProjectModalCallback = useCallback(() => {
    return (
      <DeleteProjectModal
        showDeleteProjectModal={showDeleteProjectModal}
        setShowDeleteProjectModal={setShowDeleteProjectModal}
      />
    );
  }, [showDeleteProjectModal, setShowDeleteProjectModal]);

  return useMemo(
    () => ({
      setShowDeleteProjectModal,
      DeleteProjectModal: DeleteProjectModalCallback,
    }),
    [setShowDeleteProjectModal, DeleteProjectModalCallback],
  );
}
