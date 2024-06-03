"use client";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/shared/Table/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Category } from "@/lib/utils/types/CategoryType";
import { useDataTable } from "@/hooks/useDataTable";

type BrandListProps = {
  brands: Brand[];
};

type Brand = {
  name: string;
  description: string;
  media: string;
};

const BrandList = ({ brands }: BrandListProps) => {
  const columns: ColumnDef<any>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const { name } = row?.original;
        return <div className="font-medium">{name}</div>;
      },
    },
    {
      id: "description",
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const { description } = row?.original;
        return (
          <>
            <div className="sm:table-cell">{description || "-"}</div>
          </>
        );
      },
    },
    {
      id: "media",
      accessorKey: "media",
      header: "Image",
      cell: ({ row }) => {
        const { media } = row?.original;
        const imgSrc = media ?? "/assets/placeholder.svg";

        return (
          <div className="sm:table-cell">
            <Image
              src={imgSrc}
              width={24}
              height={24}
              alt="brand icon"
              className="rounded-sm"
            />
          </div>
        );
      },
    },
  ];

  const { table } = useDataTable({
    data: brands,
    columns: columns,
    pageCount: 0,
  });

  return (
    <div>
      <Card x-chunk="dashboard-05-chunk-3" className="border-none shadow-none">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-3 md:flex-row justify-between p-6 px-2 md:px-5">
            <div
              x-chunk="dashboard-05-chunk-3"
              className="flex flex-1 justify-between border-none"
            >
              <CardHeader className="p-0">
                <CardTitle>Brands</CardTitle>
                <CardDescription>All Brand List</CardDescription>
              </CardHeader>
            </div>
          </div>
          <DataTable table={table} />
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandList;
