"use client";
import { Copy, IndianRupee, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatDateString } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

export default function OrderDetails({ orderDetails }: any) {
  const onCopy = (copyText: string) => {
    navigator.clipboard.writeText(copyText);
    toast({
      title: `Copied to clipboard`,
      duration: 2000,
    });
  };
  return (
    <div className="grid grid-cols-1 gap-4 p-6">
      <Card className="overflow-hidden md:col-span-2 order-2 md:order-1">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              {orderDetails.id}
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => onCopy(orderDetails.id)}
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy Order ID</span>
              </Button>
              <Badge variant="outline" className="ml-auto sm:ml-0">
                {orderDetails.status?.replace(/_/g, " ")}
              </Badge>
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              Date: {formatDateString(orderDetails.createdAt)}
            </CardDescription>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <Truck className="h-3.5 w-3.5" />
              <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                Track Order
              </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails.orderItems.items?.map(
                (orderItem: any, index: number) => (
                  <li className="flex items-center justify-between" key={index}>
                    <span className="text-muted-foreground">
                      {orderItem?.productName} x{" "}
                      <span>{orderItem?.quantity}</span>
                    </span>
                    <span className="flex items-center">
                      <IndianRupee className="h-3 w-3" />
                      <span>{orderItem?.amountTotal}</span>
                    </span>
                  </li>
                )
              )}
            </ul>
            <Separator className="my-2" />
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>

                <span className="flex items-center">
                  <IndianRupee className="h-3 w-3" />
                  <span>{orderDetails?.orderItems?.totalAmount}</span>
                </span>
              </li>
              {/* <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{orderDetails?.totalDetails?.amount_shipping}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{orderDetails?.totalDetails?.amount_tax}</span>
              </li> */}
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">Total</span>
                <span className="flex items-center">
                  <IndianRupee className="h-3 w-3" />
                  <span>{orderDetails?.orderItems?.subTotal}</span>
                </span>
              </li>
            </ul>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <div className="font-semibold">Shipping Information</div>
              <address className="grid gap-0.5 not-italic text-muted-foreground">
                <span>{orderDetails?.shippingDetails?.name}</span>
                <span>{orderDetails?.shippingDetails?.address?.line1}</span>
                <span>{orderDetails?.shippingDetails?.address?.line2}</span>
                <span>{orderDetails?.shippingDetails?.address?.city}</span>
                <span>
                  {orderDetails?.shippingDetails?.address?.postal_code}
                </span>
              </address>
            </div>
            <div className="grid auto-rows-max gap-3">
              <div className="font-semibold">Billing Information</div>
              <div className="text-muted-foreground">
                Same as shipping address
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="grid gap-3">
            <div className="font-semibold">Customer Information</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Customer</dt>
                <dd>{orderDetails?.customerDetails?.name}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Email</dt>
                <dd>
                  <a href="mailto:">{orderDetails?.customerDetails?.email}</a>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Phone</dt>
                <dd>
                  <a href="tel:">{orderDetails?.customerDetails?.phone}</a>
                </dd>
              </div>
            </dl>
          </div>
          <Separator className="my-4" />
          <div className="grid gap-3">
            <div className="font-semibold">Payment Information</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  Payment Status
                </dt>

                <Badge
                  variant="outline"
                  className="ml-auto sm:ml-0 w-fit md:mt-0"
                >
                  {orderDetails?.paymentStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  {/* <CreditCard className="h-4 w-4" /> */}
                  Payment Method
                </dt>
                <dd>{orderDetails?.paymentMethod}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  Payment IntentId
                </dt>
                <dd>{orderDetails?.paymentIntentId}</dd>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
