import { Template } from "@pdfme/common";
import { useRef } from "react";
import { useDesigner } from "../hooks/useDesigner";

interface Props {
    template?: Template
}

export default function PdfMeDesigner({ template }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    useDesigner(containerRef, template);

    return (
        <>
            <div ref={containerRef}></div>
        </>
    );
}