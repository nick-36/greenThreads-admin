import React, { cache } from "react";
import ServerPageWrapper from "../serverPageWrapper";
import CategoryList from "@/components/shared/Listing/CategoryList";
import axios from "@/lib/utils/axios";

const fetchCategories = async () => {
  try {
    const res = await axios.get("/categories");
    if (res.data?.success) {
      return res.data?.categories;
    }
    return [];
  } catch (error) {
    console.log(error);
  }
};

const Categories = async () => {
  const categories = await fetchCategories();
  return (
    <ServerPageWrapper>
      <CategoryList categories={categories} />
    </ServerPageWrapper>
  );
};

export default Categories;
