/*
    UseEntity

    Generic hook for working with CRUD entities on the backend.
*/

import { useMutation, useQuery } from "@tanstack/react-query";
import { ControllerName, Dto, Endpoints } from "../api";

interface Props {
    controller: ControllerName
}

export default function useEntity<TEntity extends Dto>({ controller }: Props) {
    const getAllQuery = useQuery({
        queryKey: [controller],
        queryFn: async () => await Endpoints.GetAll(controller) as TEntity[]
    });

    const getByGuidMutation = useMutation({
        mutationFn: async (guid: string) => await Endpoints.GetByGuid(controller, guid) as TEntity,
        onSuccess: (dto: TEntity) => {
            
        }
    });
}