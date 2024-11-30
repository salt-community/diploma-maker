import { BaseModalProps, Modal } from "@/components";
import {
  useTemplatePeeks,
  useUpdateTemplateMutation,
} from "@/features/template-designer/template";
import { BackendService, BackendTypes } from "@/services";
import { File02Icon, PencilEdit01Icon, Tick01Icon } from "hugeicons-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function ManageTemplatesModal({
  isOpen,
  onClose,
}: BaseModalProps) {
  const { data: templatePeeks } = useTemplatePeeks();

  const { mutate: updateTemplate } = useUpdateTemplateMutation();

  // TODO: Use PATCH when updating template name
  const handleSaveTemplate = async (templateId: string, newName: string) => {
    const template = await BackendService.getEntity<BackendTypes.Template>(
      "Template",
      templateId,
    );

    updateTemplate({
      guid: templateId,
      name: newName,
      templateJson: template.templateJson,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} panelClass="pb-12">
      <div className="pb-8">
        <h3 className="font-display text-lg font-bold">Manage Templates</h3>
        <button
          onClick={onClose}
          className="btn btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
      </div>
      <ul className="flex flex-col gap-4">
        {templatePeeks?.map((template) => (
          <TemplateItem
            key={template.guid}
            template={template}
            onSave={handleSaveTemplate}
          />
        ))}
      </ul>
    </Modal>
  );
}

/* TEMPLATE ITEM COMPONENT */

type TemplateItemProps = {
  template: BackendTypes.TemplatePeek;
  onSave: (templateId: string, newName: string) => void;
};

type TemplateItemMode = "view" | "edit";

type TemplateItemInputs = {
  templateName: string;
};

function TemplateItem({ template, onSave }: TemplateItemProps) {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<TemplateItemInputs>({
    defaultValues: { templateName: template.name },
  });

  const [mode, setMode] = useState<TemplateItemMode>("view");

  useEffect(() => {
    if (mode == "edit") {
      setFocus("templateName");
    }
  }, [mode]);

  const submitHandler: SubmitHandler<TemplateItemInputs> = (data) => {
    onSave(template.guid!, data.templateName);
    setMode("view");
  };

  return (
    <li>
      <div className="flex items-center gap-2">
        <File02Icon size={24} />
        {mode == "view" ? (
          <div className="join w-full">
            <div className="input input-sm join-item input-bordered w-full">
              {template.name}
            </div>
            <button
              type="button"
              className="btn btn-secondary join-item btn-sm min-w-[104px]"
              onClick={() => setMode("edit")}
            >
              <PencilEdit01Icon size={18} />
              Rename
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(submitHandler)} className="join w-full">
            <input
              type="text"
              placeholder="Enter a template name..."
              className="input input-sm join-item input-bordered w-full"
              {...register("templateName", {
                required: "Template name is required.",
                minLength: {
                  value: 3,
                  message: "Template name must be at least 3 characters long.",
                },
              })}
            />
            <button
              type="submit"
              className="btn btn-primary join-item btn-sm min-w-[104px]"
            >
              <Tick01Icon size={18} />
              Save
            </button>
          </form>
        )}
      </div>
      {errors.templateName && (
        <div className="label ml-7">
          <span className="label-text font-medium text-error">
            {errors.templateName.message}
          </span>
        </div>
      )}
    </li>
  );
}
