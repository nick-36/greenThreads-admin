"use client";
import React from "react";
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
import { categoryValidationSchema } from "@/lib/validation";
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
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Image from "next/image";
import { UploadButton } from "@/lib/utils/uploadthing";

type CategoryCreateSchemaType = z.infer<typeof categoryValidationSchema>;

const CreateCategories = () => {
  const { toast } = useToast();
  const axiosPrivate = useAxiosPrivate();
  const categoryMutation = useMutation({
    mutationFn: async (payload: CategoryCreateSchemaType) => {
      return await axiosPrivate.post("/admin/categories/create", payload);
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
        return response?.data?.data;
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
                      <div className="flex flex-column md:flex-row gap-10 items-center">
                        <UploadButton
                          endpoint="singleImageUploader"
                          onClientUploadComplete={(data: any) => {
                            const fileURL = data?.[0]?.url;
                            field.onChange(fileURL);
                            toast({
                              title: "Uploaded Successfully!",
                            });
                          }}
                          onUploadError={(error: Error) => {
                            console.log(error, "EROR");
                            toast({
                              title: "Something Went Wrong,Try Again!",
                            });
                          }}
                        />
                        {form.getValues("categoryImg") && (
                          <li className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24">
                            <article className="group hasImage w-full h-full rounded-md focus:outline-none focus:shadow-outline cursor-pointer relative text-transparent hover:text-white shadow-sm ">
                              <Image
                                src={form.getValues("categoryImg") || ""}
                                alt={"brandImg"}
                                width={100}
                                height={100}
                                className="img-preview w-full h-full sticky object-contain rounded-md bg-fixed"
                              />

                              <section className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3 hover:bg-black opacity-70 hover:backdrop-blur-md">
                                <div className="flex">
                                  <span className="p-1">
                                    <i>
                                      <svg
                                        className="fill-current w-4 h-4 ml-auto pt-"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M5 8.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5zm9 .5l-2.519 4-2.481-1.96-4 5.96h14l-5-8zm8-4v14h-20v-14h20zm2-2h-24v18h24v-18z"></path>
                                      </svg>
                                    </i>
                                  </span>
                                </div>
                              </section>
                            </article>
                          </li>
                        )}
                      </div>
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
