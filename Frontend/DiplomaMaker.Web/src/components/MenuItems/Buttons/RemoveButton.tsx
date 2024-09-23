import { TrashCanIcon } from '../Icons/TrashCanIcon';
import './RemoveButton.css'

type Props = {
    classNameOverride?: string,
    text: string,
    onClick: () => void
}

export const RemoveButton = ({classNameOverride, text, onClick}: Props) => {
    return (
        <button onClick={onClick} className={"btn remove-btn " + classNameOverride}>
            <span className="btn-title">{text}</span>
            <TrashCanIcon />
        </button>
    );
};