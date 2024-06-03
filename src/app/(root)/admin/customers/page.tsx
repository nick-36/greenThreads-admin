import React, { Suspense } from "react";
import CustomerListClient from "./customer-client";
import { getSellerList } from "@/lib/actions/products";
import { searchParamsSchema } from "@/lib/validation";
import ServerPageWrapper from "@/app/(root)/serverPageWrapper";
import { DataTableSkeleton } from "@/components/shared/Table/data-table-skeleton";

const CustomersList = async () => {
  return (
    <ServerPageWrapper>
      <Suspense
        fallback={
          <DataTableSkeleton
            columnCount={5}
            searchableColumnCount={1}
            filterableColumnCount={2}
            cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
          />
        }
      >
        <CustomerListClient />
      </Suspense>
    </ServerPageWrapper>
  );
};

export default CustomersList;
