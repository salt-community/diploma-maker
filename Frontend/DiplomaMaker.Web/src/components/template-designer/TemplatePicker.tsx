import { useTemplatePeeks } from "@/hooks/template";
import { TemplatePeek } from "@/services/backendService/models";
import { Add01Icon, ArrowDown01Icon, PencilEdit01Icon } from "hugeicons-react";
import { useState } from "react";
import ManageTemplatesModal from "./ManageTemplatesModal";
import NewTemplateModal from "./NewTemplateModal";

type TemplatePickerProps = {
  onTemplateSelected: (id: string) => void;
  onNewTemplate: () => void;
};

export default function TemplatePicker({
  onTemplateSelected,
  onNewTemplate,
}: TemplatePickerProps) {
  const { data: templatePeeks } = useTemplatePeeks();

  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplatePeek | null>();

  const renderTemplateItems = () =>
    templatePeeks?.map((template) =>
      template != selectedTemplate ? (
        <li key={template.guid}>
          <button
            onClick={() => {
              onTemplateSelected(template.guid!);
              setSelectedTemplate(template);
            }}
          >
            {template.name}
          </button>
        </li>
      ) : null,
    );

  return (
    <>
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
          {renderTemplateItems()}

          <li className="pt-1">
            <button
              className="bg-primary text-primary-content hocus:bg-primary-focus"
              onClick={() => {}}
            >
              <Add01Icon size={16} />
              Create new Template
            </button>
          </li>

          <li className="pt-1">
            <button
              className="bg-secondary text-secondary-content hocus:bg-secondary-focus"
              onClick={() => {}}
            >
              <PencilEdit01Icon size={16} />
              Manage Templates
            </button>
          </li>
        </ul>
      </div>

      {/* Modals */}
      <NewTemplateModal onCreateNewTemplate={onNewTemplate} />
      <ManageTemplatesModal />
    </>
  );
}
