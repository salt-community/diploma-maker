import { useRef } from "react";

import { TemplateService } from "@/services";
import type { BackendTypes } from "@/services";
import { usePdfMe, useTemplates, useCache } from "@/hooks";

import { selectedTemplateKey } from "./cacheKeys";
import TemplatePicker from "./TemplatePicker";

export default function TemplateDesigner() {
  const designerDiv = useRef<HTMLDivElement | null>(null);
  const templateHook = useTemplates();

  const [selectedTemplate, _] = useCache<BackendTypes.NamedEntity>(selectedTemplateKey);

  const { onSaveTemplate, onLoadTemplate, onNewTemplate, downloadTemplate } =
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
                } as BackendTypes.Template);
                onSaveTemplate(file!.name);
              }} />
          </label>

          <button
            className="btn"
            onClick={() => {
              if (!selectedTemplate)
                throw new Error("Selected template is undefined");

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
