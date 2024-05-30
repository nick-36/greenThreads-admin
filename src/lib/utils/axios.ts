import axios from "axios";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export default axios.create({
  timeout: 30000,
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
});

export const axiosPrivate = axios.create({
  timeout: 30000,
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
  // withCredentials: true,
});
export const withAuthorization = () => {
  return async (endpoint: string) => {
    try {
      const { userId, getToken } = auth();
      const sessionToken = await getToken();

      if (!userId || !sessionToken) {
        redirect("/sign-in");
      }

      const res = await axiosPrivate.get(endpoint, {
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
      console.error("Error fetching data:", error);
      return [];
    }
  };
};
