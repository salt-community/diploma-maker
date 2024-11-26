import { useEffect, useRef } from "react";

import { DiplomaService } from '@/services';
import { usePdfMeViewer } from "./usePdfMeViewer";
import { useHistoricDiploma } from "./useHistoricDiploma";

interface Props {
    diplomaGuid: string,
    className?: string
}

export default function HistoricDiplomaViewer({ diplomaGuid, className }: Props) {
    const diplomaViewerRef = useRef<HTMLDivElement | null>(null);
    const { historicDiploma, status } = useHistoricDiploma(diplomaGuid);
    const { loadViewer } = usePdfMeViewer();

    useEffect(() => {
        if (!historicDiploma)
            return;

        const [template, substitions] = DiplomaService
            .historicDiplomaToTemplateAndSubstitutions(historicDiploma);

        if (!diplomaViewerRef.current)
            return;

        loadViewer(diplomaViewerRef.current, template, substitions);
    });

    return (<>
        {historicDiploma && <div ref={diplomaViewerRef} className={className} />}
        {!historicDiploma && status == 'pending' && <span className="loading loading-spinner loading-lg"></span>}
        {!historicDiploma && status == 'error' && <p>Could not find diploma :/</p>}
    </>);
}