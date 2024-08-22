import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './DescriptionCard.css';
import { Link } from 'react-router-dom';

type Props = {
    description: string;
    title: string;
    icon: React.ReactNode;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    link: string;
    onClick?: () => void;
    classOverride?: string;
}

export function DescriptionCard({ description, title, icon: Icon, onMouseEnter, onMouseLeave, link, onClick, classOverride }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            to={link}
            className={`homepage__card ${classOverride}`}
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