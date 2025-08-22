import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    StarIcon, 
    MapPinIcon, 
    ClockIcon, 
    PhoneIcon,
    GlobeAltIcon,
    HeartIcon,
    ShareIcon,
    CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { 
    StarIcon as StarSolidIcon,
    HeartIcon as HeartSolidIcon
} from '@heroicons/react/24/solid';
import StoreDetailModal from './StoreDetailModal';

const StoreCard = ({ store }) => {
    const [showModal, setShowModal] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);

    // Get the first featured photo or fallback
    const featuredPhoto = store.featured_photos?.[0] || store.active_photos?.[0];
    const imageUrl = featuredPhoto 
        ? `/storage/${featuredPhoto.file_path}` 
        : '/images/store-placeholder.svg';

    // Format operating hours for display
    const getCurrentStatus = () => {
        if (!store.operating_hours || !store.is_open_now) {
            return { status: 'Closed', color: 'text-red-600' };
        }
        return { status: 'Open', color: 'text-green-600' };
    };

    const getTodayHours = () => {
        if (!store.today_operating_hours) return 'Hours not available';
        const { open, close } = store.today_operating_hours;
        return `${open} - ${close}`;
    };

    // Generate star rating
    const renderStars = (rating = 4.5) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <div key={i} className="relative">
                        <StarIcon className="h-4 w-4 text-gray-300" />
                        <div className="absolute inset-0 overflow-hidden w-1/2">
                            <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                        </div>
                    </div>
                );
            } else {
                stars.push(
                    <StarIcon key={i} className="h-4 w-4 text-gray-300" />
                );
            }
        }
        return stars;
    };

    const handleCardClick = (e) => {
        // Don't open modal if clicking on action buttons
        if (e.target.closest('.action-button')) return;
        setShowModal(true);
    };

    const handleFavorite = (e) => {
        e.stopPropagation();
        setIsFavorited(!isFavorited);
    };

    const handleShare = (e) => {
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: store.trading_name,
                text: store.description,
                url: window.location.href + '/store/' + store.store_id
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href + '/store/' + store.store_id);
        }
    };

    const currentStatus = getCurrentStatus();

    return (
        <>
            <div 
                onClick={handleCardClick}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-100"
            >
                {/* Image Section */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={store.trading_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            e.target.src = '/images/store-placeholder.svg';
                        }}
                    />
                    
                    {/* Overlay Actions */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={handleFavorite}
                            className="action-button p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                        >
                            {isFavorited ? (
                                <HeartSolidIcon className="h-4 w-4 text-red-500" />
                            ) : (
                                <HeartIcon className="h-4 w-4 text-gray-600" />
                            )}
                        </button>
                        <button
                            onClick={handleShare}
                            className="action-button p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                        >
                            <ShareIcon className="h-4 w-4 text-gray-600" />
                        </button>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 ${currentStatus.color}`}>
                            <div className={`w-2 h-2 rounded-full mr-1 ${currentStatus.status === 'Open' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            {currentStatus.status}
                        </span>
                    </div>

                    {/* Verification Badge */}
                    {store.is_verified && (
                        <div className="absolute bottom-3 right-3">
                            <CheckBadgeIcon className="h-6 w-6 text-blue-500 bg-white rounded-full p-1" />
                        </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute bottom-3 left-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {store.category}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-4">
                    {/* Header */}
                    <div className="mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {store.trading_name}
                        </h3>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                                {renderStars(4.5)}
                            </div>
                            <span className="text-sm text-gray-600">4.5 (124 reviews)</span>
                        </div>

                        {/* Description */}
                        {store.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                {store.description}
                            </p>
                        )}
                    </div>

                    {/* Details */}
                    <div className="space-y-2">
                        {/* Location */}
                        {store.primary_location && (
                            <div className="flex items-center text-sm text-gray-600">
                                <MapPinIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                                <span className="line-clamp-1">
                                    {store.primary_location.neighborhood && `${store.primary_location.neighborhood}, `}
                                    {store.primary_location.city}
                                </span>
                            </div>
                        )}

                        {/* Hours */}
                        <div className="flex items-center text-sm text-gray-600">
                            <ClockIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span>{getTodayHours()}</span>
                        </div>

                        {/* Contact Info Row */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div className="flex items-center space-x-3">
                                {/* Phone */}
                                {store.phone && (
                                    <a
                                        href={`tel:${store.phone}`}
                                        className="action-button p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <PhoneIcon className="h-4 w-4" />
                                    </a>
                                )}

                                {/* Website */}
                                {store.website && (
                                    <a
                                        href={store.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="action-button p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <GlobeAltIcon className="h-4 w-4" />
                                    </a>
                                )}
                            </div>

                            {/* View Details Link */}
                            <span className="text-xs text-indigo-600 font-medium group-hover:text-indigo-700">
                                View Details →
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Store Detail Modal */}
            {showModal && (
                <StoreDetailModal
                    store={store}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
};

export default StoreCard;