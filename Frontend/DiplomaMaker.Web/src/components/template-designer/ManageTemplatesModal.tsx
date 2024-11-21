import { Delete04Icon } from "hugeicons-react";
import { Modal } from "../layout";
import { useTemplates } from "@/hooks";

export default function ManageTemplatesModal() {
  const { templatePeeks } = useTemplates();

  return (
    <Modal
      id={import.meta.env.VITE_MANAGE_TEMPLATES_MODAL_ID}
      title={"Manage Templates"}>
      <div className="overflow-x-auto">
        <table className="table">

          <thead>
            <tr>
              <th>Template Name</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>My Template</td>
              <td>
                <button
                  className="btn bg-warning hocus:bg-error" >
                  <Delete04Icon size={24} />
                </button>
              </td>
            </tr>
          </tbody>

        </table>
      </div>
    </Modal>
  );
}
