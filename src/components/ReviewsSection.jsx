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
                            ? 'fill-black dark:fill-white text-black dark:text-white'
                            : 'fill-none text-gray-400 dark:text-gray-600'
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
        <section className="bg-white dark:bg-black py-16">
            <div className="mx-auto max-w-7xl px-6">
                {/* Header Section */}
                <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                    <div>
                        <h2 className="font-heading text-2xl text-black dark:text-white md:text-4xl">
                            Customer Stories
                        </h2>
                        <div className="mt-4 flex items-center gap-4">
                            <span className="font-heading text-3xl md:text-5xl text-black dark:text-white">{averageRating}</span>
                            {renderStars(5, 'w-6 h-6')}
                        </div>
                        <p className="mt-2 font-body text-sm text-gray-500 dark:text-gray-500">
                            Based on {totalReviews} reviews
                        </p>
                    </div>

                    {/* Write Review Button */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="border-2 border-black dark:border-white bg-transparent px-8 py-3 font-body text-sm tracking-widest text-black dark:text-white transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
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
                            className="border-2 border-gray-200 dark:border-white/20 bg-white dark:bg-black p-6 hover:border-black dark:hover:border-white transition-colors"
                        >
                            {/* Top: Avatar + Name + Date */}
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black dark:bg-white font-body text-sm font-bold text-white dark:text-black">
                                    {review.initials}
                                </div>
                                <div className="flex-1">
                                    <p className="font-body text-sm font-medium text-black dark:text-white">
                                        {review.name}
                                    </p>
                                    <p className="font-body text-xs text-gray-500">{review.date}</p>
                                </div>
                            </div>

                            {/* Middle: Star Rating */}
                            <div className="mb-3">
                                {renderStars(review.rating, 'w-4 h-4')}
                            </div>

                            {/* Bottom: Review Text */}
                            <p className="font-body text-sm leading-relaxed text-gray-700 dark:text-gray-300">
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
                                className="w-full max-w-2xl bg-white dark:bg-black border-2 border-gray-300 dark:border-white/30 p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute right-4 top-4 text-gray-500 transition-colors hover:text-black dark:hover:text-white"
                                >
                                    <X className="h-6 w-6" />
                                </button>

                                {/* Modal Header */}
                                <h3 className="font-heading text-3xl text-black dark:text-white mb-6">
                                    Write a Review
                                </h3>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name Field */}
                                    <div>
                                        <label className="mb-2 block font-body text-sm tracking-widest text-black dark:text-white uppercase">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="w-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black px-4 py-3 font-body text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-colors focus:border-black dark:focus:border-white"
                                            placeholder="Your name"
                                        />
                                    </div>

                                    {/* Rating Field */}
                                    <div>
                                        <label className="mb-2 block font-body text-sm tracking-widest text-black dark:text-white uppercase">
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
                                            <p className="mt-2 font-body text-xs text-gray-500">
                                                Click to select a rating
                                            </p>
                                        )}
                                    </div>

                                    {/* Review Title */}
                                    <div>
                                        <label className="mb-2 block font-body text-sm tracking-widest text-black dark:text-white uppercase">
                                            Review Title
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                            className="w-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black px-4 py-3 font-body text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-colors focus:border-black dark:focus:border-white"
                                            placeholder="Sum up your experience"
                                        />
                                    </div>

                                    {/* Review Body */}
                                    <div>
                                        <label className="mb-2 block font-body text-sm tracking-widest text-black dark:text-white uppercase">
                                            Your Review
                                        </label>
                                        <textarea
                                            value={formData.body}
                                            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                                            required
                                            rows={5}
                                            className="w-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black px-4 py-3 font-body text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-colors focus:border-black dark:focus:border-white resize-none"
                                            placeholder="Share your experience with this product..."
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex gap-4">
                                        <button
                                            type="submit"
                                            disabled={formData.rating === 0}
                                            className="flex-1 bg-black dark:bg-white px-8 py-4 font-body text-sm tracking-widest text-white dark:text-black transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            POST REVIEW
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="border-2 border-gray-300 dark:border-gray-700 bg-transparent px-8 py-4 font-body text-sm tracking-widest text-black dark:text-white transition-all hover:border-black dark:hover:border-white"
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
