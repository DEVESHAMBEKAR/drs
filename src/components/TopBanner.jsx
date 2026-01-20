import { useState, useEffect } from 'react';

const TopBanner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Multiple banner messages
    const messages = [
        "NEW DROP - NOW LIVE",
        "FREE SHIPPING WORLDWIDE",
        "THE ART OF AMBIENCE",
        "1 YEAR WARRANTY",
        "READY TO SHIP"
    ];

    // Auto-rotate messages every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % messages.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className="sticky top-0 h-10 w-full bg-gradient-to-r from-black via-[#1a1a1a] to-black z-50 overflow-hidden">
            {/* Message Container with Slide & Fade Transition */}
            <div className="relative h-full w-full flex items-center justify-center">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${index === currentIndex
                                ? 'opacity-100 translate-y-0'
                                : index === (currentIndex - 1 + messages.length) % messages.length
                                    ? 'opacity-0 -translate-y-full'
                                    : 'opacity-0 translate-y-full'
                            }`}
                    >
                        <span className="font-display text-xs md:text-sm font-bold uppercase tracking-widest text-white">
                            {message}
                        </span>
                    </div>
                ))}
            </div>

            {/* Progress Indicator Dots */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1.5">
                {messages.map((_, index) => (
                    <div
                        key={index}
                        className={`h-0.5 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'w-4 bg-white/80'
                                : 'w-1.5 bg-white/20'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default TopBanner;
