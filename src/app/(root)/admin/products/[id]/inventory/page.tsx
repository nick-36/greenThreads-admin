import ServerPageWrapper from "@/app/(root)/serverPageWrapper";
import CreateUpdateInventory from "@/components/forms/Products/CreateUpdateInvetory";
import axios, { withAuthorization } from "@/lib/utils/axios";
import React, { cache } from "react";

const fetchVariations = cache(async () => {
  try {
    const res = await axios.get("/products/get-variations");
    if (res.data?.success) {
      return res.data;
    }
  } catch (error) {
    console.log(error);
  }
});
const fetchSkuWithAuthorization = withAuthorization();

const Inventory = async (props: any) => {
  const { params } = props;
  const variationDetails = await fetchVariations();
  const skus = await fetchSkuWithAuthorization(`/products/${params.id}/skus`);

  return (
    <ServerPageWrapper>
      <CreateUpdateInventory variationDetails={variationDetails} skus={skus} />
    </ServerPageWrapper>
  );
};

export default Inventory;
