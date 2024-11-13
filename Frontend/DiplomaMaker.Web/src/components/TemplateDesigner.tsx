/*
    TemplateDesigner

    A component that instantiates the UI for interacting 
    with PdfMe Templates.
*/

import { useRef } from "react";
import { usePdfMe } from "../hooks/usePdfMe";
import { PdfMeTypes } from "../services";
import { useFontManager } from "../hooks/useFontManger";

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
        handleReloadFonts,
    } = usePdfMe(containerRef, template);

    const {
        openFontManager,
        FontManagerComponent } = useFontManager();

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

    const OpenFontManagerButton = (
        <button className="btn" onClick={openFontManager}>Manage Fonts</button>
    );

    const FontManager = (
        <FontManagerComponent onReloadFonts={handleReloadFonts} />
    );

    return (
        <>
            {OpenFontManagerButton}
            {DownloadTemplateButton}
            {ResetTemplateButton}
            {LoadTemplateInput}
            {ChangeBasePdfInput}
            {DesignerContainer}
            {FontManager}
        </>
    );
}