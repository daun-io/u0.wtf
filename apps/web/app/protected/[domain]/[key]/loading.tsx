import { Background, LoadingSpinner } from "@u0/ui";

export default function Loading() {
  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <LoadingSpinner />
      <Background />
    </main>
  );
}
