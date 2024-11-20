import { usePdfMe } from "@/hooks/usePdfMe";
import { useTemplates } from "@/hooks/useTemplates";
import { useRef, useState } from "react";
import TemplatePicker from "./TemplatePicker";

export default function TemplateDesigner() {
  const designerDiv = useRef<HTMLDivElement | null>(null);
  const templateHook = useTemplates();

  const [templateGuid, setTemplateGuid] = useState<string | undefined>();
  const { onSaveTemplate, onLoadTemplate } = usePdfMe(designerDiv);

  if (templateGuid) {
    const template = templateHook.templateByGuid(templateGuid);

    if (template) {
      setTemplateGuid(undefined);
      onLoadTemplate(template);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="navbar z-40 bg-neutral">
        <div className="navbar-start">
          <TemplatePicker
            onTemplateSelect={async (templateGuid) => {
              console.log(templateGuid);
              setTemplateGuid(templateGuid);
            }}
          />
        </div>
        <div className="navbar-end">
          <button
            className="btn"
            onClick={() => {
              onSaveTemplate();
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
