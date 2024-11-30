import React from "react";
import { createPortal } from "react-dom";

export type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ModalProps = {
  panelClass?: string;
  backdropClass?: string;
} & BaseModalProps &
  React.HTMLAttributes<HTMLDialogElement>;

export default function Modal({
  isOpen,
  onClose,
  children,
  className = "",
  panelClass = "",
  backdropClass = "",
  ...rest
}: ModalProps) {
  return createPortal(
    <dialog className={`modal ${className}`} open={isOpen} {...rest}>
      <div className={`sm:max-w-screen-xs modal-box ${panelClass}`}>
        {children}
      </div>
      <div className={`modal-backdrop bg-black/35 ${backdropClass}`}>
        <button onClick={onClose}>close</button>
      </div>
    </dialog>,
    document.getElementById("root")!,
  );
}
