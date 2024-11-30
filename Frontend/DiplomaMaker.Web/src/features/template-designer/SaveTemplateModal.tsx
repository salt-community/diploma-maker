import { BaseModalProps, Modal } from "@/components";
import clsx from "clsx";
import { SubmitHandler, useForm } from "react-hook-form";

type SaveTemplateModalProps = {
  onSave: (name: string) => void;
} & BaseModalProps;

type Inputs = {
  templateName: string;
};

export default function SaveTemplateModal({
  isOpen,
  onSave,
  onClose,
}: SaveTemplateModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const submitHandler: SubmitHandler<Inputs> = (data) => {
    onSave(data.templateName);
    reset();
  };

  const templateNameClass = clsx("input input-bordered w-full", {
    "input-error": errors.templateName,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="pb-4">
        <h3 className="font-display text-lg font-bold">Save Template</h3>
      </div>
      <form onSubmit={handleSubmit(submitHandler)}>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Template Name</span>
          </div>
          <input
            className={templateNameClass}
            type="text"
            placeholder="Enter a template name..."
            {...register("templateName", {
              required: "Template name is required.",
              minLength: {
                value: 3,
                message: "Template name must be at least 3 characters long.",
              },
            })}
          />
          <div className="label">
            {errors.templateName && (
              <span className="label-text font-medium text-error">
                {errors.templateName.message}
              </span>
            )}
          </div>
        </label>
        <div className="modal-action">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => {
              onClose();
              reset();
            }}
          >
            Cancel
          </button>
          <button className="btn btn-primary" type="submit">
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
