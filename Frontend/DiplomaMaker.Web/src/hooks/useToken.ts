import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";

export function useToken() {
  const auth = useAuth();

  const query = useQuery({
    queryKey: ["token"],
    queryFn: async () => await auth.getToken(),
  });

  return {
    token: query.data,
  };
}
