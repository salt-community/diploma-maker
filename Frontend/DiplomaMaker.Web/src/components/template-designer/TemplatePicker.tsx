import { Link } from "@tanstack/react-router";
import { Add01Icon, ArrowDown01Icon, PencilEdit01Icon } from "hugeicons-react";
import { useTemplates } from "@/hooks/useTemplates";
import { NamedEntity } from "@/services/backendService/models";
import { useModal } from "@/hooks/useModal";
import NewTemplateModal from "./NewTemplateModal";
import useCache from "@/hooks/useCache";
import { selectedTemplateKey } from "./cacheKeys";

type TemplatePickerProps = {
  onTemplateSelect: () => void;
  onNewTemplate: () => void;
};

export default function TemplatePicker({
  onTemplateSelect,
  onNewTemplate,
}: TemplatePickerProps) {
  const { templatePeeks } = useTemplates();
  const { openModal } = useModal(import.meta.env.VITE_NEW_TEMPLATE_MODAL_ID);
  const [selectedTemplate, setSelectedTemplate] = useCache<NamedEntity>(selectedTemplateKey);

  const handleSelectTemplate = (template: NamedEntity) => {
    onTemplateSelect();
    setSelectedTemplate(template);
  };

  const renderSelectItems = () => {
    if (!templatePeeks) return <></>;

    return templatePeeks
      .filter(template => selectedTemplate ? template.name != selectedTemplate.name : true)
      .map(nameGuid =>
        nameGuid.guid !== selectedTemplate?.guid && (
          <li key={nameGuid.guid}>
            <button onClick={() => handleSelectTemplate(nameGuid!)}>
              {nameGuid.name}
            </button>
          </li>
        ),
      );
  };

  return (
    <div className="dropdown dropdown-bottom">
      <div
        tabIndex={0}
        role="button"
        className="btn m-1 flex min-w-64 justify-start border-none bg-base-100 text-start"
      >
        <div className="flex-1">
          <span className="font-medium">Template</span>
          <p className="font-display text-base font-semibold">
            {selectedTemplate ? selectedTemplate.name : "Select a template"}
          </p>
        </div>
        <ArrowDown01Icon size={18} />
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-[1] w-full rounded-box bg-base-100 p-2 text-base shadow">
        {renderSelectItems()}
        <li className="pt-1">
          <button
            className="bg-primary text-primary-content hocus:bg-primary-focus"
            onClick={() => openModal()}>
            <Add01Icon size={16} />
            Create new Template
          </button>
        </li>
        <li className="pt-1">
          <Link
            to="/"
            className="bg-secondary text-secondary-content hocus:bg-secondary-focus">
            <PencilEdit01Icon size={16} />
            Manage Templates
          </Link>
        </li>
      </ul>
      <NewTemplateModal onCreateNewTemplate={onNewTemplate} />
    </div>
  );
}
