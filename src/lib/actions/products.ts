import axios, { withAuthorization } from "@/lib/utils/axios";
const fetchWithAuthorization = withAuthorization();

export const fetchAllProducts = async () => {
  const products = await fetchWithAuthorization("/products");
  return products;
};
