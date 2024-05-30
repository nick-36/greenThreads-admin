export interface Category {
  id: string;
  name: string;
  description: string;
  categoryImg: string | null;
  categorySlug: string | null;
  parentId: string | null;
  productsCount: number;
  createdAt: string;
  updatedAt: string | null;
}

export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
