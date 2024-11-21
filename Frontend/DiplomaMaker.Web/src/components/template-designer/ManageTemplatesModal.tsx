import { Delete04Icon } from "hugeicons-react";
import { Modal } from "../layout";
import { useTemplates } from "@/hooks";

export default function ManageTemplatesModal() {
  const { templatePeeks, deleteTemplate } = useTemplates();

  const header = (
    <tr>
      <th>Template Name</th>
      <th></th>
    </tr>
  );

  const rows = templatePeeks?.map(template => template.guid && (
    <tr key={template.guid}>
      <td>{template.name}</td>
      <td>
        <button
          className="btn bg-warning hocus:bg-error"
          onClick={() => deleteTemplate(template.guid!)}>
          <Delete04Icon size={24} />
        </button>
      </td>
    </tr>
  ));

  return (
    <Modal
      id={import.meta.env.VITE_MANAGE_TEMPLATES_MODAL_ID}
      title={"Manage Templates"}>
      <div className="overflow-x-auto">
        <table className="table">

          <thead>
            {header}
          </thead>

          <tbody>
            {rows}
          </tbody>

        </table>
      </div>
    </Modal>
  );
}
