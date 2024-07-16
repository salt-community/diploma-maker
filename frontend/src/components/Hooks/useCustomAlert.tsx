import { useState } from 'react';
import { PopupType } from '../MenuItems/Popups/AlertPopup';

export const useCustomAlert = () => {
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupContent, setPopupContent] = useState<string[]>(["",""]);
    const [popupType, setPopupType] = useState<PopupType>('success');

    const customAlert = (alertType: PopupType, title: string, content: string) => {
        setPopupType(alertType);
        setPopupContent([title, content]);
        setShowPopup(true);
    };

    const closeAlert = () => {
        setShowPopup(false);
    };

    return { showPopup, popupContent, popupType, customAlert, closeAlert };
};