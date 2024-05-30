import React from "react";

import { Card } from "@/components/ui/card";

const DesktopMain = ({ headerTitle, children }: any) => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <Card x-chunk="dashboard-06-chunk-0" className="border-dashed">
        {children}
      </Card>
    </main>
  );
};

export default DesktopMain;
