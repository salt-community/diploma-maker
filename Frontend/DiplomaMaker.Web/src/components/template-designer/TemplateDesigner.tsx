import useEntity from "@/hooks/useEntity";
import TemplatePicker from "./TemplatePicker";
import { Template } from "@/api/models";
import { usePdfMe } from "@/hooks/usePdfMe";
import { useRef, useState } from "react";

export default function TemplateDesigner() {
  const designerDiv = useRef<HTMLDivElement | null>(null)
  const templateHook = useEntity<Template>("Template");

  const [templateGuid, setTemplateGuid] = useState<string | undefined>();
  const { onSaveTemplate, onLoadTemplate } = usePdfMe(designerDiv);


  if (templateGuid) {
    const template = templateHook.entityByGuid(templateGuid);

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
          <button className="btn"
            onClick={onSaveTemplate}>
            Save Changes
          </button>
        </div>
      </div>
      <div ref={designerDiv} />
    </div>
  );
}
