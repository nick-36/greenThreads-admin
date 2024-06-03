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
import { useDataTable } from "@/hooks/useDataTable";

const SellerListClient = ({ data }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce search term with 500ms delay
  const axiosPrivate = useAxiosPrivate();
  const searchParams = useSearchParams();
  const search = Object.fromEntries(searchParams);
  const router = useRouter();
  const pathname = usePathname();

  const fetchSellers = async (search: string, searchParam: any) => {
    try {
      const { page, from, to } = searchParam;
      const response = await axiosPrivate.get(`/admin/sellers/get-all`, {
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
    data: sellersData = {},
    isLoading: isLoading,
    error,
  } = useQuery({
    queryKey: ["sellers", search],
    queryFn: () => fetchSellers(debouncedSearchTerm, searchParams),
    initialData: data,
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

  const { table } = useDataTable({
    data: sellersData?.data,
    columns: columns,
    pageCount: sellersData?.pagination?.pageCount,
  });

  return (
    <CommonList
      table={table}
      title={"Sellers"}
      subTitle="All the Sellers of your platform"
      searchState={searchTerm}
      handleSearch={handleSearch}
      isLoading={isLoading}
    />
  );
};

export default SellerListClient;
