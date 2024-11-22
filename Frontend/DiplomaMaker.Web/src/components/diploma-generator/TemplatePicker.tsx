import { ArrowDown01Icon } from "hugeicons-react";

import { BackendTypes } from "@/services";
import { useTemplates, useCache } from "@/hooks";

import { selectedTemplateDiplomaKey } from "./cacheKeys";

type TemplatePickerProps = {
    onTemplateSelect: () => void;
};

export default function TemplatePicker({
    onTemplateSelect,
}: TemplatePickerProps) {
    const { templatePeeks } = useTemplates();
    const [selectedTemplate, setSelectedTemplate] = useCache<BackendTypes.NamedEntity>(selectedTemplateDiplomaKey);

    const handleSelectTemplate = (template: BackendTypes.NamedEntity) => {
        onTemplateSelect();
        setSelectedTemplate(template);
    };

    const renderSelectItems = () => {
        if (!templatePeeks) return;

        return templatePeeks
            .map(nameGuid =>
                nameGuid.guid !== selectedTemplate?.guid && (
                    <li key={nameGuid.guid}>
                        <button onClick={() => handleSelectTemplate(nameGuid!)}>
                            {nameGuid.name}
                        </button>
                    </li>
                ),
            );
    };

    return (
        <>
            <div className="dropdown dropdown-bottom">
                <div
                    tabIndex={0}
                    role="button"
                    className="btn m-1 flex min-w-64 justify-start border-none bg-base-100 text-start"
                >
                    <div className="flex-1">
                        <span className="font-medium">Template</span>
                        <p className="font-display text-base font-semibold">
                            {selectedTemplate ? selectedTemplate.name : "Select a template"}
                        </p>
                    </div>
                    <ArrowDown01Icon size={18} />
                </div>

                <ul
                    tabIndex={0}
                    className="menu dropdown-content z-[1] w-full rounded-box bg-base-100 p-2 text-base shadow">
                    {renderSelectItems()}
                </ul>
            </div>
        </>
    );
}
