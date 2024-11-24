import { useEffect, useRef } from "react";

import { PdfMeTypes, TemplateTypes } from "@/services";
import { usePdfMeViewer } from "./usePdfMeViewer";

interface Props {
    template: PdfMeTypes.Template,
    substitions: TemplateTypes.Substitions
}

export default function PreviewDiplomaViewer({ template, substitions }: Props) {
    const diplomaViewerRef = useRef<HTMLDivElement | null>(null);
    const { loadViewer } = usePdfMeViewer();

    useEffect(() => {
        if (diplomaViewerRef.current) {
            loadViewer(diplomaViewerRef.current, template, substitions);
        }
    }, [diplomaViewerRef]);

    return (<div ref={diplomaViewerRef} />);
}