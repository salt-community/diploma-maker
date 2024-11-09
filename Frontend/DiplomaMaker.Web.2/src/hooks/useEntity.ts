/*
    UseEntity

    Generic hook for working with CRUD entities on the backend.
*/

import { useMutation, useQuery } from "@tanstack/react-query";
import { ControllerName, Endpoints } from "../api";

interface Props {
    controller: ControllerName
}

export default function useEntity({ controller }: Props) {
    const getAllQuery = useQuery({
        queryKey: [controller],
        queryFn: async () => await Endpoints.GetAll(controller)
    });

    const getByGuidMutation = useMutation({
        mutationFn: async (variables) => await Endpoints.GetByGuid(controller)
    });
}