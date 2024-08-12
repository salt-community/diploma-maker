import { PublishButton } from "../../MenuItems/Buttons/PublishButton";
import "./DescriptionCard.css"

export function DescriptionCard({ title, icon: Icon }) {
    return (
        <div className="homepage__card">
            <header className="homepage__card-header">
                <Icon />
                <h2>{title}</h2>
            </header>
            <div className="homepage__card-content">
                <p className="homepage__card-short-description">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, dolorem.
                </p>
                <div className="homepage__card-full-description">
                    <p className="homepage__card-full-description-text">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt laboriosam consequatur quae sed cumque soluta natus iure adipisci rerum neque maiores, expedita eveniet rem et possimus eum illo iusto tempora.</p>
                    <div className="submit-button-container ">
                    <button
                        className="submit-button" onClick={() => console.log("yo")}>
                        Visual instructions
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
