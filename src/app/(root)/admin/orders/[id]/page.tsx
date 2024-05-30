import OrderDetails from "@/components/shared/Cards/OrderDetails";
import React, { cache } from "react";
import ServerPageWrapper from "../../serverPageWrapper";
import { withAuthorization } from "@/lib/utils/axios";

const fetchWithAuthorization = withAuthorization();

const fetchOrderById = cache(async ({ params }: any) => {
  const url = `/orders/${params.id}`;
  const orderData = await fetchWithAuthorization(url);
  return orderData;
});

const Page = async (props: any) => {
  const orderDetails = await fetchOrderById(props);
  return (
    <ServerPageWrapper>
      <OrderDetails orderDetails={orderDetails} />
    </ServerPageWrapper>
  );
};

export default Page;
