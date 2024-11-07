import { Template } from "@pdfme/common";
import { useRef } from "react";
import { useDesigner } from "../../hooks/useDesigner";

interface Props {
    template?: Template
}

export default function Designer({ template }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { designer } = useDesigner(containerRef, template);

    designer?.onChangeTemplate((temp) => {
        console.log(designer.getTemplate());
        console.log("Change callback");
    });
    designer?.onSaveTemplate((temp) => {
        console.log(designer.getTemplate());
        console.log("Save callback");
    });

    const currentTemplate = designer ? designer.getTemplate() : template;

    return (
        <>
            <button className='btn' onClick={() => {
                designer?.updateTemplate(designer.getTemplate());
                designer?.saveTemplate();
                console.log(designer != null);
                console.log(currentTemplate);
                console.log("Save");
            }}>Save</button>

            <button className='btn' onClick={() => {
                console.log(designer != null);
                console.log("Print");
            }}>Print</button>
            <div ref={containerRef}></div>
        </>
    );
}