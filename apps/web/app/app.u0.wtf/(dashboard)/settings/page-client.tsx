"use client";

import { Form } from "@u0/ui";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import UploadAvatar from "@/ui/account/upload-avatar";
import DeleteAccountSection from "@/ui/account/delete-account";

export default function SettingsPageClient() {
  const { data: session, update, status } = useSession();

  return (
    <>
      <Form
        title="이름"
        description="U0에서 사용되는 이름입니다."
        inputData={{
          name: "name",
          defaultValue:
            status === "loading" ? undefined : session?.user?.name || "",
          placeholder: "Steve Jobs",
          maxLength: 32,
        }}
        helpText="최대 32글자"
        handleSubmit={(data) =>
          fetch("/api/user", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }).then(async (res) => {
            if (res.status === 200) {
              update();
              toast.success("Successfully updated your name!");
            } else {
              const errorMessage = await res.text();
              toast.error(errorMessage || "Something went wrong");
            }
          })
        }
      />
      <Form
        title="이메일"
        description="로그인 시 또는 알림을 수신하기 위해서 사용하는 이메일입니다."
        inputData={{
          name: "email",
          defaultValue: session?.user?.email || undefined,
          placeholder: "alan.turing@example.com",
        }}
        helpText="유효한 이메일 주소를 입력해주세요."
        handleSubmit={(data) =>
          fetch("/api/user", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }).then(async (res) => {
            if (res.status === 200) {
              update();
              toast.success("Successfully updated your email!");
            } else {
              const errorMessage = await res.text();
              toast.error(errorMessage || "Something went wrong");
            }
          })
        }
      />
      <UploadAvatar />
      <DeleteAccountSection />
    </>
  );
}
