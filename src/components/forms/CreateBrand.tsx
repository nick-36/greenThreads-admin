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
import { brandValidationSchema } from "@/lib/validation/productValidation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Icons } from "../ui/icons";
import { z } from "zod";
import { UploadButton } from "@/lib/utils/uploadthing";
import Image from "next/image";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

type BrandCreateSchemaType = z.infer<typeof brandValidationSchema>;

const CreateBrand = ({ brandInfo }: any) => {
  const { toast } = useToast();
  const axiosPrivate = useAxiosPrivate();
  const brandMutation = useMutation({
    mutationFn: async (payload: BrandCreateSchemaType) => {
      return await axiosPrivate.post("/brand", payload);
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
        description: brandInfo?.id
          ? "Brand Updated Successfully"
          : "Brand Created Successfully",
      });
    },
  });

  const form = useForm<BrandCreateSchemaType>({
    resolver: zodResolver(brandValidationSchema),
    defaultValues: {
      name: brandInfo?.name ?? "",
      description: brandInfo.description ?? "",
      brandImg: brandInfo.media as string,
    },
  });

  const onFormSubmit: SubmitHandler<BrandCreateSchemaType> = (data) => {
    if (brandInfo?.id) {
      data.id = brandInfo.id;
    }
    brandMutation.mutate(data);
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
                    <FormLabel aria-required>Brand Name</FormLabel>
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
              name="brandImg"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Select Brand Image</FormLabel>
                    <FormControl>
                      <div className="flex flex-column md:flex-row gap-10 items-center">
                        <UploadButton
                          className="flex items-start"
                          endpoint="singleImageUploader"
                          onClientUploadComplete={(data: any) => {
                            const fileURL = data?.[0]?.url;
                            field.onChange(fileURL);
                            toast({
                              title: "Uploaded Successfully!",
                            });
                          }}
                          onUploadError={(error: Error) => {
                            // Do something with the error.
                            console.log(error, "EROR");
                            toast({
                              title: "Something Went Wrong,Try Again!",
                            });
                          }}
                        />
                        {form.getValues("brandImg") && (
                          <li className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24">
                            <article className="group hasImage w-full h-full rounded-md focus:outline-none focus:shadow-outline cursor-pointer relative text-transparent hover:text-white shadow-sm ">
                              <Image
                                src={form.getValues("brandImg") || ""}
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

                      {/* <Input
                        type="file"
                        accept="image/*"
                        onChange={(e: any) => handleImage(e, field.onChange)}
                      /> */}
                    </FormControl>
                  </FormItem>
                );
              }}
            />

            <Button
              type="submit"
              className="w-40 m-auto my-6"
              disabled={brandMutation.isPending}
            >
              {brandMutation.isPending && (
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

export default CreateBrand;
