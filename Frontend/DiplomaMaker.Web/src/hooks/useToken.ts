import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";

export default function useToken() {
  const auth = useAuth();

  const query = useQuery({
    queryKey: ["token"],
    queryFn: async () => await auth.getToken(),
  });

  return {
    token: query.data,
  };
}

// export async function testEndpoint(jwt: string) {
//   const response = await fetch(
//     `${import.meta.env.VITE_BACKEND_BASE_URL}/Email/SendDiplomaEmail`,
//     {
//       method: "POST",
//       headers: { Authorization: `Bearer ${jwt}` },
//     },
//   );

//   if (!response.ok) {
//     throw new Error(`Response status: ${response.status}`);
//   }
// }
