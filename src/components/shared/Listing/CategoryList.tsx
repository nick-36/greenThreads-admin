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
import DataTable from "../Table/Table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Category } from "@/lib/utils/types/CategoryType";

type CategoryListProps = {
  categories: Category[];
};

const CategoryList = ({ categories }: CategoryListProps) => {
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
      id: "categoryImg",
      accessorKey: "categoryImg",
      header: "Image",
      cell: ({ row }) => {
        const { categoryImg } = row?.original;

        return (
          <div className="sm:table-cell">
            <Image
              src={categoryImg ?? "/assets/placeholder.svg"}
              width={24}
              height={24}
              alt="category icon"
              className="rounded-sm"
            />
          </div>
        );
      },
    },
  ];
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
                <CardTitle>Categories</CardTitle>
                <CardDescription>All Categories</CardDescription>
              </CardHeader>
            </div>
            <div className="relative md:ml-auto flex-1 md:grow-0">
              <Link href="/categories/create">
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Create
                  </span>
                </Button>
              </Link>
            </div>
          </div>
          <Card className="border-dashed">
            <DataTable columns={columns} data={categories} />
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryList;
