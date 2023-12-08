import { constructMetadata } from "@u0/utils";
import WelcomePageClient from "./page-client";

export const metadata = constructMetadata({
  title: "Welcome to U0",
});

export default function WelcomePage() {
  return <WelcomePageClient />;
}
