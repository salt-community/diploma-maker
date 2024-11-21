import { NamedEntity, Template } from "@/services/backendService/models";
import { usePdfMe } from "@/hooks/usePdfMe";
import { useTemplates } from "@/hooks/useTemplates";
import { useRef } from "react";
import TemplatePicker from "./TemplatePicker";
import useCache from "@/hooks/useCache";
import { selectedTemplateKey } from "./cacheKeys";
import { UploadJson } from "../diploma-generator/UploadJson";
import { FileService, TemplateService } from "@/services";

export default function TemplateDesigner() {
  const designerDiv = useRef<HTMLDivElement | null>(null);
  const templateHook = useTemplates();

  const [selectedTemplate, _] = useCache<NamedEntity>(selectedTemplateKey);

  const { onSaveTemplate, onLoadTemplate, onNewTemplate, generatePdf, downloadTemplate } =
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
            onClick={() => downloadTemplate()}
          >
            Download Template
          </button>

          <label className="p-4 form-control w-full max-w-xs">
            <input
              className="file-input file-input-bordered w-full max-w-xs"
              type="file"
              accept="application/json"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                const template = await TemplateService.getTemplateFromJsonFile(file!);
                onLoadTemplate({
                  name: "...",
                  templateJson: JSON.stringify(template)
                } as Template);
                onSaveTemplate(file!.name);
              }} />
          </label>

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
