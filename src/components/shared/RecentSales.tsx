import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import { IndianRupee } from "lucide-react";

export function RecentSales({ data }: any) {
  const userData = useUser();

  return (
    <div className="space-y-8">
      {data?.map((sale: any, idx: number) => {
        return (
          <div className="flex items-center" key={idx}>
            <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
              <AvatarImage src={userData?.user?.imageUrl} alt="Avatar" />
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {sale.customerDetails.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {sale.customerDetails.email}
              </p>
              <div className="ml-auto font-medium flex items-center md:hidden">
                <IndianRupee className="h-4 w-4" />
                {sale.amount}
              </div>
            </div>
            <div className="ml-auto font-medium hidden md:flex items-center">
              <IndianRupee className="h-4 w-4" />
              <span> {sale.amount}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
