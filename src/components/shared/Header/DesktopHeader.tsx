"use client";
import React, { useState, ReactElement } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { mobileFooterLinks } from "@/lib/utils/mobileFooterLinks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  ShoppingCart,
  BarChart,
  Tag,
  Store,
} from "lucide-react";
import { useClerk } from "@clerk/clerk-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import ToggleTheme from "@/components/shared/ToggleTheme";
import NotificationBell from "../NotificationBell";

interface IconMapping {
  [key: string]: (props: Record<string, any>) => ReactElement;
}
const iconMapping: IconMapping = {
  home: (props: any) => <Home className="h-4 w-4" {...props} />,
  orders: (props: any) => <ShoppingCart className="h-4 w-4" {...props} />,
  brand: (props: any) => <Store className="h-4 w-4" {...props} />,
  revenue: (props: any) => <LineChart className="h-4 w-4" {...props} />,
  products: (props: any) => <Package className="h-4 w-4" {...props} />,
  barchart: (props: any) => <BarChart className="h-4 w-4" {...props} />,
  tag: (props: any) => <Tag className="h-4 w-4" {...props} />,
};

const DesktopHeader = () => {
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();
  const [currPath, setCurrPath] = useState(pathname);

  return (
    <header className="flex  h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            {mobileFooterLinks.map((link) => {
              const isActive = currPath === link.href;
              return (
                <Link
                  href={link.href}
                  key={link.href}
                  className={cn(
                    "mx-[-0.65rem] text-sm flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                    isActive ? "bg-muted/10 " : ""
                  )}
                >
                  {iconMapping[link.icon]({ isActive })}
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="ml-auto flex items-center gap-4">
        <ToggleTheme />
        <div className="md:hidden">
          <NotificationBell notificationCount={4} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={"/profile"}>Edit Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut(() => router.push("/sign-in"))}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DesktopHeader;
