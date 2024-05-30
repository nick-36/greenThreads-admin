import React from "react";
import { CardContent, Card } from "@/components/ui/card";
import Image from "next/image";

const OrderCard = ({ orderDetails }: any) => {
  return (
    <Card className="max-w-sm shadow-md border-none cursor-pointer">
      <CardContent className="p-0 ">
        {orderDetails.products.map((product: any, idx: number) => {
          return (
            <div
              className="flex flex-start  gap-2 space-y-2 border-b p-2"
              key={idx}
            >
              <div className="rounded-md shrink-0 w-24 h-24  relative md:rounded-none">
                <Image src={product?.img} alt="order" fill />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-base">{product?.name}</p>
                <div className="flex align-center gap-6">
                  <p className="text-xs font-light">
                    Qty : {product?.quantity}
                  </p>
                  <p className="text-xs font-light">$ {product?.price}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div className="py-2 px-4 mt-auto">
          <div className="flex align-center justify-between gap-6">
            <p className="text-xs font-light">
              Order id: {orderDetails?.orderId}
            </p>
            <p className="text-xs font-light">
              Order on {orderDetails.orderDate}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
