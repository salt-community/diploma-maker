import Minion from '../../../public/icons/minion.webp';
import "./ErrorPage.css"
type ErrorCode = 404 | 403;

type Props = {
    code: ErrorCode;
}

export default function ErrorPage({ code }: Props) {
    return (
        <div className="error-container">
            <div className="error-header">
                <h1> A <strong>{code} Error</strong> has just occurred.</h1>
                <img src={Minion} alt="404minion" />
            </div>
            <p>
                I'm surprised that someone is here to visit me on this empty and sad page. 
                Unfortunately for you there's nothing of interest here. Try accessing the correct page through the navbar.
            </p>
        </div>
    );
}
