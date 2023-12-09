import { Button, Logo } from "@u0/ui";
import { HOME_DOMAIN, constructMetadata } from "@u0/utils";
import { Suspense } from "react";
import LoginForm from "./form";

export const metadata = constructMetadata({
  title: "U0 로그인",
});

export default function LoginPage() {
  return (
    <div className="relative z-10 mt-[calc(30vh)] h-fit w-full max-w-md overflow-hidden border border-gray-100 sm:rounded-2xl sm:shadow-xl">
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
        <a href={HOME_DOMAIN}>
          <Logo className="h-10 w-10" />
        </a>
        <h3 className="text-xl font-semibold">
          <span className="font-mono">U0</span> 로그인
        </h3>
        <p className="text-sm text-gray-500">
          브랜드를 알리는 짧은 URL을 만들어보세요.
        </p>
      </div>
      <div className="flex flex-col space-y-3 bg-gray-50 px-4 py-8 sm:px-16">
        <Suspense
          fallback={
            <>
              <Button disabled={true} text="" variant="secondary" />
              <Button disabled={true} text="" variant="secondary" />
              <Button disabled={true} text="" variant="secondary" />
              <div className="mx-auto h-5 w-3/4 rounded-lg bg-gray-100" />
            </>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
