import { Link } from 'react-router-dom';
import { Instagram, Mail, Send } from 'lucide-react';
import { useState } from 'react';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            // TODO: Add newsletter subscription logic here
            setIsSubscribed(true);
            setTimeout(() => {
                setIsSubscribed(false);
                setEmail('');
            }, 3000);
        }
    };

    return (
        <footer className="bg-[#0a0a0a] text-[#e5e5e5] pt-20 pb-8">
            {/* Main Footer Grid */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

                    {/* Column 1: Brand Identity - DRS */}
                    <div className="space-y-6">
                        <img
                            src="/drs-logo.png"
                            alt="DRS - Deep Root Studios"
                            className="h-16 w-auto dark:invert"
                        />
                        <p className="text-gray-400 text-sm tracking-widest uppercase">
                            Walls with a Spine.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-4 pt-2">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#a3a3a3] hover:text-[#c0a060] transition-colors duration-300"
                                aria-label="Instagram"
                            >
                                <Instagram size={20} />
                            </a>
                            <a
                                href="https://pinterest.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#a3a3a3] hover:text-[#c0a060] transition-colors duration-300"
                                aria-label="Pinterest"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.176-4.068-2.845 0-4.516 2.135-4.516 4.34 0 .859.331 1.781.745 2.281a.3.3 0 0 1 .069.288l-.278 1.133c-.044.183-.145.223-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.525-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                                </svg>
                            </a>
                            <a
                                href="mailto:hello@deeprootstudios.com"
                                className="text-[#a3a3a3] hover:text-[#c0a060] transition-colors duration-300"
                                aria-label="Email"
                            >
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Shop Navigation */}
                    <div className="space-y-6">
                        <h3 className="font-serif text-lg text-[#c0a060] tracking-wide">
                            The Collection
                        </h3>
                        <nav className="flex flex-col space-y-3">
                            <Link
                                to="/shop"
                                className="text-[#a3a3a3] hover:text-white transition-colors duration-300 text-sm"
                            >
                                Shop All
                            </Link>
                            <Link
                                to="/shop?filter=bestsellers"
                                className="text-[#a3a3a3] hover:text-white transition-colors duration-300 text-sm"
                            >
                                Best Sellers
                            </Link>
                            <Link
                                to="/shop?filter=new"
                                className="text-[#a3a3a3] hover:text-white transition-colors duration-300 text-sm"
                            >
                                New Arrivals
                            </Link>
                        </nav>
                    </div>

                    {/* Column 3: Contact Information */}
                    <div className="space-y-6">
                        <h3 className="font-serif text-lg text-[#c0a060] tracking-wide">
                            Visit Us
                        </h3>
                        <div className="flex flex-col space-y-4">
                            {/* Address */}
                            <div className="space-y-1">
                                <p className="text-[#a3a3a3] text-sm leading-relaxed">
                                    Deep Root Studios<br />
                                    Pune, Maharashtra<br />
                                    India 411041
                                </p>
                            </div>

                            {/* Phone */}
                            <div className="space-y-1">
                                <p className="text-[#737373] text-xs uppercase tracking-wider">Phone</p>
                                <a
                                    href="tel:+919579276597"
                                    className="text-[#a3a3a3] hover:text-[#c0a060] transition-colors duration-300 text-sm block"
                                >
                                    +91 9579276597
                                </a>
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <p className="text-[#737373] text-xs uppercase tracking-wider">Email</p>
                                <a
                                    href="mailto:thedeeprootstudios@gmail.com"
                                    className="text-[#a3a3a3] hover:text-[#c0a060] transition-colors duration-300 text-sm block break-all"
                                >
                                    thedeeprootstudios@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div className="space-y-6">
                        <h3 className="font-serif text-lg text-[#e5e5e5] tracking-wide">
                            Join the Atelier
                        </h3>
                        <p className="text-[#a3a3a3] text-sm leading-relaxed">
                            Exclusive access to new releases and studio stories.
                        </p>

                        <form onSubmit={handleSubscribe} className="space-y-4">
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email address"
                                    className="w-full bg-transparent border-0 border-b border-[#a3a3a3] text-[#e5e5e5] placeholder-[#a3a3a3] py-2 px-0 focus:outline-none focus:border-[#c0a060] transition-colors duration-300 text-sm"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full border border-[#c0a060] text-[#c0a060] hover:bg-[#c0a060] hover:text-[#0a0a0a] py-2.5 px-6 transition-all duration-300 text-sm font-medium tracking-wide flex items-center justify-center gap-2 group"
                            >
                                {isSubscribed ? (
                                    'Subscribed!'
                                ) : (
                                    <>
                                        Subscribe
                                        <Send size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-[#a3a3a3]/20 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-[#a3a3a3] text-xs text-center md:text-left">
                            © 2026 Deep Root Studios.
                        </p>
                        <div className="flex gap-6 text-xs">
                            <Link
                                to="/privacy"
                                className="text-[#a3a3a3] hover:text-[#c0a060] transition-colors duration-300"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                to="/terms"
                                className="text-[#a3a3a3] hover:text-[#c0a060] transition-colors duration-300"
                            >
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
