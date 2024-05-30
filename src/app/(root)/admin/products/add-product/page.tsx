import React from "react";
import ServerPageWrapper from "../../serverPageWrapper";
import MultiStepsForm from "@/components/forms/Products";

const Page = () => {
  return (
    <ServerPageWrapper headerProps={{ headerTitle: "Products" }}>
      <MultiStepsForm />
    </ServerPageWrapper>
  );
};

export default Page;
