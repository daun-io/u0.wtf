"use client";

import LinksContainer from "@/ui/links/links-container";
import { useAddEditLinkModal } from "@/ui/modals/add-edit-link-modal";
import {
  IconMenu,
  MaxWidthWrapper,
  Popover,
  Tooltip,
  TooltipContent,
} from "@u0/ui";
import useProject from "@/lib/swr/use-project";
import { ChevronDown, FilePlus2, Sheet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { ModalContext } from "@/ui/modals/provider";

export default function ProjectLinksClient() {
  const { AddEditLinkModal, AddEditLinkButton } = useAddEditLinkModal();

  return (
    <>
      <AddEditLinkModal />
      <div className="flex h-36 items-center border-b border-gray-200 bg-white">
        <MaxWidthWrapper>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl text-gray-600">링크</h1>
            <div className="flex">
              <AddEditLinkButton />
              <AddLinkOptions />
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
      <LinksContainer AddEditLinkButton={AddEditLinkButton} />
    </>
  );
}

const AddLinkOptions = () => {
  const router = useRouter();
  const { slug, exceededUsage } = useProject();
  const [openPopover, setOpenPopover] = useState(false);
  const { setShowUpgradePlanModal } = useContext(ModalContext);

  return (
    <Popover
      content={
        <div className="w-full divide-y divide-gray-200 md:w-52">
          <div className="p-2">
            {slug && exceededUsage ? (
              <Tooltip
                content={
                  <TooltipContent
                    title="Your project has exceeded its usage limit. We're still collecting data on your existing links, but you need to upgrade to edit them."
                    cta="프로로 업그레이드"
                    onClick={() => {
                      setOpenPopover(false);
                      setShowUpgradePlanModal(true);
                    }}
                  />
                }
              >
                <div className="flex w-full cursor-not-allowed items-center justify-between space-x-2 rounded-md p-2 text-sm text-gray-400">
                  <IconMenu
                    text="Import from Bitly"
                    icon={
                      <img
                        src="/_static/icons/bitly.svg"
                        alt="Bitly logo"
                        className="h-4 w-4 rounded-full grayscale"
                      />
                    }
                  />
                </div>
              </Tooltip>
            ) : (
              <button
                onClick={() => {
                  setOpenPopover(false);
                  router.push(`/${slug}?import=bitly`);
                }}
                className="w-full rounded-md p-2 hover:bg-gray-100 active:bg-gray-200"
              >
                <IconMenu
                  text="Import from Bitly"
                  icon={
                    <img
                      src="/_static/icons/bitly.svg"
                      alt="Bitly logo"
                      className="h-4 w-4 rounded-full grayscale"
                    />
                  }
                />
              </button>
            )}
            {slug && exceededUsage ? (
              <Tooltip
                content={
                  <TooltipContent
                    title="Your project has exceeded its usage limit. We're still collecting data on your existing links, but you need to upgrade to edit them."
                    cta="프로로 업그레이드"
                    onClick={() => {
                      setOpenPopover(false);
                      setShowUpgradePlanModal(true);
                    }}
                  />
                }
              >
                <div className="flex w-full cursor-not-allowed items-center justify-between space-x-2 rounded-md p-2 text-sm text-gray-400">
                  <IconMenu
                    text="Import from Short.io"
                    icon={
                      <img
                        src="/_static/icons/short.svg"
                        alt="Short.io logo"
                        className="h-4 w-4 grayscale"
                      />
                    }
                  />
                </div>
              </Tooltip>
            ) : (
              <button
                onClick={() => {
                  setOpenPopover(false);
                  router.push(`/${slug}?import=short`);
                }}
                className="w-full rounded-md p-2 hover:bg-gray-100 active:bg-gray-200"
              >
                <IconMenu
                  text="Import from Short.io"
                  icon={
                    <img
                      src="/_static/icons/short.svg"
                      alt="Short.io logo"
                      className="h-4 w-4 grayscale"
                    />
                  }
                />
              </button>
            )}
            <Tooltip content="This feature is still in development – we'll let you know when it's ready!">
              <div className="flex w-full cursor-not-allowed items-center justify-between space-x-2 rounded-md p-2 text-sm text-gray-400">
                <IconMenu
                  text="Import from CSV"
                  icon={<Sheet className="h-4 w-4" />}
                />
              </div>
            </Tooltip>
          </div>
          <div className="p-2">
            <Tooltip content="This feature is still in development – we'll let you know when it's ready!">
              <div className="flex w-full cursor-not-allowed items-center justify-between space-x-2 rounded-md p-2 text-sm text-gray-400">
                <IconMenu
                  text="Bulk create links"
                  icon={<FilePlus2 className="h-4 w-4" />}
                />
              </div>
            </Tooltip>
          </div>
        </div>
      }
      openPopover={openPopover}
      setOpenPopover={setOpenPopover}
      align="end"
    >
      <button
        onClick={() => setOpenPopover(!openPopover)}
        className="group ml-2 flex items-center justify-between space-x-2 rounded-md border border-gray-200 bg-white p-2.5 shadow transition-all duration-75 active:scale-95"
      >
        <ChevronDown
          className={`h-4 w-4 shrink-0 ${
            openPopover ? "rotate-180 text-gray-700" : "text-gray-400"
          } transition-all group-hover:text-gray-700`}
        />
      </button>
    </Popover>
  );
};
