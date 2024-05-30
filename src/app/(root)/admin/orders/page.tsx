import React from "react";
import ServerPageWrapper from "../serverPageWrapper";
import OrderList from "@/components/shared/Listing/OrderList";
import { withAuthorization } from "@/lib/utils/axios";

// const fetchWithAuthorization = withAuthorization();

const Page = async () => {
  // const orders = await fetchWithAuthorization("/orders");

  return (
    <ServerPageWrapper headerProps={{ headerTitle: "Orders" }}>
      <OrderList  />
    </ServerPageWrapper>
  );
};

export default Page;
