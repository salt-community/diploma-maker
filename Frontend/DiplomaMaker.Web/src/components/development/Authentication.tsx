import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";

export default function Authentication() {
    const auth = useAuth();

    const query = useQuery({
        queryKey: ["token"],
        queryFn: async () => await auth.getToken()
    });

    const test = async () => {
        if (!query.data) {
            console.error("No token");
            return;
        }

        await testEndpoint(query.data);
    }

    return (
        <>
            <p>Authentication</p>
            <button className="btn" onClick={() => test()}>Test Endpoint</button>
        </>
    );
}

export async function testEndpoint(jwt: string) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/Email/SendDiplomaEmail`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${jwt}` }
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
}