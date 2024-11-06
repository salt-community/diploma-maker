import { useTemplates } from "../../hooks/templates";

export default function TemplatesTest() {
  const {
    templates,
    deleteTemplate,
    postTemplate,
    putTemplate,
    templateById
  } = useTemplates();

  console.log("templates");
  console.log(templates);

  return (
    <>
      <button onClick={() => postTemplate({ templateName: "New template" })}>
        New template
      </button>
    </>
  );
}
