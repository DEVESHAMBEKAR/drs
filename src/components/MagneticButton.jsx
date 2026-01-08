import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const MagneticButton = ({ children, className = '', onClick, ...props }) => {
    const buttonRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate distance from center
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        // Apply magnetic effect (move towards cursor, but not too much)
        const magnetStrength = 0.3; // Adjust this for stronger/weaker effect
        setPosition({
            x: deltaX * magnetStrength,
            y: deltaY * magnetStrength,
        });
    };

    const handleMouseLeave = () => {
        // Reset to center with spring animation
        setPosition({ x: 0, y: 0 });
    };

    return (
        <div
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="inline-block"
        >
            <motion.button
                animate={{
                    x: position.x,
                    y: position.y,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 150,
                    damping: 15,
                    mass: 0.1,
                }}
                onClick={onClick}
                className={className}
                {...props}
            >
                {children}
            </motion.button>
        </div>
    );
};

export default MagneticButton;
