"use client";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import CommonList from "@/components/shared/Listing/common-list";
import { formatDateString } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "@/hooks/useDebounce";
import { ArrowUpRight, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useDataTable } from "@/hooks/useDataTable";

const OrdersListClient = (props: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce search term with 500ms delay
  const axiosPrivate = useAxiosPrivate();
  const searchParams = useSearchParams();
  const searchObj = Object.fromEntries(searchParams);
  const router = useRouter();
  const pathname = usePathname();
  const [tab, setTab] = useState<string>("ALL");

  const fetchOrders = async (tab: string) => {
    try {
      const { page, from, to, search } = searchObj;
      const response = await axiosPrivate.get(`/admin/orders/get-all`, {
        params: {
          search,
          page,
          from,
          to,
          status: tab,
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
    data: ordersData = {},
    isLoading: isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", searchObj, tab],
    queryFn: () => fetchOrders(tab),
  });

  const columns: ColumnDef<any>[] = [
    // {
    //   id: "select",
    //   header: ({ table }) => {
    //     return (
    //       <Checkbox
    //         checked={
    //           table.getIsAllPageRowsSelected() ||
    //           (table.getIsSomePageRowsSelected() && "indeterminate")
    //         }
    //         onCheckedChange={(value) =>
    //           table.toggleAllPageRowsSelected(!!value)
    //         }
    //         aria-label="Select all"
    //       />
    //     );
    //   },
    //   cell: ({ row }) => {
    //     return (
    //       <Checkbox
    //         checked={row.getIsSelected()}
    //         onCheckedChange={(value) => row.toggleSelected(!!value)}
    //         aria-label="Select row"
    //       />
    //     );
    //   },
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      id: "name",
      accessorKey: "name",
      header: "Customer",
      cell: ({ row }) => {
        const { customerDetails } = row?.original;
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
    // {
    //   id: "orderItem",
    //   accessorKey: "orderItem",
    //   header: "Product",
    //   cell: ({ row }) => {
    //     const { productName, quantity } = row?.original;
    //     return (
    //       <>
    //         <div className="font-medium">{productName}</div>
    //         <div className="text-sm text-muted-foreground md:inline">
    //           x <span>{quantity}</span>
    //         </div>
    //       </>
    //     );
    //   },
    // },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const { status, id } = row?.original;
        return <p>{status}</p>;
      },
    },

    {
      accessorKey: "date",
      header: () => {
        return <div className="hidden md:table-cell">Date</div>;
      },
      cell: ({ row }) => {
        const { createdAt } = row?.original;
        const formattedDate = createdAt && formatDateString(createdAt);
        return <div className="hidden md:table-cell">{formattedDate}</div>;
      },
    },

    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const { amountTotal } = row?.original;
        return (
          <div className="text-center flex items-center">
            <IndianRupee className="h-3 w-3" />
            <p>{amountTotal}</p>
          </div>
        );
      },
    },
    {
      id: "more",
      accessorKey: "more",
      header: "Details",
      cell: ({ row }) => {
        const { id } = row?.original;
        return (
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href={`/admin/orders/${id}`}>
              <p className="hidden md:flex">View More</p>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        );
      },
    },
  ];

  const { table } = useDataTable({
    data: ordersData?.data,
    columns: columns,
    pageCount: ordersData?.pagination?.pageCount,
  });

  const handleSearch = useCallback((event: any) => {
    setSearchTerm(event.target.value);
  }, []); // useCallback ensures handleSearch function is stable across renders

  const handleTabChange = useCallback((val: string) => {
    setTab(val);
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

  const tabsList = [
    {
      label: "All",
      value: "ALL",
    },
    {
      label: "In Progress",
      value: "IN_PROGRESS",
    },
    {
      label: "FulFilled",
      value: "FULFILLED",
    },
  ];

  return (
    <CommonList
      table={table}
      title={"Orders"}
      subTitle="Recent orders from your store."
      searchState={searchTerm}
      handleSearch={handleSearch}
      tabState={tab}
      handleTabChange={handleTabChange}
      isLoading={isLoading}
      tabsList={tabsList}
      showDateRange={true}
    />
  );
};

export default OrdersListClient;
