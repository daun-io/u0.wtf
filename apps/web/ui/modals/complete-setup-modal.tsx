import useDomains from "@/lib/swr/use-domains";
import useLinksCount from "@/lib/swr/use-links-count";
import useUsers from "@/lib/swr/use-users";
import { ModalContext } from "@/ui/modals/provider";
import { CheckCircleFill } from "@/ui/shared/icons";
import { ExpandingArrow, Logo, Modal } from "@u0/ui";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

function CompleteSetupModal({
  showCompleteSetupModal,
  setShowCompleteSetupModal,
}: {
  showCompleteSetupModal: boolean;
  setShowCompleteSetupModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { slug } = useParams() as { slug: string };

  const { verified } = useDomains();
  const { data: count } = useLinksCount();
  const { users } = useUsers();
  const { users: invites } = useUsers({ invites: true });
  const { setShowAddEditLinkModal } = useContext(ModalContext);

  const tasks = useMemo(() => {
    return [
      {
        display: "커스텀 도메인 설정하기",
        cta: `/${slug}/domains`,
        checked: verified,
      },
      {
        display: "링크 생성하기",
        cta: `/${slug}`,
        checked: count > 0,
      },
      {
        display: "팀원 초대하기",
        cta: `/${slug}/settings/people`,
        checked: (users && users.length > 1) || (invites && invites.length > 0),
      },
    ];
  }, [slug, verified, count]);

  return (
    <Modal
      showModal={showCompleteSetupModal}
      setShowModal={setShowCompleteSetupModal}
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 sm:px-16">
        <Logo />
        <h3 className="text-lg font-medium">거의 다 됐어요!</h3>
        <p className="text-center text-sm text-gray-500">
          아래 단계를 완료하고 짧은 브랜드 URL을 생성해보세요.
        </p>
      </div>
      <div className="flex flex-col space-y-6 bg-gray-50 px-4 py-8 text-left sm:px-12">
        <div className="grid divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
          {tasks.map(({ display, cta, checked }) => {
            const contents = (
              <div className="group flex items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                  <CheckCircleFill
                    className={`h-5 w-5 ${
                      checked ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                  <p className="text-sm">{display}</p>
                </div>
                <div className="mr-5">
                  <ExpandingArrow />
                </div>
              </div>
            );
            return (
              <Link
                key={display}
                href={cta}
                onClick={() => {
                  setShowCompleteSetupModal(false);
                  display === "Create or import your links" &&
                    setShowAddEditLinkModal(true);
                }}
              >
                {contents}
              </Link>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

export function useCompleteSetupModal() {
  const [showCompleteSetupModal, setShowCompleteSetupModal] = useState(false);

  const CompleteSetupModalCallback = useCallback(() => {
    return (
      <CompleteSetupModal
        showCompleteSetupModal={showCompleteSetupModal}
        setShowCompleteSetupModal={setShowCompleteSetupModal}
      />
    );
  }, [showCompleteSetupModal, setShowCompleteSetupModal]);

  return useMemo(
    () => ({
      setShowCompleteSetupModal,
      CompleteSetupModal: CompleteSetupModalCallback,
    }),
    [setShowCompleteSetupModal, CompleteSetupModalCallback],
  );
}
