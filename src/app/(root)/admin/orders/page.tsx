import React from "react";
import ServerPageWrapper from "@/app/(root)/serverPageWrapper";
// import OrderList from "@/components/shared/Listing/OrderList";
import OrdersListClient from "./orders-client";

// const fetchWithAuthorization = withAuthorization();

const Page = async () => {
  // const orders = await fetchWithAuthorization("/orders");

  return (
    <ServerPageWrapper headerProps={{ headerTitle: "Orders" }}>
      <OrdersListClient />
    </ServerPageWrapper>
  );
};

export default Page;
