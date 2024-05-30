"use client";
import React, { useState } from "react";
import { Icons } from "@/components/ui/icons";
import Image from "next/image";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const FilterOptions = [
  {
    label: "Today",
    value: "Today",
  },
  {
    label: "Week",
    value: "Week",
  },
  {
    label: "Month",
    value: "Month",
  },
  {
    label: "Total",
    value: "Total",
  },
];

const BusinessInfo = () => {
  const [selectedFilter, setSelectedFilter] = useState("Total");
  const previewFilterMap: {
    [key: string]: string;
  } = {
    Today: "Today",
    Month: "Monthly",
    Week: "Weekly",
    Total: "",
  };
  return (
    <div className="border-b border-gray-100 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-light text-[#6B6B6B]">Filter</p>
        <Drawer>
          <DrawerTrigger>
            <Icons.filter />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="gap-4">
              <DrawerTitle className="text-sm text-left font-normal border-b border-spacing-7 py-2">
                Filters
              </DrawerTitle>
              <RadioGroup
                defaultValue={selectedFilter ?? "Total"}
                onValueChange={(val: string) => setSelectedFilter(val)}
              >
                {FilterOptions.map((opt, idx) => (
                  <div
                    className="flex items-center space-y-2 justify-between"
                    key={idx}
                  >
                    <Label htmlFor={opt.value} className="font-light">
                      {opt.label}
                    </Label>
                    <RadioGroupItem value={opt.value} id={opt.value} />
                  </div>
                ))}
              </RadioGroup>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose>
                <Button className="w-full max-w-72">Apply</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="flex  items-center justify-between">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-normal">
            {previewFilterMap[selectedFilter]}
          </p>
          <p className="text-sm font-normal">Total Revenue</p>
          <p className="text-3xl/10 font-normal">$4000.02</p>
        </div>
        <div className="space-y-2">
          <Image
            src="/assets/barChart.svg"
            alt="barChart"
            width={90}
            height={40}
          />
          <p className="text-[0.6rem] font-normal">Last 7 days revenue</p>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfo;
