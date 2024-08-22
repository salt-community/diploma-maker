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
                        {description}
                    </p>
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
