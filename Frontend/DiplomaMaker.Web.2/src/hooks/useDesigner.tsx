import { BLANK_PDF, Template } from "@pdfme/common";
import { Designer } from "@pdfme/ui";
import { text, barcodes, image } from "@pdfme/schemas"
import { useEffect, useRef } from "react";

export function useDesigner(
    containerRef: React.MutableRefObject<HTMLDivElement | null>,
    template?: Template
) {
    const designer = useRef<Designer | null>(null);
    const defaultTemplate: Template = { basePdf: BLANK_PDF, schemas: [[]] };

    useEffect(() => {
        if (containerRef) {
            const plugins = {
                Text: text,
                QR: barcodes.qrcode,
                Image: image,
            };

            const domContainer = containerRef.current;

            if (domContainer)
                designer.current = new Designer({
                    domContainer, template: template ?? defaultTemplate, plugins
                });
        }
    });

    return {
        designer: designer.current
    }
}