"use client";
import React, { useCallback, useState } from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  IndianRupee,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import useSearchFetch from "@/hooks/useSearchFetch";
import useDebounce from "@/hooks/useDebounce";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/Table/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateString } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataTable } from "@/hooks/useDataTable";
import { useSearchParams } from "next/navigation";

type Product = {
  name: string;
  quantity: string;
  price: string;
  img: string;
};

type Order = {
  orderId: string;
  orderDate: string;
  products: Product[];
};

type OrderListProps = {
  orders: Order[];
  fetcher?: (data: any) => {};
};

const OrderList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce search term with 500ms delay
  const [tab, setTab] = useState("ALL");
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const search = Object.fromEntries(searchParams);
  const { data: ordersList, isLoading } = useQuery({
    queryKey: ["orders", debouncedSearchTerm, tab, search.page],
    queryFn: async () => {
      const response = await axiosPrivate.get("/orders", {
        params: {
          search: debouncedSearchTerm,
          status: tab,
          page: search.page,
        },
      });
      return response?.data;
    },
  });
  const { mutate: updateOrderStatus, isPending } = useMutation({
    mutationFn: async ({
      orderItemId,
      newStatus,
    }: {
      orderItemId: string | null;
      newStatus: string;
    }) => {
      await axiosPrivate.post("/orders/update-status", {
        status: newStatus,
        orderItemId,
      });
    },
    onError: (error: any) => {
      const errorData = error.response.data;
      console.log(errorData, "ERRORDAT");
    },
    onSuccess: () => {
      setIsConfirmationOpen(initialState);
      return queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });

  const initialState = {
    isOpen: false,
    orderItemId: null,
    status: "",
  };
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(initialState);

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
        const { order } = row?.original;
        const customerDetails = order?.customerDetails;
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
      id: "orderItem",
      accessorKey: "orderItem",
      header: "Product",
      cell: ({ row }) => {
        const { productName, quantity } = row?.original;
        return (
          <>
            <div className="font-medium">{productName}</div>
            <div className="text-sm text-muted-foreground md:inline">
              x <span>{quantity}</span>
            </div>
          </>
        );
      },
    },
    {
      id: "deliveryStatus",
      accessorKey: "deliveryStatus",
      header: "Status",
      cell: ({ row }: any) => {
        const { deliveryStatus, id } = row?.original;
        const [value, setValue] = useState(deliveryStatus);

        return (
          <Select
            value={value}
            onValueChange={(val) => {
              setIsConfirmationOpen({
                isOpen: true,
                orderItemId: id,
                status: val,
              });
            }}
            disabled={value === "DELIVERED"}
          >
            <SelectTrigger id={`status.${row.id}`} aria-label="Select Status">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {[
                { label: "Pending", value: "PENDING", isDone: false },
                { label: "Shipped", value: "SHIPPED", isDone: false },
                {
                  label: "Delivered",
                  value: "DELIVERED",
                  isDone: false,
                },
              ].map((item: any) => {
                return (
                  <SelectItem key={item.id} value={item?.value}>
                    {item?.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        );
      },
    },

    {
      accessorKey: "date",
      header: () => {
        return <div className="hidden md:table-cell">Date</div>;
      },
      cell: ({ row }) => {
        const { order } = row?.original;
        const createdAt = order?.createdAt;
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
        const { order } = row?.original;
        return (
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href={`/orders/${order?.id}`}>
              <p className="hidden md:flex">View More</p>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        );
      },
    },
  ];

  const handleSearch = useCallback((event: any) => {
    setSearchTerm(event.target.value);
  }, []); // useCallback ensures handleSearch function is stable across renders

  console.log(ordersList, "LIST");

  const { table } = useDataTable({
    data: ordersList?.data,
    columns: columns,
    pageCount: ordersList?.pagination?.pageCount ?? 1,
  });

  return (
    <>
      <Card x-chunk="dashboard-05-chunk-3" className="border-none shadow-none">
        <CardContent className="p-4">
          <Tabs defaultValue={tab} onValueChange={(val) => setTab(val)}>
            <div className="flex items-center p-6">
              <TabsList>
                <TabsTrigger value="ALL">All</TabsTrigger>
                <TabsTrigger value="PENDING">Pending</TabsTrigger>
                <TabsTrigger value="SHIPPED">Shipped</TabsTrigger>
                <TabsTrigger value="DELIVERED">Delivered</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value={tab}>
              <Card className="border-dashed shadow-none">
                <div className="flex flex-col space-y-3 md:flex-row justify-between p-6 px-2 md:px-5">
                  <div
                    x-chunk="dashboard-05-chunk-3"
                    className="flex flex-1 justify-between border-none"
                  >
                    <CardHeader className="p-0">
                      <CardTitle>Orders</CardTitle>
                      <CardDescription>
                        Recent orders from your store.
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
        </CardContent>
      </Card>
      <AlertDialog open={isConfirmationOpen.isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsConfirmationOpen({
                  isOpen: false,
                  orderItemId: null,
                  status: "",
                });
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                updateOrderStatus({
                  orderItemId: isConfirmationOpen.orderItemId,
                  newStatus: isConfirmationOpen.status,
                })
              }
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OrderList;
