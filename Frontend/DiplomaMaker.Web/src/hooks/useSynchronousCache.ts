import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function useSynchronousCache<T>(cacheKey: string) {
    const client = useQueryClient();

    useQuery({
        queryKey: [cacheKey],
        queryFn: () => null as T | null
    });

    const get = () =>
        client.getQueryData([cacheKey]) as T | null;

    const set = (entity: T) =>
        client.setQueryData([cacheKey], entity);

    return {
        get,
        set
    };
}