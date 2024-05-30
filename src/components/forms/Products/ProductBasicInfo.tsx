import React, { useEffect } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext, useWatch } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DELIVERY_RANGE } from "@/lib/utils/constants";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Info } from "lucide-react";

const ProductBasicInfo = () => {
  const form = useFormContext();
  const retailPrice = useWatch({
    control: form.control,
    name: "retailPrice",
  });
  const discountPercentage = useWatch({
    control: form.control,
    name: "discountPercentage",
  });

  const handlePercentageChange = () => {
    if (!isNaN(discountPercentage) && !isNaN(retailPrice)) {
      const discountedPrice = (
        retailPrice -
        retailPrice * (discountPercentage / 100)
      ).toFixed(2);
      form.setValue("discountedPrice", Number(discountedPrice));
    } else {
      form.setValue("discountedPrice", 0);
    }
  };

  useEffect(() => {
    handlePercentageChange();
  }, [retailPrice, discountPercentage, form.setValue]);

  return (
    <Card x-chunk="dashboard-07-chunk-0">
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
        <CardDescription className="flex items-center gap-4">
          <span>Add Vital Product Informations</span>
          <TooltipProvider>
            <Tooltip delayDuration={250}>
              <TooltipTrigger>
                <Info className="h-5 w-5" />
              </TooltipTrigger>
              <TooltipContent
                align="start"
                side="bottom"
                sideOffset={6}
                className="flex max-w-60 flex-col space-y-1.5 border bg-background py-2 font-semibold text-foreground"
              >
                <span>Make sure to create Brand before products</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          {/* PRODUCT NAME */}
          <div className="grid col-span-3 gap-3">
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
                        defaultValue="Gamer Gear Pro Controller"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            ></FormField>
          </div>
          {/* PRODUCT DESCRIPTION */}
          <div className="grid col-span-3 gap-3">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel htmlFor="description">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        id="description"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="grid col-span-3 md:col-span-1 gap-3">
            <FormField
              control={form.control}
              name="retailPrice"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel htmlFor="name">Retail Price</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="retailPrice"
                        type="number"
                        className="w-full"
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            ></FormField>
          </div>
          <div className="grid col-span-3 md:col-span-1 gap-3">
            <FormField
              control={form.control}
              name="discountPercentage"
              defaultValue={0}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel htmlFor="discountPercentage">
                      Discount Percentage(%)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="discountPercentage"
                        type="number"
                        className="w-full"
                        max={100}
                        maxLength={3}
                        min={0}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            ></FormField>
          </div>
          <div className="grid col-span-3 md:col-span-1 gap-3">
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
          <Separator className="col-span-3" />
          <p className="font-semibold col-span-3">Delivery Information</p>
          <div className="grid col-span-3 gap-3 grid-cols-2">
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name={"deliveryRange"}
                render={({ field }) => {
                  return (
                    <FormItem className="col-span-4 md:col-span-1">
                      <FormLabel htmlFor="deliveryRange">
                        Delivery Range
                      </FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={(val) => field.onChange(val)}
                        >
                          <SelectTrigger
                            id={"deliveryRange"}
                            aria-label="Select Range"
                          >
                            <SelectValue placeholder="Select Range" />
                          </SelectTrigger>
                          <SelectContent>
                            {DELIVERY_RANGE?.map((item, idx: number) => {
                              return (
                                <SelectItem key={idx} value={item}>
                                  {item.replace(/_/g, " ")}
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
            </div>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="isNextDayDelivery"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel htmlFor="isNextDayDelivery">
                        Is Next Day Delivery?
                      </FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={(val) => {
                            const isNextDayDelivery = val === "YES";
                            field.onChange(isNextDayDelivery);
                          }}
                          value={field.value ? "YES" : "NO"}
                        >
                          <SelectTrigger
                            id={"isNextDayDelivery"}
                            aria-label="Select Range"
                          >
                            <SelectValue placeholder="Select Range" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              {
                                label: "Yes",
                                value: "YES",
                              },
                              {
                                label: "No",
                                value: "NO",
                              },
                            ]?.map((item, idx: number) => {
                              return (
                                <SelectItem key={idx} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>
          <Separator className="col-span-3" />
          {/* Shipping Info */}
          <p className="font-semibold col-span-3">
            Product Shipping Information
          </p>
          <div className="grid col-span-3 gap-3 grid-cols-2">
            <div className="">
              <FormField
                control={form.control}
                name="shippingInfo.weight"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel htmlFor="weight">
                        Product Weight (in grams)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="productWeight"
                          type="number"
                          className="w-full"
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              ></FormField>
            </div>
            <div className="">
              <FormField
                control={form.control}
                name="shippingInfo.length"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel htmlFor="length">
                        Product Length (in cm)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="length"
                          type="number"
                          className="w-full"
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              ></FormField>
            </div>
            <div className="">
              <FormField
                control={form.control}
                name="shippingInfo.width"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel htmlFor="width">
                        Product Width (in cm)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="width"
                          type="number"
                          className="w-full"
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              ></FormField>
            </div>
            <div className="">
              <FormField
                control={form.control}
                name="shippingInfo.height"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel htmlFor="height">
                        Product height (in cm)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="height"
                          type="number"
                          className="w-full"
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              ></FormField>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductBasicInfo;
