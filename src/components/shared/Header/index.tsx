import React from "react";
import MobileHeader from "./MobileHeader";
import DesktopHeader from "./DesktopHeader";
import { HeaderProps } from "@/lib/utils/types/headerType";

const Header = (props: HeaderProps) => {
  console.log("REDNER");
  return <DesktopHeader />;
};

export default Header;
