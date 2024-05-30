"use client";
import React, { useCallback, useState } from "react";
import { File, IndianRupee, ListFilter, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DataTable } from "@/components/shared/Table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { formatDateString } from "@/lib/utils";
import useDebounce from "@/hooks/useDebounce";
import { useDataTable } from "@/hooks/useDataTable";
import { useSearchParams } from "next/navigation";

const TransactionList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce search term with 500ms delay
  const [selectedDuration, setSelectedDuration] = useState("all");
  const axiosPrivate = useAxiosPrivate();
  const searchParams = useSearchParams();
  const search = Object.fromEntries(searchParams);
  const page = search.page;

  const fetchPayments = async (search: string, page: string) => {
    try {
      const response = await axiosPrivate.get(`/payments`, {
        params: {
          search,
          duration: selectedDuration,
          page,
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
    data = {},
    isLoading: isLoading,
    error,
  } = useQuery({
    queryKey: ["payments", selectedDuration, page, debouncedSearchTerm],
    queryFn: () => fetchPayments(debouncedSearchTerm, page),
  });

  const handleSearch = useCallback((event: any) => {
    setSearchTerm(event.target.value);
  }, []); // useCallback ensures handleSearch function is stable across renders

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
    data: data?.data?.payments,
    columns: columns,
    pageCount: data?.pagination?.pageCount ?? 1,
    // optional props
    defaultPerPage: 10,
  });

  return (
    <div>
      <Tabs
        defaultValue="all"
        value={selectedDuration}
        onValueChange={(val) => {
          setSelectedDuration(val);
        }}
      >
        <div className="flex items-center p-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="weekly">Week</TabsTrigger>
            <TabsTrigger value="monthly">Month</TabsTrigger>
            <TabsTrigger value="yearly">Year</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value={selectedDuration} className="px-6">
          <Card x-chunk="dashboard-05-chunk-3" className="border-dashed">
            <div className="flex flex-col space-y-3 md:flex-row justify-between p-6 px-4 md:px-7">
              <div
                x-chunk="dashboard-05-chunk-3"
                className="flex flex-1 justify-between border-none"
              >
                <CardHeader className="p-0">
                  <CardTitle>Transactions</CardTitle>
                  <CardDescription>
                    Recent transactions from your store.
                  </CardDescription>
                </CardHeader>
              </div>
              <div className="relative md:ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                  onChange={handleSearch}
                  value={searchTerm}
                />
              </div>
            </div>
            <CardContent>
              <DataTable table={table} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransactionList;
