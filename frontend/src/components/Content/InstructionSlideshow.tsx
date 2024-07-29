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
                    <h2>{slides[currentIndex].title}</h2>
                    <p>{slides[currentIndex].description}</p>
                </div>
            </div>
            <button className="slideshow__arrow slideshow__arrow--right" onClick={goToNextSlide}>
                <ArrowIcon />
            </button>
        </div>
    );
};
