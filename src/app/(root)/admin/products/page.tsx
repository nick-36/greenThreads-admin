
import ServerPageWrapper from "../serverPageWrapper";
import ProductListClient from "./productListClient";

const Page = async () => {
  return (
    <ServerPageWrapper headerProps={{ headerTitle: "Products" }}>
      <ProductListClient />
    </ServerPageWrapper>
  );
};

export default Page;
