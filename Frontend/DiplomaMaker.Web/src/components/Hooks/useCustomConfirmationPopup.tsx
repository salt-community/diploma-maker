import { useState } from 'react';
import { ConfirmationPopupType } from '../MenuItems/Popups/ConfirmationPopup';

export const useCustomConfirmationPopup = () => {
  const [showConfirmationPopup, setShowConfirmationPopup] = useState<boolean>(false);
  const [confirmationPopupContent, setConfirmationPopupContent] = useState<React.ReactNode[]>(["", ""]);
  const [confirmationPopupType, setConfirmationPopupType] = useState<ConfirmationPopupType>('question');
  const [confirmationPopupHandler, setConfirmationPopupHandler] = useState<() => void>(() => {});

  const customPopup = (type: ConfirmationPopupType, title: string, content: React.ReactNode, handler: () => void) => {
      setConfirmationPopupType(type);
      setConfirmationPopupContent([title, content]);
      setConfirmationPopupHandler(handler);
      setShowConfirmationPopup(true);
  }

  const closeConfirmationPopup = () => {
    setShowConfirmationPopup(false);
  }

  return {
    showConfirmationPopup,
    confirmationPopupContent,
    confirmationPopupType,
    confirmationPopupHandler,
    customPopup,
    closeConfirmationPopup,
  }
}
