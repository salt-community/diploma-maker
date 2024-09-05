import { PopupType } from "../components/MenuItems/Popups/AlertPopup";
import { Student } from "./types";

export const validateEmail = (
    studentInput: Student, 
    originalEmail: string,
    customAlert: (alertType: PopupType, title: string, content: string) => void,
    closeInfoPopup: () => void,
): boolean => {
    if (!studentInput?.email || studentInput?.email === "No Email") {
        customAlert('fail', "Validation Error", "Email field is empty!");
        closeInfoPopup();
        return false;
    }
    if (!studentInput?.email.includes('@')) {
        customAlert('fail', "Validation Error", "Please provide a valid email address.");
        closeInfoPopup();
        return false;
    }
    if (studentInput?.email === originalEmail) {
        customAlert('message', "No changes", "Email was unchanged.");
        closeInfoPopup();
        return false;
    }
    return true;
};