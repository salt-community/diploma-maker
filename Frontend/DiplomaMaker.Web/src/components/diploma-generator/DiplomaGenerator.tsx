import { NamedEntity } from "@/services/backendService/models";
import { useTemplates } from "@/hooks/useTemplates";
import useCache from "@/hooks/useCache";
import TemplatePicker from "./TemplatePicker";
import { selectedTemplateDiplomaKey } from "./cacheKeys";
import { DropJson } from "./DropJson";
import { usePdfMeViewer } from "@/hooks/usePdfMeViewer";
import { useRef } from "react";

export default function DiplomaGenerator() {
    const viewerContainerRef = useRef<HTMLDivElement | null>(null);
    const templateHook = useTemplates();

    const [selectedTemplate, _] = useCache<NamedEntity>(selectedTemplateDiplomaKey);
    const {
        generatePdf,
        handleLoadTemplate,
        onResetTemplate,
        handleReloadFonts,
        onNewTemplate,
        onLoadTemplate,
    } = usePdfMeViewer(viewerContainerRef);

    if (selectedTemplate?.guid) {
        const templateWithContent = templateHook.templateByGuid(selectedTemplate?.guid);
        if (templateWithContent) {
            onLoadTemplate(templateWithContent);
        }
    }

    return (
        <div className="flex h-full flex-col">
            <div className="navbar z-40 bg-neutral">
                <div className="navbar-start">
                    <TemplatePicker
                        onTemplateSelect={() => console.log("Selected template")}
                    />
                </div>

                <div className="navbar-end">
                    <DropJson />
                </div>
            </div>
            <div ref={viewerContainerRef} />
        </div>
    );
}
