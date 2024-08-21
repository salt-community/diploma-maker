import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './DescriptionCard.css';
import { Link } from 'react-router-dom';

type Props = {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    link: string;
    onClick?: () => void,
}

export function DescriptionCard({ description, title, icon: Icon, onMouseEnter, onMouseLeave, link, onClick }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            to={link}
            className={`homepage__card`}
            onMouseEnter={() => { setIsHovered(true); onMouseEnter(); }}
            onMouseLeave={() => { setIsHovered(false); onMouseLeave(); }}
            onClick={onClick ? onClick : undefined}
        >
            <header className="homepage__card-header">
                <Icon />
                <h2>{title}</h2>
            </header>
            <div className="homepage__card-content">
                <div className={`homepage__card-full-description `}>
                    <p className="homepage__card-full-description-text">
                        {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis numquam architecto aut laudantium modi nesciunt nobis exercitationem inventore et, praesentium illum asperiores impedit pariatur optio rem magni recusandae adipisci a, consectetur suscipit iusto ullam iure consequatur sunt? Magnam, magni corporis. */}
                        {description}
                    </p>
                    {/* <div className="submit-button-container">
                        <button className="submit-button" onMouseUp={() => {alert("hi")}}>
                            Visual instructions
                        </button>
                    </div> */}
                </div>
            </div>
        </Link>
    );
}

DescriptionCard.propTypes = {
    description: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
};
