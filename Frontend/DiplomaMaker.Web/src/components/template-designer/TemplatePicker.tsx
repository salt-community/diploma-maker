import { Link } from "@tanstack/react-router";
import { Add01Icon, ArrowDown01Icon, PencilEdit01Icon } from "hugeicons-react";
import { useState } from "react";
import { useTemplates } from "@/hooks/useTemplates";
import { NamedEntity } from "@/api/models";

type TemplatePickerProps = {
  onTemplateSelect: (templateGuid: string) => void;
};

export default function TemplatePicker({
  onTemplateSelect,
}: TemplatePickerProps) {
  const { templatePeeks } = useTemplates();

  const [selectedTemplate, setSelectedTemplate] = useState<NamedEntity | null>(null);

  const handleSelectTemplate = (templatePeek: NamedEntity) => {
    onTemplateSelect(templatePeek.guid!);
    setSelectedTemplate(templatePeek);
  };

  const renderSelectItems = () => {
    if (!templatePeeks)
      return <></>

    return templatePeeks.map(
      (nameGuid) =>
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
        className="menu dropdown-content z-[1] w-full rounded-box bg-base-100 p-2 text-base shadow"
      >
        {renderSelectItems()}
        <li className="pt-1">
          <button className="bg-primary text-primary-content hocus:bg-primary-focus">
            <Add01Icon size={16} />
            Create new Template
          </button>
        </li>
        <li className="pt-1">
          <Link
            to="/"
            className="bg-secondary text-secondary-content hocus:bg-secondary-focus"
          >
            <PencilEdit01Icon size={16} />
            Manage Templates
          </Link>
        </li>
      </ul>
    </div>
  );
}
