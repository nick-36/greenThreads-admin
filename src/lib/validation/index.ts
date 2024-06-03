import { z } from "zod";

export const searchParamsSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});
export const getSellersSchema = searchParamsSchema;

export type SearchParamsSchema = z.infer<typeof searchParamsSchema>;

export type GetSellersSchema = z.infer<typeof getSellersSchema>;

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
