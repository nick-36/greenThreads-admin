import { z } from "zod";

export const skuSchema = z.object({
  id: z.string()?.optional(),
  stock: z.number(),
  originalPrice: z.number(),
  size: z.enum(["s", "m", "l"]),
});

export const productValidationSchema = z.object({
  productName: z.string().min(2, {
    message: "name is required field",
  }),
  description: z.string()?.optional(),
  status: z.enum(["active", "inactive"]),
  retailPrice: z.number().positive(),
  discountPercentage: z.coerce.number().min(0).max(100, {
    message: "max value is 100.",
  }),
  discountedPrice: z.number().min(0).optional(),
  isNextDayDelivery: z.boolean(),
  shippingInfo: z.object({
    weight: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    length: z.number().optional(),
  }),
  deliveryRange: z.enum([
    "ONE_TO_THREE_DAYS",
    "THREE_TO_FIVE_DAYS",
    "FIVE_TO_SEVEN_DAYS",
    "SEVEN_TO_TEN_DAYS",
    "TEN_TO_FOURTEEN_DAYS",
  ]),
  categoryId: z.object({
    id: z.string().uuid(),
    name: z.string(),
  }),
  subCategoryId: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
    })
    .optional(),
  subSubCategoryId: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
    })
    .optional(),
  productImages: z.array(z.string()),
});

export const categoryValidationSchema = z.object({
  name: z.string().min(1, "Category Name is required"),
  description: z.string().optional(),
  parentId: z.string().optional()?.nullable(),
  categoryImg: z.string().optional()?.nullable(),
  categorySlug: z.string()?.optional(),
});

export const brandValidationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Brand Name is required"),
  description: z.string().optional(),
  brandImg: z.string().optional(),
});

export const variationsValidationSchema = z.object({
  skus: z.array(
    z.object({
      title: z.string(),
      size: z.object({
        name: z.string(),
        id: z.string(),
      }),
      color: z.object({
        name: z.string(),
        id: z.string(),
      }),
      availableStock: z.number().default(0),
    })
  ),
});

export default productValidationSchema;
