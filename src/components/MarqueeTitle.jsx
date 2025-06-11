import React, { useState, useRef, useEffect } from 'react';
import { HighlightedText } from './HighlightedText';

export function MarqueeTitle({ text, highlight }) {
    const [isOverflowing, setIsOverflowing] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const checkOverflow = () => {
            if (containerRef.current) {
                const textElement = containerRef.current.querySelector('span');
                if (textElement) {
                    setIsOverflowing(textElement.scrollWidth > containerRef.current.clientWidth);
                }
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [text]);

    return (
        <div
            ref={containerRef}
            className="relative w-full overflow-hidden h-7"
        >
            <div
                className={`absolute top-0 left-0 flex items-center h-full
                    ${isOverflowing ? 'group-hover:animate-marquee' : ''}`}
            >
                <span className="whitespace-nowrap px-1 text-lg font-semibold">
                    <HighlightedText text={text} highlight={highlight} />
                </span>
                {isOverflowing && (
                    <span className="whitespace-nowrap px-1 text-lg font-semibold">
                        <HighlightedText text={text} highlight={highlight} />
                    </span>
                )}
            </div>
        </div>
    );
}