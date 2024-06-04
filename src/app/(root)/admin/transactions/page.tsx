import React from "react";
import ServerPageWrapper from "@/app/(root)/serverPageWrapper";
import TransactionListClient from "./transactions-client";
const page = () => {
  return (
    <ServerPageWrapper headerProps={{ headerTitle: "Revenue" }}>
      <TransactionListClient />
    </ServerPageWrapper>
  );
};

export default page;
