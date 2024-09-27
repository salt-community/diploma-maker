import React from 'react';
import { TitleIcon } from "../MenuItems/Icons/TitleIcon";
import { DescriptionIcon } from "../MenuItems/Icons/DescriptionIcon";

type Props = {
    emailTitle: string;
    emailDescription: string;
    emailTitleInput: React.RefObject<HTMLInputElement>;
    emailDescriptionInput: React.RefObject<HTMLTextAreaElement>;
    handleEmailTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleEmailDescriptionChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const EmailContentConfigSection = ({ emailTitle, emailDescription, emailTitleInput, emailDescriptionInput, handleEmailTitleChange, handleEmailDescriptionChange}: Props) => {
    return (
        <>
            <label className="label-contentpage">
                OBS! <span>{"{studentName}"}</span> is later replaced with the students name!
            </label>
            <li className="emailclient__list--item editfields contentpage">
                <TitleIcon />
                <div className="emailclient__list--input-wrapper editfields">
                    <h3>Title</h3>
                    <input
                        className="emailclient__list--input editfields"
                        type="text"
                        ref={emailTitleInput}
                        onChange={handleEmailTitleChange}
                        value={emailTitle}
                    />
                </div>
            </li>
            <li className="emailclient__list--item editfields textarea">
                <DescriptionIcon />
                <div className="emailclient__list--input-wrapper editfields">
                    <h3>Description</h3>
                    <textarea
                        className="emailclient__list--input editfields"
                        ref={emailDescriptionInput}
                        onChange={handleEmailDescriptionChange}
                        value={emailDescription}
                    />
                </div>
            </li>
        </>
    );
};