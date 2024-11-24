import { useEffect, useRef } from "react";

import { DiplomaService } from '@/services';
import { usePdfMeViewer } from "./usePdfMeViewer";
import { useHistoricDiploma } from "./useHistoricDiploma";

interface Props {
    diplomaGuid: string,
}

export default function HistoricDiplomaViewer({ diplomaGuid }: Props) {
    const diplomaViewerRef = useRef<HTMLDivElement | null>(null);
    const { getHistoricDiploma } = useHistoricDiploma();
    const { loadViewer } = usePdfMeViewer();

    useEffect(() => {
        const historicDiploma = getHistoricDiploma(diplomaGuid);

        if (!historicDiploma) return;

        const [template, substitions] = DiplomaService
            .historicDiplomaToTemplateAndSubstitutions(historicDiploma);

        if (!diplomaViewerRef.current)
            return;

        loadViewer(diplomaViewerRef.current, template, substitions);
    });

    return (<div ref={diplomaViewerRef} />);
}