import ServerPageWrapper from "../../serverPageWrapper";
import NotificationList from "@/components/shared/Listing/NotificationList";
import { notifications } from "@/lib/utils/constants";

export default function Home() {
  return (
    <ServerPageWrapper>
      <NotificationList items={notifications} />
    </ServerPageWrapper>
  );
}
