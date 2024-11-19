import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";

export default function Authentication() {
    const auth = useAuth();

    const query = useQuery({
        queryKey: ["token"],
        queryFn: async () => await auth.getToken()
    });

    const userReturn = useUser();
    const clerk = useClerk();

    auth.getToken();

    console.log(userReturn);

    const test = async () => {
        if (!query.data) {
            console.error("No token");
            return;
        }

        console.log(`Testing with token ${query.data}`);

        await testEndpoint(query.data);
    }

    return (
        <>
            <p>Authentication</p>
            <button className="btn" onClick={() => test()}>Test Endpoint</button>
        </>
    );
}

export async function testEndpoint(token: string) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/Email/Test`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${""}` }
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
}