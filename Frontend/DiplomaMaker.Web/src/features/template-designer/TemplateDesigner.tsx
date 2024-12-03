import { useModal } from "@/hooks";

import {
  useCreateTemplateMutation,
  useTemplate,
  useUpdateTemplateMutation,
} from "@/features/template-designer/template";

import { usePdfMe } from "@/features/template-designer/usePdfMe";
import { FloppyDiskIcon, Pdf01Icon, TextFontIcon } from "hugeicons-react";
import { useEffect, useRef, useState } from "react";
import SaveTemplateModal from "./SaveTemplateModal";
import TemplatePicker from "./TemplatePicker";
import ManageFontsModal from "./font-manager/ManageFontsModal";

export default function TemplateDesigner() {
  const designerRef = useRef<HTMLDivElement | null>(null);

  const {
    getTemplateJson,
    loadTemplate,
    loadBlankTemplate,
    loadBasePDF,
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

  const {
    isOpen: isSaveModalOpen,
    open: openSaveModal,
    close: closeSaveModal,
  } = useModal();

  const {
    isOpen: isFontModalOpen,
    open: openFontModal,
    close: closeFontModal,
  } = useModal();

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
      <div className="navbar z-40 h-[80px] bg-neutral px-[20px] shadow-sm">
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
          <div className="flex gap-4">
            <button className="btn btn-ghost" onClick={openFontModal}>
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
      <div className="flex-1 bg-neutral pl-4 pr-1">
        <div
          ref={designerRef}
          className="h-full [&>*:first-child]:!bg-base-100"
        />
      </div>
      <SaveTemplateModal
        isOpen={isSaveModalOpen}
        onSave={handleSaveNewTemplate}
        onClose={closeSaveModal}
      />
      <ManageFontsModal
        isOpen={isFontModalOpen}
        onClose={() => {
          closeFontModal();
          reloadFonts();
        }}
      />
    </div>
  );
}
