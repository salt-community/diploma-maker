import useCache from "@/hooks/useCache";
import { NamedEntity } from "@/services/backendService/models";
import { useForm, SubmitHandler } from "react-hook-form";
import { Modal } from "../layout";
import { selectedTemplateKey } from "./cacheKeys";


export type Props = {
  onCreateNewTemplate: () => void;
};

export type Inputs = {
  templateName: string;
};

export default function NewTemplateModal({
  onCreateNewTemplate,
}: Props) {
  const [_, setSelectedTemplate] = useCache<NamedEntity>(selectedTemplateKey);

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
    <Modal id={import.meta.env.VITE_NEW_TEMPLATE_MODAL_ID}>
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
