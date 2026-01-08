import { useState } from 'react';
import { motion } from 'framer-motion';

const SpotlightCard = ({ children, className = '' }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <motion.div
            className={`relative overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Spotlight Gradient Overlay */}
            {isHovering && (
                <div
                    className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300"
                    style={{
                        opacity: isHovering ? 1 : 0,
                        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.1), transparent 40%)`,
                    }}
                />
            )}

            {/* Card Content */}
            <div className="relative z-0">
                {children}
            </div>
        </motion.div>
    );
};

export default SpotlightCard;
