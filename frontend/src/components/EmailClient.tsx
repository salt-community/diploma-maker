import React, { useState } from "react";
import { DiplomaInBootcamp } from "../util/types";
import './EmailClient.css';
import { CloseWindowIcon } from "./MenuItems/Icons/CloseWindowIcon";
import { CogWheelIcon } from "./MenuItems/Icons/CogWheelIcon";
import { SaveButton, SaveButtonType } from "./MenuItems/Buttons/SaveButton";
import { PopupType } from "./MenuItems/Popups/AlertPopup";
import { CircleIcon } from "./MenuItems/Icons/CircleIcon";

type Props = {
    clients: DiplomaInBootcamp[],
    title: string | undefined,
    show: boolean,
    closeEmailClient: () => void,
    modifyStudentEmailHandler: (studentInput?: DiplomaInBootcamp, originalEmail?: string) => void,
    sendEmails: (userIds: string[]) => void,
    callCustomAlert: (alertType: PopupType, title: string, content: string) => void,
};

export const EmailClient = ({ clients, title, show, closeEmailClient, modifyStudentEmailHandler, sendEmails, callCustomAlert }: Props) => {
    const [emailChanges, setEmailChanges] = useState<{[key: string]: string}>({});
    const [checkedUsers, setCheckedUsers] = useState<{[key: string]: boolean}>({});

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, student: DiplomaInBootcamp) => {
        setEmailChanges({
            ...emailChanges,
            [student.guidId]: event.target.value,
        });
    };

    const inputBlurHandler = (student: DiplomaInBootcamp) => {
        const newEmail = emailChanges[student.guidId];
        if (newEmail && newEmail !== student.emailAddress) {
            modifyStudentEmailHandler({
                ...student,
                emailAddress: newEmail,
            }, student.emailAddress);
        }
    };

    const checkboxChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, studentId: string) => {
        setCheckedUsers({
            ...checkedUsers,
            [studentId]: event.target.checked,
        });
    };

    const sendEmailsHandler = () => {
        const selectedIds = Object.keys(checkedUsers).filter(id => checkedUsers[id]);
        const selectedStudents = clients.filter(student => selectedIds.includes(student.guidId));
        const studentNullEmail = selectedStudents.find(student => !student.emailAddress);

        if (studentNullEmail) {
            callCustomAlert(PopupType.fail, `Failure in sending emails`, `Cannot send email to ${studentNullEmail.studentName} as their email address is missing.`);
            return;
        }
        sendEmails(selectedIds);
    }

    return (
        <>
            <section className={"emailclient " + (show ? 'fade-in' : 'fade-out')}>
                <header className="emailclient__header">
                    <h1>{title}</h1>
                    <h2>Students</h2>
                </header>
                <ul className="emailclient__list">
                    {clients.map((student: DiplomaInBootcamp) => (
                        <li key={student.guidId} className="emailclient__list--item">
                            <h3>{student.studentName}</h3>
                            <div className="emailclient__list--input-wrapper">
                                <input 
                                    className="emailclient__list--input" 
                                    type="text" 
                                    value={emailChanges[student.guidId] || student.emailAddress || 'No Email'} 
                                    onChange={(event) => inputChangeHandler(event, student)} 
                                    onBlur={() => inputBlurHandler(student)} 
                                />
                                <CogWheelIcon />
                            </div>
                            <div className="checkbox-wrapper-31">
                                <input 
                                    type="checkbox" 
                                    checked={!!checkedUsers[student.guidId]} 
                                    onChange={(event) => checkboxChangeHandler(event, student.guidId)} 
                                />
                                <CircleIcon />
                            </div>
                        </li>
                    ))}
                </ul>
                <button onClick={closeEmailClient} className='emailclient-close-btn'>
                    <CloseWindowIcon />
                </button>
                <SaveButton classNameOverride="send-emails-btn" saveButtonType={SaveButtonType.normal} textfield="Send Emails to Selected Clients" onClick={sendEmailsHandler}/>
            </section>
            <div className={`preventClickBG ${show ? 'fade-in' : 'fade-out'}`}></div>
        </>
    );
};
