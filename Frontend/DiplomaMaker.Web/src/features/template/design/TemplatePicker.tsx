import { Link } from "@tanstack/react-router";
import { Add01Icon, ArrowDown01Icon, PencilEdit01Icon } from "hugeicons-react";
import { useState } from "react";
import { Template } from "./types";

type TemplatePickerProps = {
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
};

export default function TemplatePicker({
  templates,
  onTemplateSelect,
}: TemplatePickerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    templates[0],
  );

  const handleSelectTemplate = (template: Template) => {
    onTemplateSelect(template);
    setSelectedTemplate(template);
  };

  const renderSelectItems = () => {
    return templates.map(
      (template) =>
        template.id !== selectedTemplate?.id && (
          <li key={template.id}>
            <button onClick={() => handleSelectTemplate(template)}>
              {template.name}
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
          <button className="hocus:bg-primary-focus bg-primary text-primary-content">
            <Add01Icon size={16} />
            Create new Template
          </button>
        </li>
        <li className="pt-1">
          <Link
            to="/"
            className="hocus:bg-secondary-focus bg-secondary text-secondary-content"
          >
            <PencilEdit01Icon size={16} />
            Manage Templates
          </Link>
        </li>
      </ul>
    </div>
  );
}
