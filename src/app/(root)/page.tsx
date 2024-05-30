import BusinessStatsCardList from "@/components/shared/Listing/StatsCardList";
import OrderList from "@/components/shared/Listing/OrderList";
import { HEADER_VARIANTS } from "@/lib/utils/constants";
import ServerPageWrapper from "./serverPageWrapper";
import { withAuthorization } from "@/lib/utils/axios";

const fetchWithAuthorization = withAuthorization();

export default async function Home() {
  const currentDayAnalytics = await fetchWithAuthorization("/analytics/today");
  const statsArray = [
    {
      title: "Today Orders",
      subTitle: String(currentDayAnalytics.todayOrders).padStart(2, "0"), // Ensuring the subtitle is a two-digit string
      icon: "/assets/shoppingBag.svg",
    },
    {
      title: "Today Revenue",
      subTitle: `$${currentDayAnalytics.todayRevenue}`, // Formatting the revenue with a dollar sign
      icon: "/assets/doller.svg",
    },
  ];

  return (
    <ServerPageWrapper headerProps={{ variant: HEADER_VARIANTS.Enhanced }}>
      <BusinessStatsCardList statsData={statsArray} />
      <OrderList />
    </ServerPageWrapper>
  );
}
