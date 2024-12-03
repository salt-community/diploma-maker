import { useTemplatePeeks } from "@/features/template-designer/template";
import { useModal } from "@/hooks";
import { Add01Icon, ArrowDown01Icon, PencilEdit01Icon } from "hugeicons-react";
import ManageTemplatesModal from "./ManageTemplatesModal";

type TemplatePickerProps = {
  selectedTemplateId?: string;
  onSetSelectedTemplateId: (id?: string) => void;
  onNewTemplate: () => void;
};

export default function TemplatePicker({
  selectedTemplateId,
  onSetSelectedTemplateId,
  onNewTemplate,
}: TemplatePickerProps) {
  const {
    isOpen: isManageModalOpen,
    open: openManageModal,
    close: closeManageModal,
  } = useModal();

  const { data: templatePeeks } = useTemplatePeeks();

  const renderTemplateItems = () =>
    templatePeeks?.map((template) =>
      template.guid != selectedTemplateId ? (
        <li key={template.guid}>
          <button onClick={() => onSetSelectedTemplateId(template.guid!)}>
            {template.name}
          </button>
        </li>
      ) : null,
    );

  const selectedTemplate = templatePeeks?.find(
    (t) => t.guid === selectedTemplateId,
  );

  return (
    <>
      <div className="dropdown dropdown-bottom">
        <div
          tabIndex={0}
          role="button"
          className="btn flex min-w-64 justify-start border-none bg-base-100 text-start"
        >
          <div className="flex-1">
            <span className="font-medium">Template</span>
            <p className="font-display text-base font-semibold">
              {selectedTemplate ? selectedTemplate.name : "Blank Template"}
            </p>
          </div>
          <ArrowDown01Icon size={18} />
        </div>
        <ul
          tabIndex={0}
          className="menu dropdown-content z-[1] w-full rounded-box bg-base-100 p-2 text-base shadow"
        >
          {renderTemplateItems()}
          <li className="pt-1">
            <button
              className="bg-primary text-primary-content hocus:bg-primary-focus"
              onClick={(e) => {
                onNewTemplate();
                (e.target as HTMLButtonElement).blur();
              }}
            >
              <Add01Icon size={16} />
              New Blank Template
            </button>
          </li>
          <li className="pt-1">
            <button
              className="bg-secondary text-secondary-content hocus:bg-secondary-focus"
              onClick={openManageModal}
            >
              <PencilEdit01Icon size={16} />
              Manage Templates
            </button>
          </li>
        </ul>
      </div>
      <ManageTemplatesModal
        isOpen={isManageModalOpen}
        onClose={closeManageModal}
      />
    </>
  );
}
