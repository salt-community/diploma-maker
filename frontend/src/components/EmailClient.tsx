import React, { useState } from "react";
import { DiplomaInBootcamp } from "../util/types";
import './EmailClient.css';
import { CloseWindowIcon } from "./MenuItems/Icons/CloseWindowIcon";
import { CogWheelIcon } from "./MenuItems/Icons/CogWheelIcon";
import { SaveButton, SaveButtonType } from "./MenuItems/Buttons/SaveButton";

type Props = {
    clients: DiplomaInBootcamp[],
    title: string | undefined,
    show: boolean,
    closeEmailClient: () => void,
    modifyStudentEmailHandler: (studentInput?: DiplomaInBootcamp, originalEmail?: string) => void;
};

export const EmailClient = ({ clients, title, show, closeEmailClient, modifyStudentEmailHandler }: Props) => {
    const [emailChanges, setEmailChanges] = useState<{[key: string]: string}>({});

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
                                <input type="checkbox"/>
                                <svg viewBox="0 0 35.6 35.6">
                                    <circle className="background" cx="17.8" cy="17.8" r="17.8"></circle>
                                    <circle className="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                                    <polyline className="check" points="11.78 18.12 15.55 22.23 25.17 12.87"></polyline>
                                </svg>
                            </div>
                        </li>
                    ))}
                </ul>
                <button onClick={closeEmailClient} className='emailclient-close-btn'>
                    <CloseWindowIcon />
                </button>
                <SaveButton classNameOverride="send-emails-btn" saveButtonType={SaveButtonType.normal} textfield="Send Emails to Selected Clients" onClick={() => {}}/>
            </section>
            <div className={`preventClickBG ${show ? 'fade-in' : 'fade-out'}`}></div>
        </>
    )
}