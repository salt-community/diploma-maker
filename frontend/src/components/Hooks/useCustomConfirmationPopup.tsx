import { useState } from 'react';
import { ConfirmationPopupType } from '../MenuItems/Popups/ConfirmationPopup';

export const useCustomConfirmationPopup = () => {
  const [showConfirmationPopup, setShowConfirmationPopup] = useState<boolean>(false);
  const [confirmationPopupContent, setConfirmationPopupContent] = useState<string[]>(["",""]);
  const [confirmationPopupType, setConfirmationPopupType] = useState<ConfirmationPopupType>('question');
  const [confirmationPopupHandler, setConfirmationPopupHandler] = useState<() => void>(() => {});

  const customPopup = (type: ConfirmationPopupType, title: string, content: string, handler: () => ((inputContent?: string) => void) | (() => void)) => {
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
