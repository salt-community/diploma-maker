import { useForm, SubmitHandler } from "react-hook-form";
import { useTemplates } from "../../hooks/useTemplates";
import { TemplateRequest, TemplateResponse } from "../../api/dtos/templates";
import { useState } from "react";

type FormValues = TemplateRequest;

export default function TemplatesTest() {
  const [currentTemplateId, setCurrentTemplateId] = useState<number>(1);
  const {
    templates,
    postTemplate,
    putTemplate,
    deleteTemplate,
  } = useTemplates();

  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = template => {
    if (currentTemplateId == null)
      return;

    console.log(template);
    const request = {
      ...currentTemplate,
      ...template,
      basePdf: "fsjklafd"
    } as TemplateResponse;
    console.log(request);
    putTemplate(currentTemplateId, request);
  };

  const currentTemplate = templates.find(template => template.id == currentTemplateId);

  if (!currentTemplate) {
    console.error("Could not set currentTemplate");
    return;
  }

  const templateNameFormField = (
    <input {...register("templateName")}
      placeholder="template name..."
      defaultValue={currentTemplate?.templateName}>
    </input>
  );

  return (
    <>
      <button onClick={() => postTemplate("New template")}>
        New template
      </button>
      <button onClick={() => {
        deleteTemplate(currentTemplateId);
      }}>
        Delete template
      </button >
      <select onChange={(e) => {
        if (currentTemplateId != parseInt(e.currentTarget.value))
          setCurrentTemplateId(parseInt(e.currentTarget.value));
      }}>
        {templates.map(template => <option key={template.id}>{template.id}</option>)}
      </select >

      <form onSubmit={handleSubmit(onSubmit)}>
        {templateNameFormField}

        <button type="submit">Submit changes</button>
        {/* <input type="file" accept="application/pdf"></input> */}
      </form>
    </>
  );
}
