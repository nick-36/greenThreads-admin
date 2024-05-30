"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { HEADER_VARIANTS } from "@/lib/utils/constants";
import { HeaderProps } from "@/lib/utils/types/headerType";
import { Ratings } from "@/components/ui/rating";
import { useRouter } from "next/navigation";
import { SignOutButton, RedirectToSignIn, useClerk } from "@clerk/nextjs";
import { useUser } from "@clerk/clerk-react";

const EnhancedHeader = () => {
  const { signOut } = useClerk();
  const router = useRouter();
  const { user } = useUser();

  return (
    <div className="flex justify-between items-end bg-stone-900 px-2 py-8">
      <div className="flex gap-4 w-full items-center relative">
        <div className="shrink-0">
          <Image
            src={"/assets/male_avatar.svg"}
            alt="profile photo"
            width={58}
            height={60}
            priority
            className="rounded-full border-2 border-white aspect-square object-cover"
          />
          <Button
            size={"sm"}
            variant="secondary"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "absolute  rounded-2xl bg-white max-w-14 max-h-5 text-[0.5rem] -translate-y-1/2 translate-x-1"
            )}
          >
            <Link href={"/profile"}>Edit Profile</Link>
          </Button>
        </div>
        <div className="flex flex-col w-full space-y-1">
          <p className="text-sm font-normal text-white">{user?.fullName}</p>
          <p className="text-xs font-normal text-white">
            {user?.primaryEmailAddress?.emailAddress}
          </p>
          <div className="w-full flex justify-between">
            <Ratings variant="yellow" rating={3.5} />
          </div>
        </div>
      </div>

      <div className="h-full flex flex-col space-y-4 justify-between items-center relative">
        <div className="relative w-fit">
          <Badge className="absolute p-0 top-0 right-0 z-10 flex h-5 w-5 rounded-full -translate-y-1/2 translate-x-2/4  items-center justify-center bg-red-500 text-white">
            1
          </Badge>
          <Icons.bell />
        </div>

        <div
          className="flex justify-between items-end  text-white py-0 h-fit"
          onClick={() => signOut(() => router.push("/sign-in"))}
        >
          Logout
        </div>
      </div>
    </div>
  );
};

const DefaultHeader = ({
  headerTitle,
  showBackArrow = true,
}: {
  headerTitle?: string;
  showBackArrow?: boolean;
}) => {
  const router = useRouter();
  return (
    <div className="flex items-center bg-stone-900 px-2 py-4">
      {showBackArrow && (
        <Icons.backArrow onClick={router.back} className="text-white" />
      )}
      <p
        className={cn(
          "w-full flex justify-center text-white",
          showBackArrow && "mr-8"
        )}
      >
        {headerTitle}
      </p>
    </div>
  );
};

const MobileHeader = (props: HeaderProps) => {
  const { variant, headerTitle = "" } = props;

  const renderHeader = () => {
    switch (variant) {
      case HEADER_VARIANTS.Enhanced:
        return <EnhancedHeader />;
      case HEADER_VARIANTS.Default:
        return <DefaultHeader headerTitle={headerTitle} />;
      default:
        return <DefaultHeader headerTitle={headerTitle} />;
    }
  };

  return <>{renderHeader()}</>;
};

export default MobileHeader;
