"use client";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

type link = {
  name: string;
  href: string;
  icon: string;
};

type IconComponentProps = {
  isActive: boolean;
  className?: string;
};

interface IconComponents {
  [key: string]: React.ComponentType<IconComponentProps>;
}
const Home = ({ isActive, className }: IconComponentProps) => {
  return (
    <Icons.home
      fill={isActive ? "bg-black" : "#8C8C8C"}
      className={className}
    />
  );
};

const Orders = ({ isActive, className }: IconComponentProps) => {
  return (
    <Icons.orders
      fill={isActive ? "bg-black" : "#8C8C8C"}
      className={className}
    />
  );
};

const Revenue = ({ isActive }: IconComponentProps) => {
  return <Icons.revenue fill={isActive ? "bg-black" : "#8C8C8C"} />;
};

const Products = ({ isActive }: IconComponentProps) => {
  return <Icons.products fill={isActive ? "bg-black" : "#8C8C8C"} />;
};

const iconComponents: IconComponents = {
  orders: Orders,
  home: Home,
  revenue: Revenue,
  products: Products,
};

const MobileFooter = ({ links }: { links: link[] }) => {
  const pathname = usePathname();
  const [currPath, setCurrPath] = useState(pathname);

  useEffect(() => {
    if (pathname && currPath !== pathname) {
      setCurrPath(pathname);
    }
  }, [pathname]);

  return (
    <div className="fixed bottom-0 left-0 z-10 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 md:hidden">
      <div className="grid h-full py-4 max-w-lg grid-cols-4">
        {links.map((link, key) => {
          const IconComponent = iconComponents[link.icon];
          return (
            <Link
              href={link.href}
              key={key}
              className={cn(
                buttonVariants({ variant: "link" }),
                "nav-link inline-flex flex-col items-center justify-center font-medium px-5  dark:hover:bg-gray-800 group"
              )}
            >
              <div
                className={cn(
                  "flex justify-center items-center flex-col gap-2 group-hover:text-slate-900"
                )}
              >
                <IconComponent isActive={currPath === link.href} />
                <span
                  className={cn(
                    currPath === link?.href ? "text-black" : "text-gray-400",
                    "text-xs font-light group-hover:text-slate-900"
                  )}
                >
                  {link.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileFooter;
