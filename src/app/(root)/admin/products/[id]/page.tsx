import React from "react";
import ServerPageWrapper from "../../serverPageWrapper";
import MultiStepsForm from "@/components/forms/Products";
import { withAuthorization } from "@/lib/utils/axios";

const fetchWithAuthorization = withAuthorization();
const fetchProductById = async ({ params }: any) => {
  const url = `/products/${params.id}`;
  const data = await fetchWithAuthorization(url);
  return data;
};

const Page = async (params: any) => {
  const productDetails = await fetchProductById(params);
  return (
    <ServerPageWrapper headerProps={{ headerTitle: "Orders" }}>
      <MultiStepsForm product={productDetails} />
    </ServerPageWrapper>
  );
};

export default Page;
