import { useForm, SubmitHandler } from "react-hook-form";
import { useTemplates } from "../../hooks/templates";
import { TemplateRequest, TemplateResponse } from "../../api/dtos/templates";
import { useState } from "react";

type FormValues = TemplateRequest;

export default function TemplatesTest() {
  const [currentTemplateId, setCurrentTemplateId] = useState<number | null>(null);
  const {
    templates,
    postTemplate,
    putTemplate,
    deleteTemplate,
    templateById
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

  if (currentTemplateId == null && templates.length > 0)
    setCurrentTemplateId(templates[0].id ?? null);

  console.log("currentTemplateId: " + currentTemplateId);

  // if (watch("currentId") != currentTemplateId) setCurrentTemplateId(watch("currentId"));
  const currentTemplate = templates.find(template => template.id == currentTemplateId);
  // const currentTemplate = templateById(currentTemplateId);
  // const currentTemplate = templateById(watch("currentId"));


  return (
    <>
      <button onClick={() => postTemplate("New template")}>
        New template
      </button>
      <button onClick={() => {
        if (currentTemplateId == null)
          return;

        deleteTemplate(currentTemplateId);
        setCurrentTemplateId(templates.length > 1 ? templates[0].id : null);
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

        <input {...register("templateName")} placeholder="template name..." defaultValue={currentTemplate?.templateName}>

        </input>

        <button type="submit">Submit changes</button>
      </form>
    </>
  );
}
