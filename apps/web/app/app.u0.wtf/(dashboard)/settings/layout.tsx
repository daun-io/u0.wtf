import { ReactNode } from "react";
import SettingsLayout from "@/ui/layout/settings-layout";

export default function PersonalSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const tabs = [
    {
      name: "일반",
      segment: null,
    },
    {
      name: "API 키",
      segment: "tokens",
    },
  ];

  return <SettingsLayout tabs={tabs}>{children}</SettingsLayout>;
}
