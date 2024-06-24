import { CogWheelIcon } from '../Icons/CogWheelIcon';
import './ModifyButton.css'

type Props = {
    classNameOverride?: string,
    text: string,
    onClick: () => void
}

export const ModifyButton = ({classNameOverride, text, onClick}: Props) => {
    return (
        <button onClick={onClick} className={"btn modify-btn " + classNameOverride}>
            <span className="btn-title">{text}</span>
            <CogWheelIcon />
        </button>
    );
};