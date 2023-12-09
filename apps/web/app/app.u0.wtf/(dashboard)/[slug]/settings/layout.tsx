import { ReactNode } from "react";
import SettingsLayout from "@/ui/layout/settings-layout";

export default function ProjectSettingsLayout({
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
      name: "결제",
      segment: "billing",
    },
    {
      name: "멤버",
      segment: "people",
    },
    {
      name: "보안",
      segment: "security",
    },
  ];

  return <SettingsLayout tabs={tabs}>{children}</SettingsLayout>;
}
