import useProject from "@/lib/swr/use-project";
import { UserProps } from "@/lib/types";
import { BlurImage } from "@/ui/shared/blur-image";
import { Avatar, Button, Logo, Modal } from "@u0/ui";
import { useSession } from "next-auth/react";
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

function RemoveTeammateModal({
  showRemoveTeammateModal,
  setShowRemoveTeammateModal,
  user,
  invite,
}: {
  showRemoveTeammateModal: boolean;
  setShowRemoveTeammateModal: Dispatch<SetStateAction<boolean>>;
  user: UserProps;
  invite?: boolean;
}) {
  const router = useRouter();
  const { slug } = useParams() as { slug: string };
  const [removing, setRemoving] = useState(false);
  const { name: projectName, logo } = useProject();
  const { data: session } = useSession();
  const { id, name, email } = user;

  return (
    <Modal
      showModal={showRemoveTeammateModal}
      setShowModal={setShowRemoveTeammateModal}
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 sm:px-16">
        {logo ? (
          <BlurImage
            src={logo}
            alt="Project logo"
            className="h-10 w-10 rounded-full"
            width={20}
            height={20}
          />
        ) : (
          <Logo />
        )}
        <h3 className="text-lg font-medium">
          {invite
            ? "초대 취소"
            : session?.user?.email === email
            ? "프로젝트 떠나기"
            : "팀원 제거"}
        </h3>
        <p className="text-center text-sm text-gray-500">
          {invite
            ? "이 작업은 "
            : session?.user?.email === email
            ? "당신은 이 프로젝트를 떠나려고 합니다. "
            : "이 작업은 "}
          <span className="font-semibold text-black">
            {session?.user?.email === email ? projectName : name || email}
          </span>
          {invite
            ? "님의 브랜드 참가 초대를 취소합니다. "
            : session?.user?.email === email
            ? "모든 접근 권한을 잃게 됩니다. "
            : "님을 프로젝트에서 제거합니다. "}
          계속하시겠습니까?
        </p>
      </div>

      <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 text-left sm:px-16">
        <div className="flex items-center space-x-3 rounded-md border border-gray-300 bg-white p-3">
          <Avatar user={user} />
          <div className="flex flex-col">
            <h3 className="text-sm font-medium">{name || email}</h3>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
        </div>
        <Button
          text="Confirm"
          variant="danger"
          autoFocus
          loading={removing}
          onClick={() => {
            setRemoving(true);
            fetch(
              `/api/projects/${slug}/${
                invite ? `invites?email=${email}` : `users?userId=${id}`
              }`,
              {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
              },
            ).then(async (res) => {
              if (res.status === 200) {
                await mutate(
                  `/api/projects/${slug}/${invite ? "invites" : "users"}`,
                );
                if (session?.user?.email === email) {
                  await mutate("/api/projects");
                  router.push("/");
                } else {
                  setShowRemoveTeammateModal(false);
                }
                toast.success(
                  session?.user?.email === email
                    ? "You have left the project!"
                    : invite
                    ? "Successfully revoked invitation!"
                    : "Successfully removed teammate!",
                );
              } else {
                const error = await res.text();
                toast.error(error);
              }
              setRemoving(false);
            });
          }}
        />
      </div>
    </Modal>
  );
}

export function useRemoveTeammateModal({
  user,
  invite,
}: {
  user: UserProps;
  invite?: boolean;
}) {
  const [showRemoveTeammateModal, setShowRemoveTeammateModal] = useState(false);

  const RemoveTeammateModalCallback = useCallback(() => {
    return (
      <RemoveTeammateModal
        showRemoveTeammateModal={showRemoveTeammateModal}
        setShowRemoveTeammateModal={setShowRemoveTeammateModal}
        user={user}
        invite={invite}
      />
    );
  }, [showRemoveTeammateModal, setShowRemoveTeammateModal]);

  return useMemo(
    () => ({
      setShowRemoveTeammateModal,
      RemoveTeammateModal: RemoveTeammateModalCallback,
    }),
    [setShowRemoveTeammateModal, RemoveTeammateModalCallback],
  );
}
