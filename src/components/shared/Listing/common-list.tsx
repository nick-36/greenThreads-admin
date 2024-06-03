"use client";
import { ColumnDef } from "@tanstack/react-table";
import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/shared/Table/data-table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useSearchParams } from "next/navigation";

interface CommonListProps {
  table: any;
  title: string;
  subTitle: string;
  handleSearch: (data: any) => void;
  searchState: string;
  tabState?: string;
  handleTabChange?: (data: any) => void;
  isLoading: boolean;
  tabsList?: { label: string; value: string }[];
  showDateRange?: boolean;
}

const CommonList = ({
  table,
  title,
  subTitle,
  searchState,
  handleSearch,
  tabState,
  handleTabChange,
  isLoading,
  tabsList,
  showDateRange = false,
}: CommonListProps) => {
  const searchParams = useSearchParams();
  const searchObj = Object.fromEntries(searchParams);
  return (
    <div>
      <Card x-chunk="dashboard-05-chunk-3" className="border-none shadow-none">
        <CardContent className="md:p-4">
          <Tabs defaultValue={tabState} onValueChange={handleTabChange}>
            {tabsList?.length && (
              <div className="flex flex-col md:flex-row gap-4 px-0 py-4 justify-between items-center md:p-6">
                <TabsList>
                  {tabsList.map((tab, i) => (
                    <TabsTrigger key={i} value={tab.value}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            )}

            <TabsContent value={tabState as string}>
              <Card className="border-none shadow-none">
                <div className="flex space-x-4 flex-col space-y-3 md:flex-row justify-between p-6 px-2 md:px-5">
                  <div
                    x-chunk="dashboard-05-chunk-3"
                    className="flex flex-1 justify-between border-none"
                  >
                    <CardHeader className="p-0">
                      <CardTitle>{title}</CardTitle>
                      <CardDescription>{subTitle}</CardDescription>
                    </CardHeader>
                  </div>

                  <div className="relative md:ml-auto flex-1 md:grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                      onChange={handleSearch}
                      value={searchState}
                    />
                  </div>
                  {showDateRange && (
                    <DateRangePicker
                      triggerSize="sm"
                      triggerClassName="ml-auto w-56 sm:w-60"
                      align="end"
                      dateRange={
                        searchObj.from && searchObj.to
                          ? {
                              from: new Date(searchObj.from),
                              to: new Date(searchObj.to),
                            }
                          : undefined
                      }
                    />
                  )}
                </div>
                <CardContent className="border-none p-0 md:p-4">
                  <DataTable table={table} isLoading={isLoading} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommonList;
