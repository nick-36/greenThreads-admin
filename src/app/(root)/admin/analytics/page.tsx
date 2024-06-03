import Analytics from "@/components/shared/Analytics";
import ServerPageWrapper from "@/app/(root)/serverPageWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "GreenThreads Dashboard",
};

export default function DashboardPage() {
  return (
    <ServerPageWrapper>
      <Analytics />
    </ServerPageWrapper>
  );
}
