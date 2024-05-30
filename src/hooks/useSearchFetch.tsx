import { useQuery } from "@tanstack/react-query";

const useSearchFetch = (searchApi: string) => {
  const {
    data: results = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["search", searchApi],
    queryFn: async () => {
      try {
        const response = await fetch(searchApi);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      } catch (error) {
        console.log(error);
      }
    },
  });

  return { results, isLoading, isError };
};
export default useSearchFetch;
