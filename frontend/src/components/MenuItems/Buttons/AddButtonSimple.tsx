import './AddButtonSimple.css'

type Props = {
    type?: ButtonType;
    classNameOverride?: string;
    text?: string;
    onClick: () => void
}

type ButtonType = 'button' | 'submit' | 'reset';

export const AddButtonSimple = ({ type = "button", classNameOverride, text = "Add", onClick } : Props) => {
    return(
        <button type={type} onClick={() => onClick()} className={`add-button--simple ${classNameOverride}`}>
            {text}
        </button>
    )
}