import { NamedEntity } from "@/api/models";
import { SubmitHandler, useForm } from "react-hook-form";

type NewTemplateModalProps = {
  onCreateNewTemplate: (template: NamedEntity) => void;
};

type Inputs = {
  templateName: string;
};

export default function NewTemplateModal({
  onCreateNewTemplate,
}: NewTemplateModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    onCreateNewTemplate({ name: data.templateName });
    console.log(data.templateName);
    (
      document.getElementById(
        import.meta.env.VITE_NEW_TEMPLATE_MODAL_ID,
      ) as HTMLDialogElement
    ).close();
  };
  return (
    <dialog
      id={import.meta.env.VITE_NEW_TEMPLATE_MODAL_ID}
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="sm:max-w-screen-xs modal-box pt-12">
        <form method="dialog">
          <button className="btn btn-circle btn-ghost btn-lg absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="Template Name"
            {...register("templateName", { required: true, minLength: 3 })}
          />
          <button
            className="btn btn-primary mt-4"
            type="submit"
            disabled={errors.templateName != undefined}
          >
            Create
          </button>
          {errors.templateName && <span>This field is required</span>}
        </form>
      </div>
    </dialog>
  );
}
