import { useForm, SubmitHandler } from "react-hook-form";

import type { BackendTypes } from "@/services";
import { useCache } from "@/hooks";

import { selectedTemplateKey } from "./cacheKeys";
import { Modal } from "@/components/layout";


export type Props = {
  onCreateNewTemplate: () => void;
};

type Inputs = {
  templateName: string;
};

export default function NewTemplateModal({
  onCreateNewTemplate,
}: Props) {
  const [_, setSelectedTemplate] = useCache<BackendTypes.NamedEntity>(selectedTemplateKey);

  const {
    register, handleSubmit, formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setSelectedTemplate({ name: data.templateName });
    onCreateNewTemplate();

    (document.getElementById(
      import.meta.env.VITE_NEW_TEMPLATE_MODAL_ID
    ) as HTMLDialogElement).close();
  };

  return (
    <Modal
      id={import.meta.env.VITE_NEW_TEMPLATE_MODAL_ID}
      title={"Create New Template"}>
      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="input input-bordered w-full"
          type="text"
          placeholder="Template Name"
          {...register("templateName", { required: true, minLength: 3 })} />
        <button
          className="btn btn-primary mt-4"
          type="submit"
          disabled={errors.templateName != undefined}
        >
          Create
        </button>
        {errors.templateName && <span>This field is required</span>}
      </form>
    </Modal>
  );
}
