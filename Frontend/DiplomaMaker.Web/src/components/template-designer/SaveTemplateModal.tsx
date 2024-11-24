import clsx from "clsx";
import { SubmitHandler, useForm } from "react-hook-form";
import Modal from "../Modal";

type SaveTemplateModalProps = {
  onSave: (name: string) => void;
  onCancel: () => void;
};

type Inputs = {
  templateName: string;
};

export const SAVE_TEMPLATE_MODAL_ID = "save-template-modal";

export default function SaveTemplateModal({
  onSave,
  onCancel,
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

  const handleCancel = () => {
    onCancel();
    reset();
  };

  const templateNameClass = clsx("input input-bordered w-full", {
    "input-error": errors.templateName,
  });

  return (
    <Modal id={SAVE_TEMPLATE_MODAL_ID} title="Save Template">
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
        <div className="mt-4 flex gap-2">
          <button className="btn btn-primary" type="submit">
            Save
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
