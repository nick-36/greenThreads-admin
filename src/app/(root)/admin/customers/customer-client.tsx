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
import { SearchParamsSchema } from "@/lib/validation";
import { useDataTable } from "@/hooks/useDataTable";

const SellerListClient = (props: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce search term with 500ms delay
  const axiosPrivate = useAxiosPrivate();
  const searchParams = useSearchParams();
  const searchObj = Object.fromEntries(searchParams);
  const router = useRouter();
  const pathname = usePathname();

  const fetchCustomers = async () => {
    try {
      const { page, from, to, search } = searchObj;
      const response = await axiosPrivate.get(`/admin/customers/get-all`, {
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
    data: customersData = {},
    isLoading: isLoading,
    error,
  } = useQuery({
    queryKey: ["customers", searchObj],
    queryFn: () => fetchCustomers(),
  });

  const columns: ColumnDef<any>[] = [
    {
      id: "fullName",
      accessorKey: "fullName",
      header: "Name",
      cell: ({ row }) => {
        const { fullName, user } = row?.original;

        return (
          <>
            <div className="font-medium">{fullName}</div>
            <div className="text-sm text-muted-foreground md:inline">
              {user?.email}
            </div>
          </>
        );
      },
    },
    {
      id: "username",
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => {
        const { user } = row?.original;
        return (
          <>
            <div className="sm:table-cell">{user?.username || "-"}</div>
          </>
        );
      },
    },
    {
      id: "phoneNumber",
      accessorKey: "phoneNumber",
      header: "Mobile",
      cell: ({ row }) => {
        const { user } = row?.original;
        return <div className="font-medium">{user?.phoneNumber}</div>;
      },
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const { user } = row?.original;
        const formattedDate = formatDateString(user.createdAt);
        return <div className="md:table-cell">{formattedDate}</div>;
      },
    },
  ];

  const { table } = useDataTable({
    data: customersData?.data,
    columns: columns,
    pageCount: customersData?.pagination?.pageCount,
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
  }, [debouncedSearchTerm]);

  return (
    <CommonList
      table={table}
      title={"Customers"}
      subTitle="All the customers of your platform"
      searchState={searchTerm}
      handleSearch={handleSearch}
      isLoading={isLoading}
    />
  );
};

export default SellerListClient;
