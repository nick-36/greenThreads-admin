"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RecentSales } from "@/components/shared/RecentSales";
import { Overview } from "@/components/shared/Cards/Overview";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { IndianRupee } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Analytics = () => {
  const [duration, setDuration] = useState("yearly");
  const axiosPrivate = useAxiosPrivate();
  const fetchRevenueInfo = async () => {
    try {
      const response = await axiosPrivate.get(
        `/payments/revenue?duration=${duration}`
      );
      return response?.data.data;
    } catch (error: any) {
      toast({
        title: `Uh oh! `,
        description: "Failed To Fetch Data!!",
      });
    }
  };
  const { data, isLoading: isLoading } = useQuery({
    queryKey: ["revenue", duration],
    queryFn: () => fetchRevenueInfo(),
  });

  return (
    <div className=" flex-col md:flex">
      <div className="flex-1 space-y-4 p-4 md:p-6 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <span className="flex items-center">
                  <IndianRupee className="h-4 w-4" />
                  <span>{data?.totalRevenue}</span>
                </span>
              </div>
              {/* <p className="text-xs text-muted-foreground">
                        +20.1% from last month
                      </p> */}
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="sm:col-span-2 lg:col-span-4">
            <Tabs
              defaultValue="yearly"
              className="space-y-4"
              value={duration}
              onValueChange={(val) => {
                setDuration(val);
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Overview</CardTitle>
                <TabsList>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
              </CardHeader>
              <TabsContent value={duration} className="space-y-4">
                <CardContent className="pl-2">
                  <Overview data={data?.periodicRevenue} />
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
          <Card className="sm:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>
                You made {data?.totalSalesOfMonth} sales this month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales data={data?.recentSales} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
