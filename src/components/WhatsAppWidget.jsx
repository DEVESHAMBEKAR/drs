import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const WhatsAppWidget = () => {
    const [isPulsing, setIsPulsing] = useState(false);

    // Trigger pulse animation every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIsPulsing(true);
            setTimeout(() => setIsPulsing(false), 1000);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleClick = () => {
        const phoneNumber = '9579276597'; // Deep Root Studios WhatsApp number
        const message = encodeURIComponent('Hi Deep Root, I have a question about...');
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <button
            onClick={handleClick}
            className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] 
                  rounded-full shadow-lg hover:shadow-xl transition-all duration-300 
                  flex items-center justify-center group
                  ${isPulsing ? 'animate-pulse-ring' : ''}`}
            aria-label="Contact us on WhatsApp"
            title="Chat with us on WhatsApp"
        >
            {/* Pulse ring effect */}
            <span
                className={`absolute inset-0 rounded-full bg-[#25D366] opacity-75 
                    ${isPulsing ? 'animate-ping' : 'opacity-0'}`}
            />

            {/* WhatsApp Icon */}
            <MessageCircle
                className="w-7 h-7 text-white relative z-10 group-hover:scale-110 transition-transform duration-200"
                strokeWidth={2}
            />
        </button>
    );
};

export default WhatsAppWidget;
