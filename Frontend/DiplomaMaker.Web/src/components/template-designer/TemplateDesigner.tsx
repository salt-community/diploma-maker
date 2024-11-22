import { useModal } from "@/hooks";
import { useTemplate, useUpdateTemplateMutation } from "@/hooks/template";
import { usePdfMe } from "@/hooks/usePdfMe";
import { useEffect, useRef, useState } from "react";
import Modal from "../Modal";
import TemplatePicker from "./TemplatePicker";
import NewTemplateModalContent from "./NewTemplateModalContent";

export default function TemplateDesigner() {
  const designerRef = useRef<HTMLDivElement | null>(null);

  const { getTemplateJson, loadTemplate } = usePdfMe(designerRef);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>();

  const { data: template } = useTemplate(selectedTemplateId!);

  const { mutate: updateTemplate } = useUpdateTemplateMutation();

  const {
    isOpen: isNewTemplateModalOpen,
    open: openNewTemplateModal,
    close: closeNewTemplateModal,
  } = useModal();

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

  const handleCreateTemplate = (name: string) => {
    // TODO: Create a new template
    console.log("Creating new template with name: ", name);
    closeNewTemplateModal();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="navbar z-40 bg-neutral">
        <div className="navbar-start">
          <TemplatePicker
            onNewTemplate={openNewTemplateModal}
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
      <Modal
        id="create-template-modal"
        title="Create Template"
        isOpen={isNewTemplateModalOpen}
        onClose={closeNewTemplateModal}
      >
        <NewTemplateModalContent
          onNewTemplate={handleCreateTemplate}
          onCancel={closeNewTemplateModal}
        />
      </Modal>
    </div>
  );
}
