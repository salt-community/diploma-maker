/*
    TemplateDesigner

    A component that instantiates the UI for interacting 
    with PdfMe Templates.
*/

import { useRef } from "react";
import { usePdfMe } from "../hooks/usePdfMe";
import { PdfMeTypes } from "../services";

interface Props {
    template?: PdfMeTypes.Template
}

export default function TemplateDesigner({ template }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const {
        onDownloadTemplate,
        onResetTemplate,
        handleLoadTemplate,
        onChangeBasePdf,
    } = usePdfMe(containerRef, template);

    const DownloadTemplateButton = (
        <button
            className='btn'
            onClick={onDownloadTemplate}>
            Download Template
        </button>
    );

    const ResetTemplateButton = (
        <button
            className=''
            onClick={onResetTemplate}>
            Reset Template
        </button>
    );

    const LoadTemplateInput = (
        <input
            className=''
            type="file"
            accept="application/json"
            onChange={handleLoadTemplate} />
    );

    const ChangeBasePdfInput = (
        <input
            className=''
            type="file"
            accept="application/pdf"
            onChange={onChangeBasePdf} />
    );

    const DesignerContainer = (
        <div ref={containerRef}></div>
    );

    return (
        <>
            {DownloadTemplateButton}
            {ResetTemplateButton}
            {LoadTemplateInput}
            {ChangeBasePdfInput}
            {DesignerContainer}
        </>
    );
}