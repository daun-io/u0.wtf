"use client";

import { Copy, LoadingSpinner, Tick } from "@u0/ui";
import { cn } from "@u0/utils";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { getUser } from "../actions";

export default function ImpersonateUser() {
  const [data, setData] = useState<{
    email: string;
    impersonateUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col space-y-5">
      <form
        action={(data) =>
          getUser(data).then((res) => {
            if (res.error) {
              toast.error(res.error);
            } else {
              // @ts-ignore
              setData(res);
            }
          })
        }
      >
        <Form />
      </form>
      {data && (
        <div className="flex w-full items-center space-x-3">
          <input
            type="email"
            name="email"
            id="email"
            value={data.email}
            readOnly
            className="w-full rounded-md border-gray-300 text-sm text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500"
          />
          <button
            type="button"
            onClick={() => {
              setCopied(true);
              navigator.clipboard.writeText(data.impersonateUrl);
              toast.success("클립보드에 복사했습니다.");
              setTimeout(() => {
                setCopied(false);
              }, 3000);
            }}
            className="rounded-md border border-gray-300 p-2"
          >
            {copied ? (
              <Tick className="h-5 w-5 text-gray-500" />
            ) : (
              <Copy className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}

const Form = () => {
  const { pending } = useFormStatus();

  return (
    <div className="relative flex w-full rounded-md shadow-sm">
      <input
        name="email"
        id="email"
        type="email"
        required
        disabled={pending}
        autoComplete="off"
        className={cn(
          "block w-full rounded-md border-gray-300 text-sm text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500",
          pending && "bg-gray-100",
        )}
        placeholder="stey@vercel.com"
        aria-invalid="true"
      />
      {pending && (
        <LoadingSpinner className="absolute inset-y-0 right-2 my-auto h-full w-5 text-gray-400" />
      )}
    </div>
  );
};
