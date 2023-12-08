import { constructMetadata } from "@u0/utils";
import WelcomePageClient from "./page-client";

export const metadata = constructMetadata({
  title: "Welcome to Dub",
});

export default function WelcomePage() {
  return <WelcomePageClient />;
}
