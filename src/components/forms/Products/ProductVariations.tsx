import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import VariantForm from "@/components/forms/VariantForm";

const ProductVariations = () => {
  return (
    <Card x-chunk="dashboard-07-chunk-1" className="overflow-auto h-full">
      <CardHeader>
        <CardTitle>Variations</CardTitle>
        <CardDescription>Configure Products Variations</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex-col md:flex p-4">
        <VariantForm />
      </CardContent>
    </Card>
  );
};

export default ProductVariations;
