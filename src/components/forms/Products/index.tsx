"use client";
import useMultiStep from "@/hooks/useMultiStep";
import React, { useMemo, useState } from "react";
import ProductBasicInfo from "@/components/forms/Products/ProductBasicInfo";
import ProductCategoryInfo from "@/components/forms/Products/ProductCategoryInfo";
import ProductVariations from "@/components/forms/Products/ProductVariations";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import productValidationSchema from "@/lib/validation/productValidation";
import { Form } from "@/components/ui/form";
import z from "zod";
import ProductCombinations from "./ProductCombinations";
import {
  formatCombinations,
  formatVariationData,
  generateProductVariations,
} from "@/lib/utils";
import ProductImages from "./ProductImages";
import DetailsPreview from "@/components/forms/Products/Preview";
import Stepper from "@/components/shared/Stepper";
import ConfirmationModal from "@/components/forms/Products/Confirmation";
import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/utils/axios";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ProductStatus } from "@/lib/utils/types/CategoryType";
import { DELIVERY_RANGE } from "@/lib/utils/constants";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

type ProductFormData = z.infer<typeof productValidationSchema>;
let renderCount: number = 0;
const MultiStepsForm = ({ product }: any) => {
  const params = useParams();
  const {
    productName = "",
    description = "",
    isActive = true,
    originalPrice = 100,
    discountPercentage = 0,
    discountedPrice = 0,
    isNextDayDelivery = false,
    deliveryRange = DELIVERY_RANGE[0],
    weight = 0,
    height = 0,
    width = 0,
    length = 0,
    categories = [],
    productImages = [],
  } = product ?? {};

  const initialState: Partial<ProductFormData> = {
    productName,
    description,
    status: isActive ? ProductStatus["ACTIVE"] : ProductStatus["INACTIVE"],
    productImages: productImages,
    retailPrice: originalPrice,
    discountPercentage,
    discountedPrice,
    isNextDayDelivery,
    deliveryRange,
    shippingInfo: { weight, height, width, length },
    categoryId: categories[0]
      ? { id: categories[0].id, name: categories[0].name }
      : { id: null, name: "" },
    subCategoryId: categories[1]
      ? { id: categories[1].id, name: categories[1].name }
      : { id: null, name: "" },
    subSubCategoryId: categories[2]
      ? { id: categories[2].id, name: categories[2].name }
      : { id: null, name: "" },
  };
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isDisacardModalOpen, setIsDisCardModalOpen] = useState(false);
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productValidationSchema),
    defaultValues: initialState,
    mode: "onBlur",
  });
  const axiosPrivate = useAxiosPrivate();

  const formSteps = [
    {
      step: <ProductBasicInfo />,
      fields: ["productName", "discountPercentage"],
      name: "Basic Info",
    },
    {
      step: <ProductCategoryInfo />,
      fields: ["categoryId"],
      name: "Categories",
    },
    // {
    //   step: <ProductVariations />,
    //   nextFunction: params?.id ? null : () => generateCombinations(),
    //   fields: ["variations"],
    //   name: "Variations",
    // },
    // {
    //   step: <ProductCombinations />,
    //   fields: [],
    //   name: "Inventory",
    // },

    {
      step: <ProductImages />,
      fields: [],
      name: "Images",
    },
    {
      step: (
        <DetailsPreview
          onSave={() => setIsConfirmationOpen(true)}
          onDiscard={() => setIsDisCardModalOpen(true)}
        />
      ),
      fields: [],
      name: "Preview",
    },
  ];
  const { step, steps, next, previous, isLastStep, isFirstStep, goTo } =
    useMultiStep({
      steps: formSteps,
      form,
      submitHandlder: () => setIsConfirmationOpen(true),
      defaultStep: product ? formSteps?.length - 1 : 0,
    });
  const { toast } = useToast();
  const router = useRouter();
  const { mutate: createUpdateProduct, isPending } = useMutation({
    mutationFn: async (payload: ProductFormData) => {
      if (params.id) {
        return await axiosPrivate.patch(`/products/${params.id}`, payload);
      } else {
        return await axiosPrivate.post("/products", payload);
      }
    },
    onError: (error: any) => {
      const errorData = error.response.data;
      console.log(errorData, "ERRORDAT");
      toast({
        title: `Uh oh! ${error?.response?.status ?? "500"} `,
        description: errorData.message || "Something Went Wrong!!",
      });
    },
    onSuccess: ({ data }) => {
      form.reset();
      setIsConfirmationOpen(false);
      const message = params?.id
        ? "Product Updated Successfully"
        : "Product Created Successfully";
      toast({
        title: "Great!",
        description: message,
      });
      router.push(`/products/${params.id ?? data?.product?.id}/inventory`);
    },
  });

  const onFormSubmit = async (data: ProductFormData) => {
    createUpdateProduct(data);
  };

  const onDiscardConfirm = () => {
    form.reset();
    setIsDisCardModalOpen(false);
    goTo(0);
  };
  renderCount++;

  return (
    <div
      x-chunk="dashboard-06-chunk-0 "
      className="border-none shadow-none md:p-6 p-4"
    >
      <Form {...form}>
        {/* <p>Form Renders {renderCount}</p> */}
        <Stepper steps={steps} goTo={goTo} />
        <form
          onSubmit={form?.handleSubmit(onFormSubmit)}
          className="mx-auto grid max-w-[60rem] flex-1 auto-rows-max gap-4 h-full py-6"
        >
          {step}
          <div className="flex justify-between items-center">
            <Button type="button" onClick={previous} disabled={isFirstStep}>
              Previous
            </Button>
            <Button type="button" disabled={isLastStep} onClick={next}>
              Next
            </Button>
          </div>
        </form>
      </Form>
      <ConfirmationModal
        isOpen={isDisacardModalOpen}
        subTitle="Please confirm once before proceeding"
        onContinue={onDiscardConfirm}
        onCancel={() => setIsDisCardModalOpen(false)}
      />
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        subTitle="Please make sure all the information is accurate before
        proceeding."
        onContinue={() => onFormSubmit(form.getValues())}
        onCancel={() => setIsConfirmationOpen(false)}
        isLoading={isPending}
      />
    </div>
  );
};

export default MultiStepsForm;
