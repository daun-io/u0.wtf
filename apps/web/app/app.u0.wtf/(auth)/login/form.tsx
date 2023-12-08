"use client";

import { Button, Google, InfoTooltip } from "@u0/ui";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams?.get("next");
  const [showEmailOption, setShowEmailOption] = useState(false);
  const [showSSOOption, setShowSSOOption] = useState(false);
  const [noSuchAccount, setNoSuchAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [clickedGoogle, setClickedGoogle] = useState(false);
  const [clickedEmail, setClickedEmail] = useState(false);
  const [clickedSSO, setClickedSSO] = useState(false);

  useEffect(() => {
    const error = searchParams?.get("error");
    error && toast.error(error);
  }, [searchParams]);

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
        disabled={clickedEmail || clickedSSO}
        icon={<Google className="h-4 w-4" />}
      />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setClickedEmail(true);
          fetch("/api/auth/account-exists", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          })
            .then(async (res) => {
              const { exists } = await res.json();
              if (exists) {
                signIn("email", {
                  email,
                  redirect: false,
                  ...(next && next.length > 0 ? { callbackUrl: next } : {}),
                }).then((res) => {
                  setClickedEmail(false);
                  if (res?.ok && !res?.error) {
                    setEmail("");
                    toast.success(
                      "메일을 전송했습니다. 받은 편지함을 확인하세요.",
                    );
                  } else {
                    toast.error("이메일 전송에 실패했습니다.");
                  }
                });
              } else {
                toast.error("이메일 주소로 계정을 찾지 못했습니다.");
                setNoSuchAccount(true);
                setClickedEmail(false);
              }
            })
            .catch(() => {
              setClickedEmail(false);
              toast.error("이메일 전송에 실패했습니다.");
            });
        }}
        className="flex flex-col space-y-3"
      >
        {showEmailOption && (
          <div>
            <div className="mb-4 mt-1 border-t border-gray-300" />
            <input
              id="email"
              name="email"
              autoFocus
              type="email"
              placeholder="alan.turing@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setNoSuchAccount(false);
                setEmail(e.target.value);
              }}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            />
          </div>
        )}
        <Button
          text="이메일로 계속"
          variant="secondary"
          {...(!showEmailOption && {
            type: "button",
            onClick: (e) => {
              e.preventDefault();
              setShowSSOOption(false);
              setShowEmailOption(true);
            },
          })}
          loading={clickedEmail}
          disabled={clickedGoogle || clickedSSO}
        />
      </form>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setClickedSSO(true);
          fetch("/api/auth/saml/verify", {
            method: "POST",
            body: JSON.stringify({ slug: e.currentTarget.slug.value }),
          }).then(async (res) => {
            const { data, error } = await res.json();
            if (error) {
              toast.error(error);
              setClickedSSO(false);
              return;
            }
            await signIn("saml", undefined, {
              tenant: data.projectId,
              product: "Dub",
            });
          });
        }}
        className="flex flex-col space-y-3"
      >
        {showSSOOption && (
          <div>
            <div className="mb-4 mt-1 border-t border-gray-300" />
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-medium text-gray-900">
                Project Slug
              </h2>
              <InfoTooltip
                content={`This is your project's unique identifier on U0. E.g. app.u0.wtf/acme is "acme".`}
              />
            </div>
            <input
              id="slug"
              name="slug"
              autoFocus
              type="text"
              placeholder="my-team"
              autoComplete="off"
              required
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            />
          </div>
        )}
        <Button
          text="SAML SSO로 계속"
          variant="secondary"
          {...(!showSSOOption && {
            type: "button",
            onClick: (e) => {
              e.preventDefault();
              setShowEmailOption(false);
              setShowSSOOption(true);
            },
          })}
          loading={clickedSSO}
          disabled={clickedGoogle || clickedEmail}
        />
      </form>
      {noSuchAccount ? (
        <p className="text-center text-sm text-red-500">
          계정이 존재하지 않습니다.{" "}
          <Link href="/register" className="font-semibold text-red-600">
            회원가입
          </Link>
        </p>
      ) : (
        <p className="text-center text-sm text-gray-500">
          계정이 없나요?{" "}
          <Link
            href="/register"
            className="font-semibold text-gray-500 transition-colors hover:text-black"
          >
            회원가입
          </Link>
        </p>
      )}
    </>
  );
}
