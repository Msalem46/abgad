import React, { useState } from 'react';
import { 
    XMarkIcon,
    MapPinIcon,
    ClockIcon,
    PhoneIcon,
    GlobeAltIcon,
    StarIcon,
    ShareIcon,
    HeartIcon,
    CameraIcon,
    CheckBadgeIcon,
    BuildingStorefrontIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import { 
    StarIcon as StarSolidIcon,
    HeartIcon as HeartSolidIcon 
} from '@heroicons/react/24/solid';

const StoreDetailModal = ({ store, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorited, setIsFavorited] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Combine all photos
    const allPhotos = [
        ...(store.featured_photos || []),
        ...(store.active_photos || [])
    ].filter((photo, index, self) => 
        index === self.findIndex(p => p.photo_id === photo.photo_id)
    );

    const exteriorPhotos = allPhotos.filter(photo => photo.photo_type === 'exterior');
    const interiorPhotos = allPhotos.filter(photo => photo.photo_type === 'interior');
    const displayPhotos = allPhotos.length > 0 ? allPhotos : [];

    // Operating hours for the week
    const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const renderStars = (rating = 4.5) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <div key={i} className="relative">
                        <StarIcon className="h-5 w-5 text-gray-300" />
                        <div className="absolute inset-0 overflow-hidden w-1/2">
                            <StarSolidIcon className="h-5 w-5 text-yellow-400" />
                        </div>
                    </div>
                );
            } else {
                stars.push(
                    <StarIcon key={i} className="h-5 w-5 text-gray-300" />
                );
            }
        }
        return stars;
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % displayPhotos.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + displayPhotos.length) % displayPhotos.length);
    };

    const getCurrentStatus = () => {
        if (!store.operating_hours || !store.is_open_now) {
            return { status: 'Closed', color: 'text-red-600', bg: 'bg-red-100' };
        }
        return { status: 'Open', color: 'text-green-600', bg: 'bg-green-100' };
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: store.trading_name,
                text: store.description,
                url: window.location.href + '/store/' + store.store_id
            });
        } else {
            navigator.clipboard.writeText(window.location.href + '/store/' + store.store_id);
        }
    };

    const currentStatus = getCurrentStatus();

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div 
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                ></div>

                {/* Modal panel */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    
                    {/* Header */}
                    <div className="bg-white px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <h3 className="text-xl font-semibold text-gray-900 mr-3">
                                    {store.trading_name}
                                </h3>
                                {store.is_verified && (
                                    <CheckBadgeIcon className="h-6 w-6 text-blue-500" />
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setIsFavorited(!isFavorited)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    {isFavorited ? (
                                        <HeartSolidIcon className="h-6 w-6 text-red-500" />
                                    ) : (
                                        <HeartIcon className="h-6 w-6" />
                                    )}
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                                >
                                    <ShareIcon className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                {store.category}
                            </span>
                            <div className="flex items-center">
                                {renderStars(4.5)}
                                <span className="ml-2 text-sm text-gray-600">4.5 (124 reviews)</span>
                            </div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStatus.bg} ${currentStatus.color}`}>
                                <div className={`w-2 h-2 rounded-full mr-2 ${currentStatus.status === 'Open' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                {currentStatus.status}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white">
                        {/* Image Gallery */}
                        {displayPhotos.length > 0 && (
                            <div className="relative h-64 sm:h-80 bg-gray-200">
                                <img
                                    src={`/storage/${displayPhotos[currentImageIndex].file_path}`}
                                    alt={store.trading_name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = '/images/store-placeholder.svg';
                                    }}
                                />
                                
                                {/* Image navigation */}
                                {displayPhotos.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                                        >
                                            <ChevronLeftIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                                        >
                                            <ChevronRightIcon className="h-5 w-5" />
                                        </button>
                                        
                                        {/* Image counter */}
                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                            {currentImageIndex + 1} / {displayPhotos.length}
                                        </div>
                                    </>
                                )}

                                {/* Photo type indicator */}
                                <div className="absolute top-4 right-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800">
                                        <CameraIcon className="h-3 w-3 mr-1" />
                                        {displayPhotos[currentImageIndex].photo_type === 'exterior' ? 'Exterior' : 'Interior'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6">
                                {['overview', 'photos', 'hours'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`py-4 text-sm font-medium border-b-2 transition-colors capitalize ${
                                            activeTab === tab
                                                ? 'border-indigo-500 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="px-6 py-6">
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    {/* Description */}
                                    {store.description && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">About</h4>
                                            <p className="text-gray-600">{store.description}</p>
                                        </div>
                                    )}

                                    {/* Contact & Location */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
                                            <div className="space-y-3">
                                                {store.phone && (
                                                    <div className="flex items-center">
                                                        <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                                                        <a 
                                                            href={`tel:${store.phone}`}
                                                            className="text-indigo-600 hover:text-indigo-700"
                                                        >
                                                            {store.phone}
                                                        </a>
                                                    </div>
                                                )}
                                                {store.website && (
                                                    <div className="flex items-center">
                                                        <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-3" />
                                                        <a 
                                                            href={store.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-indigo-600 hover:text-indigo-700"
                                                        >
                                                            Visit Website
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Location</h4>
                                            {store.primary_location && (
                                                <div className="flex items-start">
                                                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                                    <div className="text-gray-600">
                                                        <div>{store.primary_location.street_address}</div>
                                                        {store.primary_location.neighborhood && (
                                                            <div>{store.primary_location.neighborhood}</div>
                                                        )}
                                                        <div>{store.primary_location.city}, {store.primary_location.governorate}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'photos' && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Photo Gallery</h4>
                                    
                                    {/* Exterior Photos */}
                                    {exteriorPhotos.length > 0 && (
                                        <div className="mb-6">
                                            <h5 className="text-md font-medium text-gray-700 mb-3">Exterior ({exteriorPhotos.length})</h5>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                                {exteriorPhotos.map((photo, index) => (
                                                    <div key={photo.photo_id} className="aspect-w-1 aspect-h-1">
                                                        <img
                                                            src={`/storage/${photo.file_path}`}
                                                            alt={photo.title || 'Exterior photo'}
                                                            className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                                            onClick={() => {
                                                                const allIndex = displayPhotos.findIndex(p => p.photo_id === photo.photo_id);
                                                                setCurrentImageIndex(allIndex);
                                                                setActiveTab('overview');
                                                            }}
                                                            onError={(e) => {
                                                                e.target.src = '/images/store-placeholder.svg';
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Interior Photos */}
                                    {interiorPhotos.length > 0 && (
                                        <div>
                                            <h5 className="text-md font-medium text-gray-700 mb-3">Interior ({interiorPhotos.length})</h5>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                                {interiorPhotos.map((photo, index) => (
                                                    <div key={photo.photo_id} className="aspect-w-1 aspect-h-1">
                                                        <img
                                                            src={`/storage/${photo.file_path}`}
                                                            alt={photo.title || 'Interior photo'}
                                                            className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                                            onClick={() => {
                                                                const allIndex = displayPhotos.findIndex(p => p.photo_id === photo.photo_id);
                                                                setCurrentImageIndex(allIndex);
                                                                setActiveTab('overview');
                                                            }}
                                                            onError={(e) => {
                                                                e.target.src = '/images/store-placeholder.svg';
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {displayPhotos.length === 0 && (
                                        <div className="text-center py-8">
                                            <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-gray-500">No photos available</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'hours' && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Operating Hours</h4>
                                    <div className="space-y-2">
                                        {weekDays.map((day, index) => {
                                            const dayHours = store.operating_hours?.[day];
                                            const isToday = new Date().getDay() === index;
                                            
                                            return (
                                                <div 
                                                    key={day} 
                                                    className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                                                        isToday ? 'bg-indigo-50 border border-indigo-200' : 'bg-gray-50'
                                                    }`}
                                                >
                                                    <span className={`font-medium ${isToday ? 'text-indigo-900' : 'text-gray-900'}`}>
                                                        {dayNames[index]}
                                                        {isToday && <span className="ml-2 text-xs text-indigo-600">(Today)</span>}
                                                    </span>
                                                    <span className={`text-sm ${isToday ? 'text-indigo-700' : 'text-gray-600'}`}>
                                                        {dayHours?.open && dayHours?.close 
                                                            ? `${dayHours.open} - ${dayHours.close}`
                                                            : 'Closed'
                                                        }
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-gray-50 px-6 py-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                                    Get Directions
                                </button>
                                <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                                    Call Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreDetailModal;