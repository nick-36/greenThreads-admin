"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function OrderStatus({
  title,
  label,
  items,
  currentStatus,
}: {
  title: string;
  label: string;
  items: any[];
  currentStatus: string;
}) {
  const [initialStatus, setInitialStatus] = useState(currentStatus);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState(items);

  const handleChangeStatus = (newStatus: string) => {
    setSelectedStatus(newStatus);
    setIsConfirmationOpen(true);
    setInitialStatus(selectedStatus);
  };

  const handleConfirmStatusChange = () => {
    setIsConfirmationOpen(false);
    const updatedItems = filteredItems.map((item) =>
      item.value === selectedStatus ? { ...item, isDone: true } : item
    );
    setFilteredItems(updatedItems);
  };

  const handleCancelStatusChange = () => {
    setIsConfirmationOpen(false);
    setSelectedStatus(initialStatus);
  };

  return (
    <>
      <Card>
        <CardHeader className="grid grid-cols-2 items-center">
          <CardTitle>{title}</CardTitle>
          <Badge
            variant="outline"
            className="ml-auto sm:ml-0 w-fit md:mt-0"
          >
            {selectedStatus}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="status">{label}</Label>
              <Select
                value={selectedStatus}
                disabled={selectedStatus === "DELIVERED"}
                onValueChange={(value) => handleChangeStatus(value)}
              >
                <SelectTrigger id="status" aria-label="Select status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {filteredItems?.map((item, idx: number) => {
                    return (
                      <SelectItem
                        disabled={item?.isDone || item?.value === initialStatus}
                        key={idx}
                        value={item?.value}
                      >
                        {item?.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      <AlertDialog open={isConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelStatusChange}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmStatusChange}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
