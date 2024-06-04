import React from "react";
import ClientPageWrapper from "./clientPageWrapper";
import Header from "@/components/shared/Header";
import { HeaderProps } from "@/lib/utils/types/headerType";
import DesktopSidebar from "@/components/shared/Layouts/DesktopSidebar";

const ServerPageWrapper = ({
  children,
  headerProps,
}: {
  children: React.ReactNode;
  headerProps?: HeaderProps;
}) => {
  return (
    <ClientPageWrapper>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[220px_1fr]">
        <DesktopSidebar />
        <div className="flex flex-col overflow-hidden">
          <Header {...headerProps} />
          {children}
        </div>
      </div>
    </ClientPageWrapper>
  );
};

export default ServerPageWrapper;
