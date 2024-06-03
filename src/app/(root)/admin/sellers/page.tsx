import React, { Suspense } from "react";
import SellerListClient from "./sellers-client";
import { getSellerList } from "@/lib/actions/products";
import { searchParamsSchema } from "@/lib/validation";
import ServerPageWrapper from "@/app/(root)/serverPageWrapper";
import { DataTableSkeleton } from "@/components/shared/Table/data-table-skeleton";
import { SearchParams } from "@/lib/utils/types/common";

export interface IndexPageProps {
  searchParams: SearchParams;
}

const SellersList = async ({ searchParams }: IndexPageProps) => {
  const search = searchParamsSchema.parse(searchParams);

  const sellersData = await getSellerList(search);

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
        <SellerListClient data={sellersData} />
      </Suspense>
    </ServerPageWrapper>
  );
};

export default SellersList;
