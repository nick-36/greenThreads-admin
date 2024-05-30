import React from "react";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import Image from "next/image";

type BusinessStatsCard = {
  title: string;
  subTitle: string;
  icon: string;
};

const BusinessStatsCard = ({ title, subTitle, icon }: BusinessStatsCard) => {
  return (
    <Card x-chunk="dashboard-01-chunk-0" className="">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
        <Image
          src={icon}
          alt="order"
          width={34}
          height={45}
          // className="h-4 w-4"
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{subTitle}</div>
      </CardContent>
    </Card>
  );
};

export default BusinessStatsCard
