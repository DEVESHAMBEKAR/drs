const TopBanner = () => {
    // Banner text - single instance
    const bannerText = "NEW DROP - NOW LIVE • FREE SHIPPING WORLDWIDE • THE ART OF AMBIENCE";

    return (
        <div className="sticky top-0 h-10 w-full overflow-hidden bg-gradient-to-r from-black via-[#1a1a1a] to-black z-50 pt-2">
            {/* Infinite Scrolling Marquee - CSS Animation for Performance */}
            <div className="absolute inset-0 flex items-center">
                <div className="flex items-center animate-marquee whitespace-nowrap">
                    {/* Repeat text multiple times for seamless scroll */}
                    {[...Array(20)].map((_, index) => (
                        <span
                            key={index}
                            className="font-display text-xs md:text-sm font-bold uppercase tracking-widest text-white mx-8"
                        >
                            {bannerText}
                        </span>
                    ))}
                </div>
            </div>

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default TopBanner;
