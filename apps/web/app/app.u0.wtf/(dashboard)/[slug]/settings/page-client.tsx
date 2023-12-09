"use client";

import useProject from "@/lib/swr/use-project";
import DeleteProject from "@/ui/projects/delete-project";
import UploadLogo from "@/ui/projects/upload-logo";
import { Form } from "@u0/ui";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { mutate } from "swr";

export default function ProjectSettingsClient() {
  const router = useRouter();
  const { name, slug, plan, isOwner } = useProject();

  return (
    <>
      <Form
        title="브랜드 이름"
        description="U0에서 사용할 브랜드의 이름입니다."
        inputData={{
          name: "name",
          defaultValue: name,
          placeholder: "My Project",
          maxLength: 32,
        }}
        helpText="최대 32 글자."
        {...(plan === "enterprise" &&
          !isOwner && {
            disabledTooltip: "Only project owners can change the project name.",
          })}
        handleSubmit={(updateData) =>
          fetch(`/api/projects/${slug}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          }).then(async (res) => {
            if (res.status === 200) {
              await Promise.all([
                mutate("/api/projects"),
                mutate(`/api/projects/${slug}`),
              ]);
              toast.success("브랜드 이름을 업데이트했습니다.");
            } else if (res.status === 422) {
              toast.error("브랜드 식별자가 이미 존재합니다.");
            } else {
              const errorMessage = await res.text();
              toast.error(errorMessage || "오류가 발생했습니다.");
            }
          })
        }
      />
      <Form
        title="브랜드 식별자"
        description="U0에서 표기되는 브랜드마다 고유한 URL 식별자입니다."
        inputData={{
          name: "slug",
          defaultValue: slug,
          placeholder: "my-project",
          pattern: "^[a-z0-9-]+$",
          maxLength: 48,
        }}
        helpText="영문 소문자, 숫자, '-' 표시만 사용 가능. 최대 48자."
        {...(plan === "enterprise" &&
          !isOwner && {
            disabledTooltip: "브랜드 소유자만 식별자를 수정할 수 있습니다..",
          })}
        handleSubmit={(data) =>
          fetch(`/api/projects/${slug}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }).then(async (res) => {
            if (res.status === 200) {
              const { slug: newSlug } = await res.json();
              await mutate("/api/projects");
              router.push(`/${newSlug}/settings`);
              toast.success("브랜드 식별자를 업데이트했습니다.");
            } else if (res.status === 422) {
              toast.error("브랜드 식별자가 이미 존재합니다.");
            } else {
              toast.error("오류가 발생했습니다.");
            }
          })
        }
      />
      <UploadLogo />
      <DeleteProject />
    </>
  );
}
