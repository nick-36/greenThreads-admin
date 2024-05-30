"use client";
import React, { ChangeEvent, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryValidationSchema } from "@/lib/validation/productValidation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDown } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Icons } from "../ui/icons";
import { z } from "zod";
import { useRouter } from "next/navigation";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

type CategoryCreateSchemaType = z.infer<typeof categoryValidationSchema>;

const CreateCategories = () => {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const axiosPrivate = useAxiosPrivate();
  const categoryMutation = useMutation({
    mutationFn: async (payload: CategoryCreateSchemaType) => {
      return await axiosPrivate.post("/categories", payload);
    },
    onError: (error: any) => {
      const errorData = error.response.data;
      toast({
        title: `Uh oh! ${error?.response?.status ?? "500"} `,
        description: errorData.message || "Something Went Wrong!!",
      });
    },
    onSuccess: () => {
      form.reset();
      toast({
        title: "Great!",
        description: "Category Created Successfully",
      });
    },
  });
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories", categoryMutation.isSuccess],
    queryFn: async () => {
      try {
        const response = await axiosPrivate.get("/categories");
        return response?.data?.categories;
      } catch (error: any) {
        toast({
          title: `Uh oh! `,
          description: error.message || "Something Went Wrong!!",
        });
      }
    },
  });

  const form = useForm<CategoryCreateSchemaType>({
    resolver: zodResolver(categoryValidationSchema),
    defaultValues: {
      name: "",
      description: "",
      parentId: null,
      categoryImg: null,
    },
  });

  const onFormSubmit: SubmitHandler<CategoryCreateSchemaType> = (data) => {
    categoryMutation.mutate(data);
  };

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();
    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };
      fileReader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <Card x-chunk="dashboard-05-chunk-3" className="border-dashed m-6">
        <CardContent className="p-4">
          <form
            className={cn("grid w-full items-start gap-6 md:pt-0")}
            onSubmit={form.handleSubmit(onFormSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              rules={{
                required: true,
              }}
              render={({ field }) => {
                return (
                  <FormItem className="grid gap-2">
                    <FormLabel aria-required>Category Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g.men.." {...field} />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="" {...field} />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Parent Category</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "sm:auto md:w-96 justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isLoading}
                        >
                          {field.value
                            ? categories.find(
                                (cat: any) => cat.id === field.value
                              )?.name
                            : "Select Category"}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="sm:auto md:w-96  p-0">
                      <Command>
                        <CommandInput placeholder="Search Categoy..." />
                        <CommandList>
                          <CommandEmpty>No Category found.</CommandEmpty>
                          <CommandGroup>
                            {categories.map((cat: any) => (
                              <CommandItem
                                value={cat.id}
                                key={cat.id}
                                onSelect={() => {
                                  form.setValue("parentId", cat?.id);
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    cat.value === field.value
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
                  <FormDescription className="text-xs">
                    Add only if you want to create as a sub-category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryImg"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Select Category Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e: any) => handleImage(e, field.onChange)}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <Button
              type="submit"
              className="w-40 m-auto my-6"
              disabled={categoryMutation.isPending}
            >
              {categoryMutation.isPending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
};

export default CreateCategories;
