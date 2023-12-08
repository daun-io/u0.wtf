"use client";

import { Button, Google, InfoTooltip } from "@u0/ui";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const next = searchParams?.get("next");
  const [clickedGoogle, setClickedGoogle] = useState(false);
  const [showSSOOption, setShowSSOOption] = useState(false);
  const [clickedSSO, setClickedSSO] = useState(false);

  return (
    <>
      <Button
        text="Google로 계속"
        onClick={() => {
          setClickedGoogle(true);
          signIn("google", {
            ...(next && next.length > 0 ? { callbackUrl: next } : {}),
          });
        }}
        loading={clickedGoogle}
        icon={<Google className="h-4 w-4" />}
      />
      <p className="text-center text-sm text-gray-500">
        이미 계정이 있나요?{" "}
        <Link
          href="/login"
          className="font-semibold text-gray-500 transition-colors hover:text-black"
        >
          로그인
        </Link>
        .
      </p>
    </>
  );
}
