import React from "react";
import CreateCategoryForm from "@/components/forms/CreateCategories";
import ServerPageWrapper from "@/app/(root)/serverPageWrapper";
const CreateCategory = () => {
  return (
    <ServerPageWrapper>
      <CreateCategoryForm />
    </ServerPageWrapper>
  );
};

export default CreateCategory;
