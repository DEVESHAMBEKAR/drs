import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';

const ReviewsSection = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        rating: 0,
        title: '',
        body: ''
    });
    const [hoverRating, setHoverRating] = useState(0);

    // Mock reviews data
    const reviews = [
        {
            id: 1,
            name: 'Devesh',
            rating: 5,
            text: 'Absolutely stunning. The walnut finish is even better in person.',
            date: '2 days ago',
            initials: 'D'
        },
        {
            id: 2,
            name: 'Riya S.',
            rating: 5,
            text: 'Bought this as a gift for my husband. He loves the stepwell design.',
            date: '5 days ago',
            initials: 'RS'
        },
        {
            id: 3,
            name: 'Arjun K.',
            rating: 4,
            text: 'Great quality, but took 5 days to deliver to Bangalore.',
            date: '1 week ago',
            initials: 'AK'
        }
    ];

    const averageRating = 4.9;
    const totalReviews = 24;

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Review submitted:', formData);
        // Reset form and close modal
        setFormData({ name: '', rating: 0, title: '', body: '' });
        setIsModalOpen(false);
    };

    // Render star rating
    const renderStars = (rating, size = 'w-5 h-5', interactive = false, onHover = null, onClick = null) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${size} ${star <= (interactive ? (hoverRating || rating) : rating)
                            ? 'fill-[#c0a060] text-[#c0a060]'
                            : 'fill-none text-zinc-600 dark:text-zinc-700'
                            } ${interactive ? 'cursor-pointer transition-colors' : ''}`}
                        onMouseEnter={() => interactive && onHover && onHover(star)}
                        onMouseLeave={() => interactive && onHover && onHover(0)}
                        onClick={() => interactive && onClick && onClick(star)}
                    />
                ))}
            </div>
        );
    };

    return (
        <section className="bg-[#0a0a0a] py-16">
            <div className="mx-auto max-w-7xl px-6">
                {/* Header Section */}
                <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                    <div>
                        <h2 className="font-heading text-2xl text-[#c0a060] md:text-4xl">
                            Customer Stories
                        </h2>
                        <div className="mt-4 flex items-center gap-4">
                            <span className="font-heading text-3xl md:text-5xl text-[#e5e5e5]">{averageRating}</span>
                            {renderStars(5, 'w-6 h-6')}
                        </div>
                        <p className="mt-2 font-body text-sm text-zinc-500">
                            Based on {totalReviews} reviews
                        </p>
                    </div>

                    {/* Write Review Button */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="border-2 border-[#c0a060] bg-transparent px-8 py-3 font-body text-sm tracking-widest text-[#c0a060] transition-all hover:bg-[#c0a060] hover:text-black"
                    >
                        WRITE A REVIEW
                    </button>
                </div>

                {/* Review List */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="border border-zinc-800 bg-[#111111] p-6"
                        >
                            {/* Top: Avatar + Name + Date */}
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c0a060] font-body text-sm font-bold text-black">
                                    {review.initials}
                                </div>
                                <div className="flex-1">
                                    <p className="font-body text-sm font-medium text-[#e5e5e5]">
                                        {review.name}
                                    </p>
                                    <p className="font-body text-xs text-zinc-500">{review.date}</p>
                                </div>
                            </div>

                            {/* Middle: Star Rating */}
                            <div className="mb-3">
                                {renderStars(review.rating, 'w-4 h-4')}
                            </div>

                            {/* Bottom: Review Text */}
                            <p className="font-body text-sm leading-relaxed text-[#e5e5e5]">
                                "{review.text}"
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Write Review Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                        />

                        {/* Modal Container with Flexbox Centering */}
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full max-w-2xl bg-[#0a0a0a] border border-zinc-800 p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute right-4 top-4 text-zinc-500 transition-colors hover:text-[#c0a060]"
                                >
                                    <X className="h-6 w-6" />
                                </button>

                                {/* Modal Header */}
                                <h3 className="font-heading text-3xl text-[#c0a060] mb-6">
                                    Write a Review
                                </h3>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name Field */}
                                    <div>
                                        <label className="mb-2 block font-body text-sm tracking-widest text-[#e5e5e5] uppercase">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="w-full border border-zinc-700 bg-[#111111] px-4 py-3 font-body text-[#e5e5e5] placeholder-zinc-600 outline-none transition-colors focus:border-[#c0a060]"
                                            placeholder="Your name"
                                        />
                                    </div>

                                    {/* Rating Field */}
                                    <div>
                                        <label className="mb-2 block font-body text-sm tracking-widest text-[#e5e5e5] uppercase">
                                            Rating
                                        </label>
                                        {renderStars(
                                            formData.rating,
                                            'w-8 h-8',
                                            true,
                                            setHoverRating,
                                            (rating) => setFormData({ ...formData, rating })
                                        )}
                                        {formData.rating === 0 && (
                                            <p className="mt-2 font-body text-xs text-zinc-500">
                                                Click to select a rating
                                            </p>
                                        )}
                                    </div>

                                    {/* Review Title */}
                                    <div>
                                        <label className="mb-2 block font-body text-sm tracking-widest text-[#e5e5e5] uppercase">
                                            Review Title
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                            className="w-full border border-zinc-700 bg-[#111111] px-4 py-3 font-body text-[#e5e5e5] placeholder-zinc-600 outline-none transition-colors focus:border-[#c0a060]"
                                            placeholder="Sum up your experience"
                                        />
                                    </div>

                                    {/* Review Body */}
                                    <div>
                                        <label className="mb-2 block font-body text-sm tracking-widest text-[#e5e5e5] uppercase">
                                            Your Review
                                        </label>
                                        <textarea
                                            value={formData.body}
                                            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                                            required
                                            rows={5}
                                            className="w-full border border-zinc-700 bg-[#111111] px-4 py-3 font-body text-[#e5e5e5] placeholder-zinc-600 outline-none transition-colors focus:border-[#c0a060] resize-none"
                                            placeholder="Share your experience with this product..."
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex gap-4">
                                        <button
                                            type="submit"
                                            disabled={formData.rating === 0}
                                            className="flex-1 bg-[#c0a060] px-8 py-4 font-body text-sm tracking-widest text-black transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            POST REVIEW
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="border border-zinc-700 bg-transparent px-8 py-4 font-body text-sm tracking-widest text-[#e5e5e5] transition-all hover:border-[#c0a060] hover:text-[#c0a060]"
                                        >
                                            CANCEL
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
};

export default ReviewsSection;
