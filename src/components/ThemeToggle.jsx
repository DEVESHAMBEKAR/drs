import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    const [theme, setTheme] = useState('dark');

    // On mount, check localStorage or system preference
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initialTheme = prefersDark ? 'dark' : 'light';
            setTheme(initialTheme);
            document.documentElement.classList.toggle('dark', prefersDark);
        }
    }, []);

    // Toggle theme
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);

        // Update DOM
        document.documentElement.classList.toggle('dark', newTheme === 'dark');

        // Save to localStorage
        localStorage.setItem('theme', newTheme);
    };

    // Animation variants for icons
    const iconVariants = {
        initial: (isLight) => ({
            rotate: isLight ? -90 : 90,
            scale: 0,
            opacity: 0,
        }),
        animate: {
            rotate: 0,
            scale: 1,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 200,
                damping: 15,
            },
        },
        exit: (isLight) => ({
            rotate: isLight ? 90 : -90,
            scale: 0,
            opacity: 0,
            transition: {
                duration: 0.2,
            },
        }),
    };

    return (
        <motion.button
            onClick={toggleTheme}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 ${theme === 'dark'
                    ? 'border-[#c0a060]/30 bg-[#0a0a0a] text-[#c0a060]'
                    : 'border-[#a3a3a3] bg-[#e5e5e5] text-[#0a0a0a]'
                }`}
            whileTap={{ scale: 0.9 }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                    <motion.div
                        key="moon"
                        custom={false}
                        variants={iconVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <Moon className="h-5 w-5" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        custom={true}
                        variants={iconVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <Sun className="h-5 w-5" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

export default ThemeToggle;
