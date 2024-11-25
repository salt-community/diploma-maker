import { useTemplatePeeks } from "@/hooks/template";
import { Delete02Icon, File02Icon, PencilEdit01Icon } from "hugeicons-react";
import Modal from "../Modal";

export const MANAGE_TEMPLATES_MODAL_ID = "manage-templates-modal";

export default function ManageTemplatesModal() {
  const { data: templatePeeks } = useTemplatePeeks();

  return (
    <>
      <Modal id={MANAGE_TEMPLATES_MODAL_ID} title="Manage Templates">
        <div className="p-4">
          <ul className="flex flex-col gap-4">
            {templatePeeks?.map((template) => (
              <li className="flex items-center gap-2">
                <div className="flex gap-2 align-middle">
                  <File02Icon size={24} />
                  <span className="font-medium">{template.name}</span>
                </div>
                <div className="ml-auto flex w-fit gap-2">
                  <button className="btn btn-secondary join-item btn-sm">
                    <PencilEdit01Icon size={18} />
                    Rename
                  </button>
                  <button className="btn btn-error join-item btn-sm">
                    <Delete02Icon size={18} />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </>
  );
}
