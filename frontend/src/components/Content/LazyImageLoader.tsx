import { useState } from "react";
import './LazyImageLoader.css'

type LazyImageLoaderProps = {
    previewImageLQIPUrl?: string;
    previewImageUrl?: string;
};

export const LazyImageLoader = ({ previewImageLQIPUrl, previewImageUrl }: LazyImageLoaderProps) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={`lazy-image-wrapper ${isLoaded ? 'loaded' : ''}`}>
            <img
                src={previewImageLQIPUrl || 'fallback_lqip_url'}
                alt="Low Quality"
                className={`low-quality ${isLoaded ? 'hidden' : ''}`}
            />
            <img
                src={previewImageUrl || 'fallback_high_url'}
                alt="High Quality"
                className={`high-quality ${isLoaded ? 'loaded' : 'hidden'}`}
                onLoad={() => setIsLoaded(true)}
            />
        </div>
    );
};
