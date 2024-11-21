import { NamedEntity } from "@/services/backendService/models";
import { usePdfMe } from "@/hooks/usePdfMe";
import { useTemplates } from "@/hooks/useTemplates";
import { useRef } from "react";
import useCache from "@/hooks/useCache";
import TemplatePicker from "./TemplatePicker";
import { selectedTemplateDiplomaKey } from "./cacheKeys";
import { DropJson } from "./DropJson";

export default function DiplomaGenerator() {
    const templateHook = useTemplates();

    const [selectedTemplate, _] = useCache<NamedEntity>(selectedTemplateDiplomaKey);


    if (selectedTemplate?.guid) {
        const templateWithContent = templateHook.templateByGuid(selectedTemplate?.guid);
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
        </div>
    );
}
