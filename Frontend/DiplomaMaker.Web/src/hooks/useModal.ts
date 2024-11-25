import { useState } from "react";

export function useModal(id: string) {
  const [isOpen, setIsOpen] = useState(false);

  const modal = document.getElementById(id) as HTMLDialogElement;

  const open = () => {
    modal.showModal();
    setIsOpen(true);
  };
  const close = () => {
    modal.close();
    setIsOpen(false);
  };

  return { isOpen, open, close };
}
