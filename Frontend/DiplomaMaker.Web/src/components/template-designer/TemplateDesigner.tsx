import { NamedEntity } from "@/api/models";
import { usePdfMe } from "@/hooks/usePdfMe";
import { useTemplates } from "@/hooks/useTemplates";
import { useRef, useState } from "react";
import TemplatePicker from "./TemplatePicker";

export default function TemplateDesigner() {
  const designerDiv = useRef<HTMLDivElement | null>(null);
  const templateHook = useTemplates();

  const [template, setTemplate] = useState<NamedEntity | undefined>();

  const { onSaveTemplate, onLoadTemplate, onNewTemplate } =
    usePdfMe(designerDiv);

  if (template?.guid) {
    const templateWithContent = templateHook.templateByGuid(template.guid);

    if (templateWithContent) {
      setTemplate({
        name: "Default Template",
      });
      onLoadTemplate(templateWithContent);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="navbar z-40 bg-neutral">
        <div className="navbar-start">
          <TemplatePicker
            onTemplateSelect={async (template) => {
              console.log(template);
              setTemplate(template);
            }}
            onNewTemplate={(template: NamedEntity) => {
              console.log(template);
              setTemplate(template);
              onNewTemplate();
            }}
          />
        </div>
        <div className="navbar-end">
          <button
            className="btn"
            onClick={() => {
              onSaveTemplate(template!.name);
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
