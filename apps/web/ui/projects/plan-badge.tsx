import { PlanProps } from "@/lib/types";
import { Badge } from "@u0/ui";

export default function PlanBadge({ plan }: { plan: PlanProps }) {
  return (
    <Badge
      variant={
        plan === "enterprise" ? "violet" : plan === "pro" ? "blue" : "black"
      }
    >
      {plan === "enterprise"
        ? "엔터프라이즈"
        : plan === "pro"
        ? "프로"
        : "무료"}
    </Badge>
  );
}
