"use client";
import React, { useCallback, useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import CommonList from "@/components/shared/Listing/common-list";
import { formatDateString } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "@/hooks/useDebounce";
import { IndianRupee } from "lucide-react";
import { useDataTable } from "@/hooks/useDataTable";
import { Badge } from "@/components/ui/badge";

const TransactionList = (props: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce search term with 500ms delay
  const axiosPrivate = useAxiosPrivate();
  const searchParams = useSearchParams();
  const searchObj = Object.fromEntries(searchParams);
  const router = useRouter();
  const pathname = usePathname();
  const [tab, setTab] = useState<string>("ALL");

  const fetchPayments = async () => {
    try {
      const { page, from, to, search } = searchObj;
      const response = await axiosPrivate.get(`/admin/payments/get-all`, {
        params: {
          search,
          page,
          from,
          to,
        },
      });
      return response?.data;
    } catch (error: any) {
      const errMsg = error?.response?.data?.message ?? "Failed To Fetch Data!!";
      console.log(error, "ERROR");
      toast({
        title: `Uh oh! `,
        description: errMsg,
      });
    }
  };
  const {
    data: paymentsData = {},
    isLoading: isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", searchObj, tab],
    queryFn: () => fetchPayments(),
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Customer",
      cell: ({ row }) => {
        const { orderItem } = row?.original;
        const customerDetails = orderItem.order.customerDetails;
        return (
          <>
            <div className="font-medium">{customerDetails?.name}</div>
            <div className="text-sm text-muted-foreground md:inline">
              {customerDetails?.email}
            </div>
          </>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const { status } = row?.original;

        return (
          <div className="sm:table-cell">
            <Badge className="text-xs" variant="secondary">
              {status}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const { date } = row?.original;
        const formattedDate = formatDateString(date);
        return <div className="md:table-cell">{formattedDate}</div>;
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const { amount } = row?.original;
        return (
          <div className="text-center md:table-cell">
            <span className="flex items-center">
              <IndianRupee className="h-3 w-3" />
              <span>{amount}</span>
            </span>
          </div>
        );
      },
    },
  ];

  const { table } = useDataTable({
    data: paymentsData?.data?.payments,
    columns: columns,
    pageCount: paymentsData?.pagination?.pageCount,
  });

  const handleSearch = useCallback((event: any) => {
    setSearchTerm(event.target.value);
  }, []); // useCallback ensures handleSearch function is stable across renders

  // Create query string
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    // Initialize new params
    const newParamsObject: any = {
      page: 1,
    };

    Object.assign(newParamsObject, {
      search: debouncedSearchTerm,
    });
    router.push(`${pathname}?${createQueryString(newParamsObject)}`);
    table.setPageIndex(0);
  }, [debouncedSearchTerm, tab, searchObj.from, searchObj.to]);

  return (
    <CommonList
      table={table}
      title={"Transaction"}
      subTitle="Recent transactions from your store."
      searchState={searchTerm}
      handleSearch={handleSearch}
      isLoading={isLoading}
      showDateRange={true}
    />
  );
};

export default TransactionList;
