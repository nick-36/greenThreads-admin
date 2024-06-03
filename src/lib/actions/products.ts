import "server-only";

import axios, { withAuthorization } from "@/lib/utils/axios";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { type GetSellersSchema } from "@/lib/validation";
import { axiosPrivate } from "@/lib/utils/axios";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const fetchWithAuthorization = withAuthorization();

export const fetchAllProducts = async () => {
  const products = await fetchWithAuthorization("/products");
  return products;
};

export async function getSellerList(input: GetSellersSchema) {
  noStore();
  const { page, sort, search } = input;

  const { userId, getToken } = auth();
  const sessionToken = await getToken();

  try {
    if (!userId || !sessionToken) {
      redirect("/sign-in");
    }

    const res = await axiosPrivate.get("/admin/sellers/get-all", {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
      params: {
        page,
        sort,
        search: search,
      },
    });
    if (res.data?.success) {
      return res.data;
    } else {
      console.error("Failed to fetch data");
      return [];
    }
  } catch (err) {
    return { data: [], pageCount: 0 };
  }
}
