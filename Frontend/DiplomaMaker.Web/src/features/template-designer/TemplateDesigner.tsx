import { useModal } from "@/hooks";

import {
  useCreateTemplateMutation,
  useTemplate,
  useUpdateTemplateMutation,
} from "@/features/template-designer/template";

import { usePdfMe } from "@/features/template-designer/usePdfMe";
import { BackendTypes, TemplateService } from "@/services";
import { FloppyDiskIcon } from "hugeicons-react";
import { useEffect, useRef, useState } from "react";
import SaveTemplateModal, { SAVE_TEMPLATE_MODAL_ID } from "./SaveTemplateModal";
import TemplatePicker from "./TemplatePicker";

export default function TemplateDesigner() {
  const designerRef = useRef<HTMLDivElement | null>(null);

  const { getTemplateJson, loadTemplate, loadBlankTemplate, downloadTemplate } =
    usePdfMe(designerRef);

  const [selectedTemplateId, setSelectedTemplateId] = useState<
    string | undefined
  >();

  const { data: template } = useTemplate(selectedTemplateId!);

  const { mutate: updateTemplate } = useUpdateTemplateMutation();
  const { mutate: createTemplate } = useCreateTemplateMutation((newTemplate) =>
    setSelectedTemplateId(newTemplate.guid),
  );

  const { open: openSaveModal, close: closeSaveModal } = useModal(
    SAVE_TEMPLATE_MODAL_ID,
  );

  useEffect(() => {
    if (template) {
      loadTemplate(template);
    }
  }, [template]);

  const handleSaveTemplateChanges = () =>
    updateTemplate({
      guid: template!.guid,
      name: template!.name,
      templateJson: getTemplateJson(),
    });

  const handleSaveNewTemplate = (name: string) => {
    createTemplate({
      name,
      templateJson: getTemplateJson(),
    });
    closeSaveModal();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="navbar z-40 h-16 bg-neutral px-4">
        <div className="navbar-start">
          <TemplatePicker
            selectedTemplateId={selectedTemplateId}
            onSetSelectedTemplateId={setSelectedTemplateId}
            onNewTemplate={() => {
              loadBlankTemplate();
              setSelectedTemplateId(undefined);
            }}
          />
        </div>
        <div className="navbar-end">
          <button className="btn" onClick={() => downloadTemplate()}>
            Download Template
          </button>

          <label className="form-control w-full max-w-xs p-4">
            <input
              className="file-input file-input-bordered w-full max-w-xs"
              type="file"
              accept="application/json"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                const template = await TemplateService.getTemplateFromJsonFile(
                  file!,
                );
                loadTemplate({
                  name: "...",
                  templateJson: JSON.stringify(template),
                } as BackendTypes.Template);
              }}
            />
          </label>

          <button
            className="btn btn-primary"
            onClick={
              selectedTemplateId ? handleSaveTemplateChanges : openSaveModal
            }
          >
            <FloppyDiskIcon size={24} />
            {selectedTemplateId ? "Save Changes" : "Save Template"}
          </button>
        </div>
      </div>
      <div className="flex-1 bg-neutral pl-4">
        <div
          ref={designerRef}
          className="h-full [&>*:first-child]:!bg-base-100"
        />
      </div>
      <SaveTemplateModal
        onSave={handleSaveNewTemplate}
        onCancel={closeSaveModal}
      />
    </div>
  );
}
