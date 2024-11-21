import { NamedEntity } from "@/services/backendService/models";
import { usePdfMe } from "@/hooks/usePdfMe";
import { useTemplates } from "@/hooks/useTemplates";
import { useRef } from "react";
import TemplatePicker from "./TemplatePicker";
import useCache from "@/hooks/useCache";
import { selectedTemplateKey } from "./cacheKeys";

export default function TemplateDesigner() {
  const designerDiv = useRef<HTMLDivElement | null>(null);
  const templateHook = useTemplates();

  const [selectedTemplate, _] = useCache<NamedEntity>(selectedTemplateKey);

  const { onSaveTemplate, onLoadTemplate, onNewTemplate } =
    usePdfMe(designerDiv);

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
            onNewTemplate={() => onNewTemplate()}
          />
        </div>
        <div className="navbar-end">
        <button
            className="btn"
            onClick={() => {
              onSaveTemplate(selectedTemplate.name);
              templateHook.peekTemplates();
            }}
          >
            Download Template
          </button>
          <button
            className="btn"
            onClick={() => {
              onSaveTemplate(selectedTemplate.name);
              templateHook.peekTemplates();
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
      <div ref={designerDiv} />
    </div>
  );
}
