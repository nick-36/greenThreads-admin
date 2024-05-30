"use client";
import React, { useEffect, useState, ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Home,
  ShoppingCart,
  Package,
  LineChart,
  BarChart,
  Tag,
  Store,
} from "lucide-react";
import { mobileFooterLinks } from "@/lib/utils/mobileFooterLinks";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
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

const DesktopSidebar = () => {
  const pathname = usePathname();
  const [currPath, setCurrPath] = useState(pathname);
  const router = useRouter();
  useEffect(() => {
    if (pathname && currPath !== pathname) {
      setCurrPath(pathname);
    }
  }, [pathname]);
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="relative mx-auto z-20 flex items-center text-lg font-medium h-8 w-8 bg-slate-900 rounded">
              <Image
                src="/brandLogoV2.svg"
                fill
                alt="green-thread-logo"
                className="rounded"
              />
            </div>
            <span className=""></span>
          </Link>
          <NotificationBell notificationCount={10} />
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {mobileFooterLinks.map((link) => {
              const isActive = currPath === link.href;
              return (
                <Link
                  href={link.href}
                  key={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    isActive ? "bg-muted " : ""
                  )}
                  onClick={() => {
                    router.refresh();
                  }}
                >
                  {iconMapping[link.icon]({ isActive })}
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
