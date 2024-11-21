import { ReactNode } from "react";

type Props = {
    children?: ReactNode,
    title?: string,
    id: string,
    onCrossClose?: () => void
};

export default function Modal({ children, id, onCrossClose, title }: Props) {
    return <>
        <dialog
            id={id}
            className="modal modal-bottom sm:modal-middle">
            <div className="sm:max-w-screen-xs modal-box pt-12" >
                {title &&
                    <h2>{title}</h2>
                }
                <form method="dialog" >
                    <button
                        className="btn btn-circle btn-ghost btn-lg absolute right-2 top-2"
                        onClick={() => {
                            if (onCrossClose)
                                onCrossClose();
                        }}>
                        ✕
                    </button>
                </form>
                {children}
            </div>
        </dialog>
    </>
}
