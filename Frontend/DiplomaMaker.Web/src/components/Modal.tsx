import { useEffect } from "react";

type ModalProps = {
  id: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({
  id,
  title,
  isOpen,
  onClose,
  children,
}: ModalProps) {
  useEffect(() => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    if (modal) {
      if (isOpen) {
        modal.showModal();
      } else {
        modal.close();
      }
    }
  }, [isOpen]);

  return (
    <dialog
      className="modal modal-bottom overflow-hidden overflow-y-hidden sm:modal-middle"
      id={id}
    >
      <div className="sm:max-w-screen-xs modal-box overflow-hidden">
        <h3 className="font-display text-lg font-bold">{title}</h3>
        <button
          className="btn btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="mt-4">{children}</div>
      </div>
    </dialog>
  );
}
