import { useForm, SubmitHandler } from "react-hook-form";
import { useTemplates } from "../../hooks/templates";
import { TemplateFieldStyle, TemplateRequest, TemplateResponse } from "../../api/dtos/templates";
import { useState } from "react";

type FormValues = TemplateRequest;

export default function TemplatesTest() {
  const [currentTemplateId, setCurrentTemplateId] = useState<number>(1);
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

  type DynamicField = {
    textContent: string,
    style: TemplateFieldStyle
  }

  type TemplateDynamicFields = {
    footer: DynamicField,
    intro: DynamicField,
    main: DynamicField,
    link: DynamicField
  }

  const dynamicFields: TemplateDynamicFields = {
    footer: {
      textContent: currentTemplate.footer,
      style: currentTemplate.footerStyling
    },
    intro: {
      textContent: currentTemplate.intro,
      style: currentTemplate.introStyling
    },
    main: {
      textContent: currentTemplate.main,
      style: currentTemplate.mainStyling
    },
    link: {
      textContent: currentTemplate.link,
      style: currentTemplate.linkStyling
    },
  };

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
