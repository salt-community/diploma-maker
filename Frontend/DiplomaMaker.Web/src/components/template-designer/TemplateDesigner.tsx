import { useModal } from "@/hooks";
import {
  useCreateTemplateMutation,
  useTemplate,
  useUpdateTemplateMutation,
} from "@/hooks/template";
import { usePdfMe } from "@/hooks/usePdfMe";
import { useEffect, useRef, useState } from "react";
import Modal from "../Modal";
import SaveTemplateModalContent from "./SaveTemplateModalContent";
import TemplatePicker from "./TemplatePicker";

export default function TemplateDesigner() {
  const designerRef = useRef<HTMLDivElement | null>(null);

  const { getTemplateJson, loadTemplate, loadBlankTemplate } =
    usePdfMe(designerRef);

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
      <div className="navbar z-40 bg-neutral">
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
          <button
            className="btn"
            onClick={
              selectedTemplateId ? handleSaveTemplateChanges : openSaveModal
            }
          >
            {selectedTemplateId ? "Save Changes" : "Save Template"}
          </button>
        </div>
      </div>
      <div ref={designerRef} />
      <Modal
        id="save-template-modal"
        title="Save Template"
        isOpen={isSaveModalOpen}
        onClose={closeSaveModal}
      >
        <SaveTemplateModalContent
          onSave={handleSaveNewTemplate}
          onCancel={closeSaveModal}
        />
      </Modal>
    </div>
  );
}
