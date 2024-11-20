export function useModal(id: string) {
  const openModal = () =>
    (document.getElementById(id) as HTMLDialogElement).showModal();

  return {
    openModal,
  };
}
