import { usePdfMe } from "@/hooks/usePdfMe";
import { useEffect, useRef, useState } from "react";
import TemplatePicker from "./TemplatePicker";
import { useTemplate, useUpdateTemplateMutation } from "@/hooks/template";

export default function TemplateDesigner() {
  const designerRef = useRef<HTMLDivElement | null>(null);

  const { getTemplateJson, loadTemplate } = usePdfMe(designerRef);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>();

  const { data: template } = useTemplate(selectedTemplateId!);

  const { mutate: updateTemplate } = useUpdateTemplateMutation();

  useEffect(() => {
    if (template) {
      loadTemplate(template);
    }
  }, [template]);

  const handleSaveTemplate = () =>
    updateTemplate({
      guid: template!.guid,
      name: template!.name,
      templateJson: getTemplateJson(),
    });

  return (
    <div className="flex h-full flex-col">
      <div className="navbar z-40 bg-neutral">
        <div className="navbar-start">
          <TemplatePicker
            onNewTemplate={() => {}}
            onTemplateSelected={setSelectedTemplateId}
          />
        </div>
        <div className="navbar-end">
          <button
            className="btn"
            onClick={handleSaveTemplate}
            disabled={!template}
          >
            Save Changes
          </button>
        </div>
      </div>
      <div ref={designerRef} />
    </div>
  );
}
