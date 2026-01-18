import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    const [theme, setTheme] = useState('light'); // Default to light mode

    // On mount, check localStorage or default to light
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        } else {
            // Default to light mode on first visit
            setTheme('light');
            document.documentElement.classList.remove('dark');
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
                ? 'border-luxury-border bg-luxury-card text-neon-gold'
                : 'border-zinc-300 bg-zinc-100 text-zinc-900'
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
