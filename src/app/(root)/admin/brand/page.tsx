import React from "react";
import ServerPageWrapper from "@/app/(root)/serverPageWrapper";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { axiosPrivate } from "@/lib/utils/axios";
import BrandList from "@/components/shared/Listing/brand-list";

const fetachAllBrands = async () => {
  try {
    const { userId, getToken } = auth();
    const sessionToken = await getToken();

    if (!userId || !sessionToken) {
      redirect("/sign-in");
    }

    const res = await axiosPrivate.get("/admin/brands/get-all", {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (res.data?.success) {
      return res.data?.data;
    } else {
      console.error("Failed to fetch data");
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};
const BrandPage = async () => {
  const brands = await fetachAllBrands();
  return (
    <ServerPageWrapper>
      <BrandList brands={brands} />
    </ServerPageWrapper>
  );
};

export default BrandPage;
