"use client";

import useProject from "@/lib/swr/use-project";
import useUsers from "@/lib/swr/use-users";
import { UserProps } from "@/lib/types";
import { useEditRoleModal } from "@/ui/modals/edit-role-modal";
import { useRemoveTeammateModal } from "@/ui/modals/remove-teammate-modal";
import { BlurImage } from "@/ui/shared/blur-image";
import { ThreeDots } from "@/ui/shared/icons";
import { Avatar, Badge, IconMenu, Popover } from "@u0/ui";
import { cn, timeAgo } from "@u0/utils";
import { UserMinus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useInviteTeammateModal } from "@/ui/modals/invite-teammate-modal";

const tabs: Array<"멤버" | "초대중"> = ["멤버", "초대중"];

export default function ProjectPeopleClient() {
  const { setShowInviteTeammateModal, InviteTeammateModal } =
    useInviteTeammateModal();

  const [currentTab, setCurrentTab] = useState<"멤버" | "초대중">("멤버");

  const { users } = useUsers({ invites: currentTab === "초대중" });

  return (
    <>
      <InviteTeammateModal />
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="flex flex-col items-center justify-between space-y-3 p-5 sm:flex-row sm:space-y-0 sm:p-10">
          <div className="flex flex-col space-y-3">
            <h2 className="text-xl font-medium">멤버</h2>
            <p className="text-sm text-gray-500">
              브랜드에 접근할 수 있는 팀원들을 관리합니다.
            </p>
          </div>
          <button
            onClick={() => setShowInviteTeammateModal(true)}
            className="h-9 w-full rounded-md border border-black bg-black px-6 text-sm text-white transition-all duration-150 ease-in-out hover:bg-white hover:text-black focus:outline-none sm:w-auto"
          >
            초대하기
          </button>
        </div>
        <div className="flex space-x-3 border-b border-gray-200 px-3 sm:px-7">
          {tabs.map((tab) => (
            <div
              key={tab}
              className={`${
                tab === currentTab ? "border-black" : "border-transparent"
              } border-b py-1`}
            >
              <button
                onClick={() => setCurrentTab(tab)}
                className="rounded-md px-3 py-1.5 text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
              >
                {tab}
              </button>
            </div>
          ))}
        </div>
        <div className="grid divide-y divide-gray-200">
          {users ? (
            users.length > 0 ? (
              users.map((user) => (
                <UserCard
                  key={user.email}
                  user={user}
                  currentTab={currentTab}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <BlurImage
                  src="/_static/illustrations/video-park.svg"
                  alt="초대한 멤버 없음"
                  width={300}
                  height={300}
                  className="pointer-events-none -my-8"
                />
                <p className="text-sm text-gray-500">초대한 멤버가 없습니다.</p>
              </div>
            )
          ) : (
            Array.from({ length: 5 }).map((_, i) => <UserPlaceholder key={i} />)
          )}
        </div>
      </div>
    </>
  );
}

const UserCard = ({
  user,
  currentTab,
}: {
  user: UserProps;
  currentTab: "멤버" | "초대중";
}) => {
  const [openPopover, setOpenPopover] = useState(false);

  const { plan, isOwner } = useProject();

  const { name, email, createdAt, role: currentRole } = user;

  const [role, setRole] = useState<"owner" | "member">(currentRole);

  const { EditRoleModal, setShowEditRoleModal } = useEditRoleModal({
    user,
    role,
  });

  const { RemoveTeammateModal, setShowRemoveTeammateModal } =
    useRemoveTeammateModal({ user, invite: currentTab === "초대중" });

  const { data: session } = useSession();

  // invites expire after 14 days of being sent
  const expiredInvite =
    currentTab === "초대중" &&
    createdAt &&
    Date.now() - new Date(createdAt).getTime() > 14 * 24 * 60 * 60 * 1000;

  return (
    <>
      <EditRoleModal />
      <RemoveTeammateModal />
      <div
        key={email}
        className="flex items-center justify-between space-x-3 px-4 py-3 sm:pl-8"
      >
        <div className="flex items-start space-x-3">
          <div className="flex items-center space-x-3">
            <Avatar user={user} />
            <div className="flex flex-col">
              <h3 className="text-sm font-medium">{name || email}</h3>
              <p className="text-xs text-gray-500">{email}</p>
            </div>
          </div>

          {expiredInvite && <Badge variant="gray">Expired</Badge>}
        </div>
        <div className="flex items-center space-x-3">
          {currentTab === "멤버" ? (
            session?.user?.email === email ? (
              <p className="text-xs capitalize text-gray-500">{role}</p>
            ) : (
              <select
                className={cn(
                  "rounded-md border border-gray-200 text-xs text-gray-500 focus:border-gray-600 focus:ring-gray-600",
                  {
                    "cursor-not-allowed bg-gray-100":
                      plan === "enterprise" && !isOwner,
                  },
                )}
                value={role}
                disabled={plan === "enterprise" && !isOwner}
                onChange={(e) => {
                  setRole(e.target.value as "owner" | "member");
                  setOpenPopover(false);
                  setShowEditRoleModal(true);
                }}
              >
                <option value="owner">소유자</option>
                <option value="member">멤버</option>
              </select>
            )
          ) : (
            <p className="text-xs text-gray-500" suppressHydrationWarning>
              Invited {timeAgo(createdAt)}
            </p>
          )}

          <Popover
            content={
              <div className="grid w-full gap-1 p-2 sm:w-48">
                <button
                  onClick={() => {
                    setOpenPopover(false);
                    setShowRemoveTeammateModal(true);
                  }}
                  className="rounded-md p-2 text-left text-sm font-medium text-red-600 transition-all duration-75 hover:bg-red-600 hover:text-white"
                >
                  <IconMenu
                    text={
                      session?.user?.email === email
                        ? "브랜드 나가기"
                        : currentTab === "멤버"
                        ? "팀원 삭제"
                        : "초대 취소"
                    }
                    icon={<UserMinus className="h-4 w-4" />}
                  />
                </button>
              </div>
            }
            align="end"
            openPopover={openPopover}
            setOpenPopover={setOpenPopover}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenPopover(!openPopover);
              }}
              className="rounded-md px-1 py-2 transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
            >
              <span className="sr-only">수정하기</span>
              <ThreeDots className="h-5 w-5 text-gray-500" />
            </button>
          </Popover>
        </div>
      </div>
    </>
  );
};

const UserPlaceholder = () => (
  <div className="flex items-center justify-between space-x-3 px-4 py-3 sm:px-8">
    <div className="flex items-center space-x-3">
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
      <div className="flex flex-col">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="mt-1 h-3 w-32 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
    <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
  </div>
);
