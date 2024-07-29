import { useState } from 'react';
import './InstructionSlideshow.css'
import { ArrowIcon } from '../MenuItems/Icons/ArrowIcon';
import { CloseWindowIcon } from '../MenuItems/Icons/CloseWindowIcon';

type Slide = {
    image: string;
    title: string;
    description: string;
    alt: string;
};

type SlideshowProps = {
    slides: Slide[];
    onClose: () => void;
    show: boolean;
};

export const InstructionSlideshow = ({ slides, onClose, show }: SlideshowProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const goToPreviousSlide = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex - 1 + slides.length) % slides.length
        );
    };

    const currentSlide = slides[currentIndex];

    return (
        <div className={`slideshow ${show ? 'visible' : 'hidden'}`}>
            <button className='slideshow__closebtn' onClick={onClose}>
                <CloseWindowIcon />
            </button>
            <button className="slideshow__arrow slideshow__arrow--left" onClick={goToPreviousSlide}>
                <ArrowIcon />
            </button>
            <div className="slideshow__content">
                {slides.map((slide, index) => (
                    <img
                        key={index}
                        src={slide.image}
                        alt={slide.alt}
                        className={`slide ${index === currentIndex ? 'active' : ''}`}
                    />
                ))}
                <div className="slideshow__info">
                    <h2>{parseTextWithLinkTag(currentSlide.title)}</h2>
                    <p>{parseTextWithLinkTag(currentSlide.description)}</p>
                </div>
            </div>
            <button className="slideshow__arrow slideshow__arrow--right" onClick={goToNextSlide}>
                <ArrowIcon />
            </button>
        </div>
    );
};

const parseTextWithLinkTag = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g; // find [link](url)
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
        const [fullMatch, linkText, linkUrl] = match;
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }
        parts.push(
            <a key={match.index} href={linkUrl} target="_blank" rel="noopener noreferrer">{linkText}</a>
        );
        lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return parts;
};