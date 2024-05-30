import axios from "@/lib/utils/axios";

const useRefreshToken = () => {
  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });
    if (response) {
      sessionStorage.setItem("accessToken", JSON.stringify(response));
    }
    return response;
  };
  return refresh;
};

export default useRefreshToken;
