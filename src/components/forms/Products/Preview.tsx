"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, MoveUpRight, Upload } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/shared/Table";
import ProductCombinations from "./ProductCombinations";
import { useFormContext } from "react-hook-form";
import Link from "next/link";
import { useParams } from "next/navigation";

const categoriesColums: ColumnDef<any>[] = [
  {
    id: "category",
    accessorKey: "category",
    header: "Category",
    cell: ({ row }: any) => {
      const { category } = row?.original;
      const name = category?.name || "-";
      return <span>{name}</span>;
    },
  },
  {
    id: "subCategory",
    accessorKey: "subCategory",
    header: "Sub Category",
    cell: ({ row }: any) => {
      const { subCategory } = row?.original;
      const name = subCategory?.name || "-";
      return <span>{name}</span>;
    },
  },
  {
    id: "subSubCategory",
    accessorKey: "subSubCategory",
    header: "Sub Sub Category",
    cell: ({ row }: any) => {
      const { subSubCategory } = row?.original;
      const name = subSubCategory?.name || "-";
      return <span>{name}</span>;
    },
  },
];

const Preview = ({ onSave, onDiscard }: any) => {
  const form = useFormContext();
  const params = useParams();

  console.log("formState", form.getValues());

  const categoriesData = [
    {
      category: form.getValues("categoryId"),
      subCategory: form.getValues("subCategoryId"),
      subSubCategory: form.getValues("subSubCategoryId"),
    },
  ];

  return (
    <Card
      x-chunk="dashboard-06-chunk-0 "
      className="border-none shadow-none md:p-6"
    >
      <div>
        <div className="grid flex-1 md:p-4 items-start gap-4  sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-24">
              {/* <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button> */}
              <div className="flex-1 grid grid-cols-3">
                <div className="flex gap-2 md:gap-4 col-span-2">
                  <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    Pro Controller
                  </h1>
                  <Badge variant="outline" className="ml-auto sm:ml-0">
                    In stock
                  </Badge>
                </div>
                {params.id && (
                  <Link
                    prefetch={false}
                    href={`/products/${params.id}/inventory`}
                    className="text-end"
                  >
                    <Button size="sm" className="h-8 gap-1">
                      <span className="sm:not-sr-only sm:whitespace-nowrap">
                        Inventory
                      </span>
                      <MoveUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                )}
              </div>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button
                  type="button"
                  onClick={onDiscard}
                  variant="outline"
                  size="sm"
                >
                  Discard
                </Button>
                <Button type="button" size="sm" onClick={onSave}>
                  Save Product
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>
                      Vital Product Informations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="grid col-span-2 gap-3">
                        <FormField
                          control={form.control}
                          name="productName"
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormLabel htmlFor="name">Name</FormLabel>
                                <FormControl>
                                  <Input
                                    id="name"
                                    type="text"
                                    className="w-full"
                                    disabled={true}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        ></FormField>
                      </div>

                      <div className="grid col-span-2 md:col-span-1 gap-3">
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormLabel htmlFor="description">
                                  Description
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    id="description"
                                    className="min-h-32"
                                    disabled={true}
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                      <div className="grid col-span-2  md:col-span-1 gap-3">
                        <FormField
                          control={form.control}
                          name="retailPrice"
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormLabel htmlFor="name">
                                  Retail Price
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    id="retailPrice"
                                    type="number"
                                    className="w-full"
                                    disabled={true}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        ></FormField>
                      </div>
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="discountPercentage"
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormLabel htmlFor="discountPercentage">
                                  Discount Percentage(%)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    id="discountPercentage"
                                    type="number"
                                    className="w-full"
                                    disabled={true}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        ></FormField>
                      </div>
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="discountedPrice"
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormLabel htmlFor="discountedPrice">
                                  Discounted Price
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    id="discountedPrice"
                                    type="number"
                                    className="w-full"
                                    disabled
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        ></FormField>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="overflow-x-hidden">
                  <CardHeader>
                    <CardTitle>Product Category</CardTitle>
                  </CardHeader>
                  <CardContent className="h-full flex-1 flex-col md:flex">
                    <DataTable
                      columns={categoriesColums}
                      data={categoriesData}
                      showPagination={false}
                    />
                  </CardContent>
                </Card>
                {form.getValues("combinations")?.length > 0 && (
                  <Card
                    x-chunk="dashboard-07-chunk-1"
                    className="overflow-x-hidden"
                  >
                    <CardHeader>
                      <CardTitle>Variations</CardTitle>
                      <CardDescription>
                        Configure Products Variations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-full flex-1 flex-col md:flex p-4">
                      <ProductCombinations isDisabled={true} />
                    </CardContent>
                  </Card>
                )}
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                {/* PRODUCT STATUS */}
                <Card x-chunk="dashboard-07-chunk-3">
                  <CardHeader>
                    <CardTitle>Product Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormLabel htmlFor="status">Status</FormLabel>
                                <FormControl>
                                  <Tabs
                                    {...field}
                                    onValueChange={(val) => {
                                      form.setValue("status", val);
                                    }}
                                  >
                                    <TabsList>
                                      <TabsTrigger
                                        className="data-[state=active]:bg-cyan-400	 data-[state=active]:text-white"
                                        value="active"
                                      >
                                        Active
                                      </TabsTrigger>
                                      <TabsTrigger
                                        className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                                        value="inactive"
                                      >
                                        Inactive
                                      </TabsTrigger>
                                    </TabsList>
                                  </Tabs>
                                </FormControl>
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* PRODUCT IMAGES */}
                <Card
                  className="overflow-hidden"
                  x-chunk="dashboard-07-chunk-4"
                >
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                    <CardDescription>Images of Products</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <Image
                        alt="Product image"
                        className="aspect-square w-full rounded-md object-cover"
                        height="300"
                        src={
                          form.getValues("productImages")?.[0]?.url ??
                          "/assets/placeholder.svg"
                        }
                        width="300"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <button>
                          <Image
                            alt="Product image"
                            className="aspect-square w-full rounded-md object-cover"
                            height="84"
                            src={
                              form.getValues("productImages")?.[1]?.url ??
                              "/assets/placeholder.svg"
                            }
                            width="84"
                          />
                        </button>
                        <button>
                          <Image
                            alt="Product image"
                            className="aspect-square w-full rounded-md object-cover"
                            height="84"
                            src={
                              form.getValues("productImages")?.[2]?.url ??
                              "/assets/placeholder.svg"
                            }
                            width="84"
                          />
                        </button>
                        <button>
                          <Image
                            alt="Product image"
                            className="aspect-square w-full rounded-md object-cover"
                            height="84"
                            src={
                              form.getValues("productImages")?.[3]?.url ??
                              "/assets/placeholder.svg"
                            }
                            width="84"
                          />
                        </button>
                        <button>
                          <Image
                            alt="Product image"
                            className="aspect-square w-full rounded-md object-cover"
                            height="84"
                            src={
                              form.getValues("productImages")?.[4]?.url ??
                              "/assets/placeholder.svg"
                            }
                            width="84"
                          />
                        </button>
                        {/* <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                          <Upload className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Upload</span>
                        </button> */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex items-center justify-center gap-2 md:hidden">
                <Button variant="outline" size="sm" onClick={onDiscard}>
                  Discard
                </Button>
                <Button size="sm" type="button" onClick={onSave}>
                  Save Product
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Preview;
