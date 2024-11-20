export default function NewTemplateModal() {
    return (
        <dialog
            id={import.meta.env.VITE_NEW_TEMPLATE_MODAL_ID}
            className="modal modal-bottom sm:modal-middle"
        >
            <div className="modal-box sm:max-w-screen-lg h-full pt-12">
                <form method="dialog">
                    <button className="btn btn-lg btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                    </button>
                </form>
                <div className="flex h-full gap-8">
                </div>
            </div>
        </dialog>
    );
}