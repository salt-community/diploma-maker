import TemplatePicker from "./TemplatePicker";

export type Template = {
  id: string;
  name: string;
};

const templates: Template[] = [
  { id: "1", name: "Default Template" },
  { id: "2", name: "jsfs" },
  { id: "3", name: "dnfs" },
];

export default function TemplateDesigner() {
  return (
    <div className="flex h-full flex-col">
      <div className="navbar z-40 bg-neutral">
        <div className="navbar-start">
          <TemplatePicker
            templates={templates}
            onTemplateSelect={(template) => console.log(template.name)}
          />
        </div>
        <div className="navbar-end">Save Changes</div>
      </div>
      <div className="h-100 flex-1 overflow-auto">Template Designer</div>
    </div>
  );
}
