import { NotFoundIcon } from '../Icons/NotFoundIcon';
import './Popup404.css';

type Props = {
    classOverride?: string,
    text: string,
    onClick?: () => void
}

export const Popup404 = ({ classOverride, text, onClick }: Props) => {
    return (
        <div onClick={onClick} className={'popup404-container ' + classOverride}>
            <NotFoundIcon />
            <h1>{text}</h1>
        </div>
    );
};