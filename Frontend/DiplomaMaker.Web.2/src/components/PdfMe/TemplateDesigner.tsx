import { Template } from "@pdfme/common";
import { useRef } from "react";
import { usePdfMe } from "../../hooks/usePdfMe";

interface Props {
    template?: Template
}

export default function TemplateDesigner({ template }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const {
        onDownloadTemplate,
        onResetTemplate,
        handleLoadTemplate,
        onChangeBasePdf,
        generatePdf } = usePdfMe(containerRef, template);

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

    const GeneratePdfButton = (
        <button
            className=''
            onClick={() => {
                generatePdf([{ field1: 'substituted string' }]);
            }
            }>
            Generate Pdf
        </button >
    )

    const DesignerContainer = (
        <div ref={containerRef}></div>
    );

    return (
        <>
            {DownloadTemplateButton}
            {ResetTemplateButton}
            {GeneratePdfButton}
            {LoadTemplateInput}
            {ChangeBasePdfInput}
            {DesignerContainer}
        </>
    );
}