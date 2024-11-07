import { Template } from "@pdfme/common";
import { useRef } from "react";
import { useDesigner } from "../../hooks/useDesigner";

export default function Designer(template?: Template) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    useDesigner(containerRef, template);

    return (
        <div ref={containerRef}></div>
    );
}