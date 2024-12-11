import { ArrowDown01Icon } from "hugeicons-react";

import { BackendTypes } from "@/services";

type Props = {
  templates: BackendTypes.Template[];
  selectedTemplate: BackendTypes.Template | undefined;
  setSelectedTemplate: (template: BackendTypes.Template) => void;
};

export default function TemplatePicker({
  templates,
  selectedTemplate,
  setSelectedTemplate,
}: Props) {
  const renderSelectItems = () => {
    if (!templates) return;

    return templates.map((template) => (
      <li key={template.guid}>
        <button
          className={`${selectedTemplate?.guid == template.guid && "bg-[#042d451a]"}`}
          onClick={(e) => {
            setSelectedTemplate(template!);
            (e.target as HTMLButtonElement).blur();
          }}
        >
          {template.name}
        </button>
      </li>
    ));
  };

  return (
    <div className="text-center">
      <p className="mb-4 font-display text-lg font-medium">Diploma Template</p>
      <div className="dropdown dropdown-bottom">
        <div
          tabIndex={0}
          role="button"
          className="btn flex min-w-80 items-center justify-start border-none bg-neutral text-start"
        >
          <div className="flex-1">
            <p className="m-0 font-display text-base font-semibold">
              {selectedTemplate ? selectedTemplate.name : "Select a template"}
            </p>
          </div>
          <ArrowDown01Icon size={18} />
        </div>
        <ul
          tabIndex={0}
          className="menu dropdown-content z-[1] mt-2 w-full rounded-box bg-neutral p-2 text-base shadow"
        >
          {renderSelectItems()}
        </ul>
      </div>
    </div>
  );
}
