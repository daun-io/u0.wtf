import { redirect } from "next/navigation";

export default function OldLinksStatsPage({
  params,
}: {
  params: {
    key: string;
  };
}) {
  redirect(`/analytics?domain=u0.wtf&key=${params.key}`);
}
