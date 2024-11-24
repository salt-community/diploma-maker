type ModalProps = {
  id: string;
  title: string;
  children: React.ReactNode;
};

export default function Modal({ id, title, children }: ModalProps) {
  return (
    <dialog
      className="modal modal-bottom overflow-hidden overflow-y-hidden sm:modal-middle"
      id={id}
    >
      <div className="sm:max-w-screen-xs modal-box overflow-hidden">
        <h3 className="font-display text-lg font-bold">{title}</h3>
        <form method="dialog">
          <button className="btn btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="mt-4">{children}</div>
      </div>
    </dialog>
  );
}
