import { getTasks } from "@/lib/api-calls";
import { useQuery } from "@tanstack/react-query";

export const useTaskQuery = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    refetchOnMount: false,
  });
};
