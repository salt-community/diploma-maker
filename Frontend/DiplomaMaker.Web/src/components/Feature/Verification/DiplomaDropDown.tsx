import { PublishButton } from "../../MenuItems/Buttons/PublishButton";

type Props = {
    showDiploma: boolean;
    generatePDFHandler: () => Promise<void>;
    diplomaRenderer: React.ReactNode;
}

export const DiplomaDropDown = ({ showDiploma, generatePDFHandler, diplomaRenderer }: Props) => {

    return (
        <div className={'diploma-container ' + (showDiploma ? 'visible' : '')}>
            <div className='diploma-container-content'>
                <PublishButton classNameOverride='diploma-container--downloadbtn' text="Download Diploma" onClick={() => generatePDFHandler()} />
                {diplomaRenderer}
            </div>
        </div>
    );
};