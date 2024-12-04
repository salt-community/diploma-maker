import { ArrowDown01Icon } from "hugeicons-react";

import { BackendTypes } from "@/services";
import { useTemplates, useCache } from "@/hooks";

import { currentTemplateKey, selectedTemplateKey } from "./cacheKeys";
import { useEffect } from "react";

type Props = {};

export default function TemplatePicker({}: Props) {
  const { templatePeeks, templateByGuid } = useTemplates();
  const [selectedTemplate, setSelectedTemplate] =
    useCache<BackendTypes.NamedEntity>(selectedTemplateKey);
  const [currentTemplate, setCurrentTemplate] =
    useCache<BackendTypes.Template>(currentTemplateKey);

  updateCurrentTemplateBySelectedTemplate();

  useEffect(() => {
    if (!templatePeeks) return;

    if (!selectedTemplate && templatePeeks.length > 0) {
      setSelectedTemplate(templatePeeks[0]);
    }
  }, [templatePeeks]);

  function updateCurrentTemplateBySelectedTemplate() {
    if (!selectedTemplate?.guid) return;

    const template = templateByGuid(selectedTemplate.guid);
    if (!template) return;

    if (!currentTemplate || currentTemplate.guid != selectedTemplate.guid) {
      setCurrentTemplate(template);
    }
  }

  const handleSelectTemplate = (template: BackendTypes.NamedEntity) => {
    setSelectedTemplate(template);
    templateByGuid(template.guid!);
  };

  const renderSelectItems = () => {
    if (!templatePeeks) return;

    return templatePeeks.map((nameGuid) => (
      <li key={nameGuid.guid}>
        <button
          className={`${selectedTemplate?.guid == nameGuid.guid && "bg-[#042d451a]"}`}
          onClick={() => handleSelectTemplate(nameGuid!)}
        >
          {nameGuid.name}
        </button>
      </li>
    ));
  };

  return (
    <div className="text-center">
      <p className="mb-4 font-display text-lg font-medium">Diploma Template</p>
      <div className="dropdown dropdown-bottom">
        <div
          tabIndex={0}
          role="button"
          className="btn flex min-w-80 items-center justify-start border-none bg-neutral text-start"
        >
          <div className="flex-1">
            <p className="m-0 font-display text-base font-semibold">
              {selectedTemplate ? selectedTemplate.name : "Select a template"}
            </p>
          </div>
          <ArrowDown01Icon size={18} />
        </div>
        <ul
          tabIndex={0}
          className="menu dropdown-content z-[1] mt-2 w-full rounded-box bg-neutral p-2 text-base shadow"
        >
          {renderSelectItems()}
        </ul>
      </div>
    </div>
  );
}
