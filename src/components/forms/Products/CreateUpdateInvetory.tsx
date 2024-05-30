"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/shared/Table/Table";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ColumnDef,
  TableMeta,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { variationsValidationSchema } from "@/lib/validation/productValidation";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Icons } from "@/components/ui/icons";
import { useParams } from "next/navigation";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

type variations = {
  sizes: {
    name: string;
    id: string;
  }[];
  colors: {
    name: string;
    id: string;
  }[];
};

interface CreateUpdateInventoryProps {
  isDisabled?: boolean;
  variationDetails?: variations;
  skus?: any;
}

type skusFormData = z.infer<typeof variationsValidationSchema>;

const CreateUpdateInventory: React.FC<CreateUpdateInventoryProps> = ({
  isDisabled = false,
  variationDetails,
  skus,
}) => {
  const { toast } = useToast();
  const params = useParams();
  const axiosPrivate = useAxiosPrivate();
  const form = useForm<skusFormData>({
    defaultValues: {
      skus:
        skus?.length > 0
          ? skus
          : [
              {
                title: "",
                size: {
                  name: "",
                  id: "",
                },
                color: {
                  name: "",
                  id: "",
                },
                availableStock: 0,
              },
            ],
    },
  });
  const { mutate: createUpdateVariations, isPending } = useMutation({
    mutationFn: async (payload: skusFormData) => {
      if (!params.id) {
        toast({
          title: "uh oh!",
          description: "ProductId Missing!",
        });
      }
      return await axiosPrivate.post(
        `/products/${params.id}/skus/addEdit`,
        payload
      );
    },
    onError: (error: any) => {
      const errorData = error.response.data;
      toast({
        title: `Uh oh! ${error?.response?.status ?? "500"} `,
        description: errorData.message || "Something Went Wrong!!",
      });
    },
    onSuccess: () => {
      toast({
        title: "Great!",
        description: "Variations Added Successfully",
      });
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skus",
  });
  const [tableData, setTableData] = useState(() => [...fields]);
  const columns = [
    {
      id: "title",
      accessorKey: "title",
      header: "Title",
      cell: ({ row, table, column }: any) => {
        const formValue = form.getValues(`skus.${row.id}.title`);
        const [value, setValue] = useState("");

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setValue(e.target.value);
        };

        const onBlur = (field: any) => {
          table.options.meta?.updateData(row.index, column.id, value);
          field.onChange(value);
        };

        useEffect(() => {
          setValue(formValue);
        }, [formValue]);

        return (
          <FormField
            name={`skus.${row.id}.title`}
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel htmlFor={`skus.${row.id}.title`} className="sr-only">
                  Title
                </FormLabel>
                <FormControl>
                  <Input
                    id={`skus.${row.id}.title`}
                    onChange={handleChange}
                    defaultValue={formValue}
                    onBlur={() => onBlur(field)}
                    disabled={isDisabled}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        );
      },
    },
    {
      id: "size",
      accessorKey: "size",
      header: "Size",
      cell: ({ row }: any) => {
        const { size } = row.original;
        const formValue = form.getValues(`skus.${row.id}.size.name`);
        const [value, setValue] = useState("");

        useEffect(() => {
          setValue(formValue);
        }, [formValue]);  

        return (
          <FormField
            control={form.control}
            name={`skus.${row.id}.size.name`}
            render={({ field }) => {
              return (
                <FormItem className="col-span-4 md:col-span-1">
                  <FormLabel htmlFor="size" className="sr-only">
                    Variant Type
                  </FormLabel>
                  <FormControl>
                    <Select
                      disabled={size.id}
                      onValueChange={(val) => {
                        const selectedSize = variationDetails?.sizes.find(
                          (item: any) => item.name === val
                        );
                        if (selectedSize) {
                          field.onChange(val);
                          form.setValue(
                            `skus.${row.id}.size.id`,
                            selectedSize.id
                          );
                        }
                      }}
                      {...field}
                    >
                      <SelectTrigger
                        id={`skus.${row.id}.size.name`}
                        aria-label="Select Size"
                      >
                        <SelectValue placeholder="Select Size" />
                      </SelectTrigger>
                      <SelectContent>
                        {variationDetails?.sizes.map((item: any) => {
                          return (
                            <SelectItem key={item.id} value={item?.name}>
                              {item?.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        );
      },
    },
    {
      id: "color",
      accessorKey: "color",
      header: "Color",
      cell: ({ row }: any) => {
        const { color } = row.original;
        const formValue = form.getValues(`skus.${row.id}.color.name`);
        const [value, setValue] = useState("");

        useEffect(() => {
          setValue(formValue);
        }, [formValue]);

        return (
          <FormField
            control={form.control}
            name={`skus.${row.id}.color.name`}
            render={({ field }) => {
              return (
                <FormItem className="col-span-4 md:col-span-1">
                  <FormLabel htmlFor="color" className="sr-only">
                    Color
                  </FormLabel>
                  <FormControl>
                    <Select
                      disabled={color.id}
                      onValueChange={(val) => {
                        const selectedColor = variationDetails?.colors.find(
                          (item: any) => item.name === val
                        );
                        if (selectedColor) {
                          field.onChange(val);
                          form.setValue(
                            `skus.${row.id}.color.id`,
                            selectedColor.id
                          );
                        }
                      }}
                      {...field}
                    >
                      <SelectTrigger
                        id={`skus.${row.id}.color.name`}
                        aria-label="Select Color"
                      >
                        <SelectValue placeholder="Select Color" />
                      </SelectTrigger>
                      <SelectContent>
                        {variationDetails?.colors?.map((item, idx: number) => {
                          return (
                            <SelectItem key={idx} value={item?.name}>
                              {item?.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        );
      },
    },
    {
      id: "stock",
      accessorKey: "availableStock",
      header: "Stock",
      cell: ({ row, table, column }: any) => {
        const formValue = form.getValues(`skus.${row.id}.availableStock`);
        const [value, setValue] = useState(0);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setValue(Number(e.target.value));
        };

        const onBlur = (field: any) => {
          table.options.meta?.updateData(row.index, column.id, value);
          field.onChange(value);
        };

        useEffect(() => {
          setValue(formValue);
        }, [formValue]);

        return (
          <FormField
            name={`skus.${row.id}.availableStock`}
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-1 md:max-w-28">
                <FormLabel
                  htmlFor={`skus.${row.id}.availableStock`}
                  className="sr-only"
                >
                  stock
                </FormLabel>
                <FormControl>
                  <Input
                    id={`skus.${row.id}.availableStock`}
                    type="number"
                    onChange={handleChange}
                    defaultValue={formValue}
                    onBlur={() => onBlur(field)}
                    disabled={isDisabled}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        );
      },
    },
    {
      id: "action",
      accessorKey: "action",
      header: "Action",
      cell: ({ row }: any) => {
        const { size, color } = row.original;
        return (
          <Button
            type="button"
            variant={"ghost"}
            disabled={size.id || color.id}
            onClick={() => {
              if (size.id || color.id) {
                toast({
                  title: "uh ho",
                  description: "existing variation can not be updated!",
                });
              } else {
                handleRemoveRow(row.index);
              }
            }}
          >
            <Trash2 />
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: any) => {
        setTableData((old) => {
          return old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          });
        });
      },
    },
  });

  const handleAppendRow = () => {
    const newRow = {
      title: "",
      size: {
        name: "",
        id: "",
      },
      color: {
        name: "",
        id: "",
      },
      availableStock: 0,
    };
    const setFunc = (old: any[]) => [...old, newRow];
    setTableData(setFunc);
    append(newRow);
  };

  const handleRemoveRow = (rowIndex: number) => {
    if (rowIndex == 0) return;
    const setFilterFunc = (old: any[]) =>
      old.filter((_row: any, index: number) => index !== rowIndex);
    setTableData(setFilterFunc);
    remove(rowIndex);
  };

  const onFormSubmit = (data: skusFormData) => {
    console.log(data, "FORMDAT");
    createUpdateVariations(data);
  };

  console.log(form.getValues(), "VALUES");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onFormSubmit)}
        className="overflow-x-hidden h-full"
      >
        <div className="p-4">
          <Card x-chunk="dashboard-05-chunk-3" className="border-dashed">
            <CardContent>
              <div className="flex flex-col space-y-3 md:flex-row justify-between p-6 px-2 md:px-5">
                <div
                  x-chunk="dashboard-05-chunk-3"
                  className="flex flex-1 justify-between border-none"
                >
                  <CardHeader className="p-0">
                    <CardTitle>Variations</CardTitle>
                    <CardDescription>Add Variants To Product</CardDescription>
                  </CardHeader>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Button type="submit" disabled={isPending}>
                    {isPending && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} className="md:table-cell">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="sm:table-cell">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex items-center justify-end p-4 w-full">
                <Button
                  type="button"
                  size="sm"
                  className="h-8 gap-1"
                  onClick={handleAppendRow}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Variant
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
};

export default CreateUpdateInventory;
