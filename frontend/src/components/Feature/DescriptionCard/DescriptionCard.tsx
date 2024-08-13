import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './DescriptionCard.css';

type Props = {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

export function DescriptionCard({ shortDescription, LongDescription, title, icon: Icon, onMouseEnter, onMouseLeave }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`homepage__card ${isHovered ? 'visible' : ''}`}
            onMouseEnter={() => { setIsHovered(true); onMouseEnter(); }}
            onMouseLeave={() => { setIsHovered(false); onMouseLeave(); }}
        >
            <header className="homepage__card-header">
                <Icon />
                <h2>{title}</h2>
            </header>
            <div className="homepage__card-content">
                <div className={`homepage__card-full-description ${isHovered ? 'visible' : ''}`}>
                    <p className="homepage__card-full-description-text">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis numquam architecto aut laudantium modi nesciunt nobis exercitationem inventore et, praesentium illum asperiores impedit pariatur optio rem magni recusandae adipisci a, consectetur suscipit iusto ullam iure consequatur sunt? Magnam, magni corporis.
                    </p>
                    <div className="submit-button-container">
                        <button className="submit-button" onMouseUp={() => {alert("hi")}}>
                            Visual instructions
                        </button>
                    </div>
                </div>
                <div className={`homepage__card-short-description ${isHovered ? 'hidden' : ''}`}>
                    <ul className="short-description-list">
                        {shortDescription.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                    <span className="learn-more-text">Hover to learn more...</span>
                </div>
            </div>
        </div>
    );
}

DescriptionCard.propTypes = {
    shortDescription: PropTypes.arrayOf(PropTypes.string).isRequired,
    LongDescription: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
};
