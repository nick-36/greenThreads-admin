import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const NotificationBell = ({
  notificationCount,
}: {
  notificationCount: number;
}) => {
  return (
    <Button variant="ghost" size="icon" className="relative ml-auto h-8 w-8">
      <Link href={"/notification"}>
        <Bell className="h-5 w-5"></Bell>
        {/* <span className="text-xs text-white flex justify-center items-center h-4 w-4 rounded-full bg-red-500 absolute top-[-4px] right-[-4px]">
                4
              </span> */}
        <Badge className="absolute p-0 md:p-0.5 top-1.5 right-1.5 z-10 flex h-5 w-5 md:h-5 md:w-5 rounded-full -translate-y-1/2 translate-x-2/4 text-[0.5rem] md:text-[0.6rem] items-center justify-center bg-red-500 text-white border-1 border-white">
          {notificationCount}
        </Badge>
        <span className="sr-only">Toggle notifications</span>
      </Link>
    </Button>
  );
};

export default NotificationBell;
