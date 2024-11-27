import { useModal } from "@/hooks";

import {
  useCreateTemplateMutation,
  useTemplate,
  useUpdateTemplateMutation,
} from "@/features/template-designer/template";

import { usePdfMe } from "@/features/template-designer/usePdfMe";
import { FloppyDiskIcon, Pdf01Icon, TextFontIcon } from "hugeicons-react";
import { useEffect, useRef, useState } from "react";
import SaveTemplateModal, { SAVE_TEMPLATE_MODAL_ID } from "./SaveTemplateModal";
import TemplatePicker from "./TemplatePicker";
import ManageFontsModal, {
  MANAGE_FONTS_MODAL_ID,
} from "./font-manager/ManageFontsModal";

export default function TemplateDesigner() {
  const designerRef = useRef<HTMLDivElement | null>(null);

  const {
    getTemplateJson,
    loadTemplate,
    loadBlankTemplate,
    loadBasePDF,
    downloadTemplate,
    reloadFonts,
  } = usePdfMe(designerRef);

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
  const { open: openFontsModal, close: closeFontsModal } = useModal(
    MANAGE_FONTS_MODAL_ID,
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

  const handleLoadBasePDF = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadBasePDF(file);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="navbar z-40 h-[80px] bg-neutral px-4 shadow-sm">
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
          {/* <button className="btn" onClick={() => downloadTemplate()}>
            Download Template
          </button> */}

          {/* <label className="form-control w-full max-w-xs p-4">
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
          </label> */}
          <div className="flex gap-4">
            <button className="btn btn-ghost" onClick={openFontsModal}>
              <TextFontIcon size={24} />
              Get Fonts
            </button>
            <label className="btn btn-ghost">
              <Pdf01Icon size={24} />
              Upload Base PDF
              <input
                className="hidden"
                type="file"
                accept="application/pdf"
                onChange={handleLoadBasePDF}
              />
            </label>
          </div>
          <div className="divider divider-horizontal"></div>
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
      <ManageFontsModal onReloadFonts={reloadFonts} />
    </div>
  );
}
