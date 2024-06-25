import { useEffect, useState } from "react"
import { DiplomaInBootcamp } from "../util/types"
import './EmailClient.css'
import { CloseWindowIcon } from "./MenuItems/Icons/CloseWindowIcon"
import { CogWheelIcon } from "./MenuItems/Icons/CogWheelIcon"
import { AddButton } from "./MenuItems/Buttons/AddButton"
import { PublishButton } from "./MenuItems/Buttons/PublishButton"
import { SaveButton, SaveButtonType } from "./MenuItems/Buttons/SaveButton"

type Props = {
    clients:  DiplomaInBootcamp[],
    title: string | undefined,
    closeEmailClient: () => void
}

export const EmailClient = ({ clients, title, closeEmailClient }: Props) => {
    const [inputContent, setInputContent] = useState<string>('');

    // useEffect(() => {
    //     setInputContent(text);
    //   }, [title, text])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputContent(event.target.value);
    };

    return(
        <section className="emailclient">
            <header className="emailclient__header">
                <h1>{title}</h1>
                <h2>Students</h2>
            </header>
            <ul className="emailclient__list">
            {clients.map((student: DiplomaInBootcamp, index) => (
                <li className="emailclient__list--item">
                    <h3>{student.studentName}</h3>
                    {/* <p>{student.emailAddress}</p> */}
                    <div className="emailclient__list--input-wrapper">
                        <input className="emailclient__list--input" type="text" value={student.emailAddress ? student.emailAddress : 'No Email'} onChange={handleInputChange} />
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
            ))
            }
            </ul>
            <button onClick={() => {closeEmailClient}} className='emailclient-close-btn'>
                <CloseWindowIcon />
            </button>
            <SaveButton classNameOverride="send-emails-btn" saveButtonType={SaveButtonType.normal} textfield="Send Emails to Selected Clients" onClick={() => {}}/>
        </section>
    )
}