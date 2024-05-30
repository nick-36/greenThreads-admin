import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { Category } from "@/lib/utils/types/CategoryType";
import { useFormContext } from "react-hook-form";
import { Icons } from "@/components/ui/icons";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";


const ProductCategoryInfo = ({ isFormDisabled = false }: any) => {
  const form = useFormContext();
  const axiosPrivate = useAxiosPrivate();

  const fetchCategoryByParentId = async (parentId: string) => {
    try {
      const response = await axiosPrivate.get(`/subcategories/${parentId}`);
      return response?.data;
    } catch (error) {
      toast({
        title: `Uh oh! `,
        description: "Failed To Fetch Categories!!",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosPrivate.get("/categories");
      return response?.data.categories;
    } catch (error: any) {
      toast({
        title: `Uh oh! `,
        description: "Failed To Fetch Categories!!",
      });
    }
  };
  const { data: categories = [], isLoading: isLoadingCat } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const watchCategoryId = form.watch("categoryId")?.id;
  const wathcSubCategoryId = form.watch("subCategoryId")?.id;
  const { data: subCategories = [], isLoading: isLoadingSubCat } = useQuery({
    queryKey: ["subCategories", watchCategoryId],
    queryFn: () => fetchCategoryByParentId(watchCategoryId),
    enabled: !!watchCategoryId,
  });
  const { data: subSubCategories = [], isLoading: isLoadingSubSubCat } =
    useQuery({
      queryKey: ["subSubCategories", wathcSubCategoryId],
      queryFn: () => fetchCategoryByParentId(wathcSubCategoryId),
      enabled: !!wathcSubCategoryId,
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-1 md:grid-cols-3  gap-4">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Category</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "sm:w-full md:w-[200px] justify-between",
                            !field.value.id && "text-muted-foreground"
                          )}
                          disabled={!categories.length || isFormDisabled}
                        >
                          {isLoadingCat && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {field.value?.id
                            ? categories.find(
                                (cat: Category) => cat.id === field.value?.id
                              )?.name
                            : "Select Category"}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="sm:w-full md:w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search Category..." />
                        <CommandList>
                          <CommandEmpty>No Category found.</CommandEmpty>
                          <CommandGroup>
                            {categories?.map((cat: Category) => (
                              <CommandItem
                                value={cat.id}
                                key={cat.id}
                                onSelect={() => {
                                  form.resetField("subCategoryId", {
                                    defaultValue: {
                                      id: null,
                                      name: "",
                                    },
                                  });
                                  form.resetField("subSubCategoryId", {
                                    defaultValue: {
                                      id: null,
                                      name: "",
                                    },
                                  });
                                  form.setValue("categoryId", {
                                    id: cat.id,
                                    name: cat?.name,
                                  });
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    cat.id === field.value?.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {cat.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="subCategoryId"
              render={({ field }) => {
                console.log(field, "FIElD");
                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>Sub Category</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "sm:w-full md:w-[200px] justify-between",
                              !field.value?.id && "text-muted-foreground"
                            )}
                            disabled={!categories.length || isFormDisabled}
                          >
                            {isLoadingCat && (
                              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {field.value?.id
                              ? subCategories.find(
                                  (subCat: Category) =>
                                    subCat.id === field.value?.id
                                )?.name
                              : "Select Category"}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="sm:w-full md:w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search Category..." />
                          <CommandEmpty>No Sub Category found.</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {subCategories.map((subCat: Category) => (
                                <CommandItem
                                  value={subCat.id}
                                  key={subCat.id}
                                  onSelect={() => {
                                    form.resetField("subSubCategoryId", {
                                      defaultValue: {
                                        id: null,
                                        name: "",
                                      },
                                    });
                                    form.setValue("subCategoryId", {
                                      id: subCat.id,
                                      name: subCat.name,
                                    });
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      subCat.id === field.value?.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {subCat.name}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="subSubCategoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Sub Sub Category</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "sm:w-full md:w-[200px] justify-between",
                            !field.value?.id && "text-muted-foreground"
                          )}
                          disabled={!categories.length || isFormDisabled}
                        >
                          {isLoadingCat && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {field.value?.id
                            ? subSubCategories.find(
                                (cat: Category) => cat.id === field.value?.id
                              )?.name
                            : "Select Category"}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="sm:w-full md:w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search Category..." />
                        <CommandEmpty>No Sub Sub Category found.</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {subSubCategories.map((cat: Category) => (
                              <CommandItem
                                value={cat.id}
                                key={cat.id}
                                onSelect={() => {
                                  form.setValue("subSubCategoryId", {
                                    id: cat.id,
                                    name: cat?.name,
                                  });
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    cat.id === field.value?.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {cat.name}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCategoryInfo;
