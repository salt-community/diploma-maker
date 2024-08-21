import { useState } from 'react';
import { SaveButton } from '../../MenuItems/Buttons/SaveButton';
import { CloseWindowIcon } from '../../MenuItems/Icons/CloseWindowIcon';
import { CloudUploadIcon } from '../../MenuItems/Icons/CloudUploadIcon';
import { FontUpload } from '../../MenuItems/Inputs/FontUpload';
import './UserFontsClient.css';
import { UserFontRequestDto } from '../../../util/types';
import { CustomAlertPopupProps, PopupType } from '../../MenuItems/Popups/AlertPopup';
import { getFontsData, refreshUserFonts } from '../../../util/helper';

export type UserFontsClientType = 'addNewFont' | 'manageFonts';

type Props = {
    type: UserFontsClientType;
    show: boolean;
    setShowUserFontsClient: (show: boolean) => void;
    customAlert: (alertType: PopupType, title: string, content: string) => void;
    postUserFonts: (userFontsRequestsDto: UserFontRequestDto[]) => void;
    setRefreshFonts: (refresh: boolean) => void;
    refreshFonts: boolean;
}

export const UserFontsClient = ({ type, show, setShowUserFontsClient, customAlert, postUserFonts, setRefreshFonts, refreshFonts }: Props) => {
    const [fonts, setFonts] = useState<UserFontRequestDto[]>([
        {
            Name: '',
            FontType: 'Regular',
            File: null
        },
        {
            Name: '',
            FontType: 'Bold',
            File: null
        },
        {
            Name: '',
            FontType: 'Italic',
            File: null
        },
    ]);

    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!fonts[0].File) {
            customAlert('message', "Normal Font Required!", `Normal Font Field is required.`);
            return;
        }

        const existingFonts = await getFontsData();
        if (existingFonts[fonts[0].Name]) {
            customAlert('message', "Font name already exists!", `Pick a different font name.`);
            return;
        }

        await postUserFonts(fonts);
        await refreshUserFonts();
        setRefreshFonts(!refreshFonts)
    }

    const setFileAtIndex = (file: File, index: number) => {
        setFonts(prevFonts => {
            const updatedFonts = [...prevFonts];
            updatedFonts[index] = { ...updatedFonts[index], File: file };
            return updatedFonts;
        });
    };

    const removeFileAtIndex = (index: number) => {
        setFonts(prevFonts => {
            const updatedFonts = [...prevFonts];
            updatedFonts[index] = { ...updatedFonts[index], File: null };
            return updatedFonts;
        });
    };

    return (
        <>
            <div className={`userfont ${show && ' visible'}`}>
                <form className="userfont__form" onSubmit={submitHandler}>
                    <div className="userfont__name-wrapper">
                        <h1 className="userfont__title">Font Name - The Soul of a Font</h1>
                        <input
                            required
                            className="userfont__input"
                            type="text"
                            value={fonts[0].Name}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                const newName = event.target.value;
                                setFonts(prevFonts => {
                                    return prevFonts.map(f => ({ ...f, Name: newName }));
                                });
                            }}
                        />
                    </div>
                    <div className="userfont__file-section">
                        <div className="userfont__file-wrapper">
                            <h3 className="userfont__file-title">Bold</h3>
                            <FontUpload fileResult={(file: File) => setFileAtIndex(file, 1)} removeThisFile={() => removeFileAtIndex(1)} />
                            <p className="userfont__note userfont__note--optional">*Optional</p>
                        </div>
                        <div className="userfont__file-wrapper">
                            <h3 className="userfont__file-title">Normal</h3>
                            <FontUpload fileResult={(file: File) => setFileAtIndex(file, 0)} removeThisFile={() => removeFileAtIndex(0)} />
                            <p className="userfont__note userfont__note--required">*Required</p>
                        </div>
                        <div className="userfont__file-wrapper">
                            <h3 className="userfont__file-title">Italic</h3>
                            <FontUpload fileResult={(file: File) => setFileAtIndex(file, 2)} removeThisFile={() => removeFileAtIndex(2)} />
                            <p className="userfont__note userfont__note--optional">*Optional</p>
                        </div>
                    </div>
                    <div className="userfont__submit-wrapper">
                        <SaveButton
                            classNameOverride="userfont__submit-button"
                            saveButtonType={'normal'}
                            textfield={'Submit Your New Font!'}
                            onClick={() => {}}
                            customIcon={<CloudUploadIcon />}
                            type='submit'
                        />
                    </div>
                </form>
                <button onClick={() => setShowUserFontsClient(false)} className='userfont__close-btn'>
                    <CloseWindowIcon />
                </button>
            </div>
            <div className={`userfont-backgroundblur ${show && ' visible'}`}></div>
        </>
    );
};