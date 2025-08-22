import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    MapPinIcon,
    PhoneIcon,
    GlobeAltIcon,
    ShareIcon,
    HeartIcon,
    StarIcon,
    ClockIcon,
    PhotoIcon,
    BuildingStorefrontIcon,
    CheckBadgeIcon,
    UsersIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import {
    HeartIcon as HeartSolidIcon,
    StarIcon as StarSolidIcon,
    ShareIcon as ShareSolidIcon
} from '@heroicons/react/24/solid';
import { useLanguage } from '../../contexts/LanguageContext';

const StoreDetailsPage = () => {
    const { id } = useParams();
    const { t, direction, language } = useLanguage();
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showFullDescription, setShowFullDescription] = useState(false);

    // Mock store data
    const mockStore = {
        store_id: 1,
        name: "Petra Moon Tourism Restaurant",
        description: "Experience authentic Jordanian cuisine in our beautiful restaurant located in the heart of Wadi Musa, just minutes from Petra. We offer traditional dishes prepared with fresh local ingredients, stunning views of the surrounding mountains, and warm Jordanian hospitality that will make your dining experience unforgettable. Our menu features classic dishes like Mansaf, Maqluba, and fresh grilled meats, along with vegetarian options and international favorites.",
        category: "restaurant",
        phone: "+962 3 215 7777",
        email: "info@petramoon.jo",
        website: "https://www.petramoon.jo",
        address: "Tourism Street, Wadi Musa, Ma'an Governorate",
        city: "Wadi Musa", 
        latitude: 30.3285,
        longitude: 35.4444,
        verified: true,
        featured: true,
        rating: 4.7,
        total_reviews: 342,
        total_visits: 1250,
        opening_hours: {
            monday: { open: "08:00", close: "23:00", closed: false },
            tuesday: { open: "08:00", close: "23:00", closed: false },
            wednesday: { open: "08:00", close: "23:00", closed: false },
            thursday: { open: "08:00", close: "23:00", closed: false },
            friday: { open: "08:00", close: "23:00", closed: false },
            saturday: { open: "08:00", close: "23:00", closed: false },
            sunday: { open: "08:00", close: "23:00", closed: false }
        },
        photos: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop&q=80",
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop&q=80",
            "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=400&fit=crop&q=80", 
            "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&h=400&fit=crop&q=80",
            "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=400&fit=crop&q=80"
        ],
        menu_categories: [
            { name: "Traditional Jordanian", count: 12 },
            { name: "Grilled Meats", count: 8 },
            { name: "Vegetarian", count: 6 },
            { name: "Desserts", count: 5 }
        ]
    };

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setStore(mockStore);
            setLoading(false);
        }, 1000);
    }, [id]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: store.name,
                text: store.description,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert(language === 'ar' ? 'تم نسخ الرابط' : 'Link copied to clipboard');
        }
    };

    const handleCall = () => {
        window.open(`tel:${store.phone}`);
    };

    const handleDirections = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`;
        window.open(url, '_blank');
    };

    const handleWebsite = () => {
        window.open(store.website, '_blank');
    };

    const toggleFavorite = () => {
        setIsFavorited(!isFavorited);
        // Here you would make an API call to save/remove from favorites
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />);
        }

        if (hasHalfStar) {
            stars.push(<StarIcon key="half" className="h-5 w-5 text-yellow-400" />);
        }

        const remainingStars = 5 - Math.ceil(rating);
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<StarIcon key={`empty-${i}`} className="h-5 w-5 text-gray-300" />);
        }

        return stars;
    };

    const getCurrentDayStatus = () => {
        const today = new Date().getDay();
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const todayName = dayNames[today];
        const todayHours = store.opening_hours[todayName];
        
        if (todayHours.closed) {
            return { status: 'closed', text: language === 'ar' ? 'مغلق اليوم' : 'Closed today' };
        }

        const now = new Date();
        const currentTime = now.getHours() * 100 + now.getMinutes();
        const openTime = parseInt(todayHours.open.replace(':', ''));
        const closeTime = parseInt(todayHours.close.replace(':', ''));

        if (currentTime >= openTime && currentTime <= closeTime) {
            return { 
                status: 'open', 
                text: language === 'ar' ? `مفتوح حتى ${todayHours.close}` : `Open until ${todayHours.close}`
            };
        } else {
            return { 
                status: 'closed', 
                text: language === 'ar' ? `مغلق - يفتح ${todayHours.open}` : `Closed - Opens ${todayHours.open}`
            };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{language === 'ar' ? 'جاري تحميل تفاصيل المتجر...' : 'Loading store details...'}</p>
                </div>
            </div>
        );
    }

    if (!store) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <BuildingStorefrontIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {language === 'ar' ? 'لم يتم العثور على المتجر' : 'Store not found'}
                    </h3>
                    <Link to="/stores" className="text-indigo-600 hover:text-indigo-800">
                        {language === 'ar' ? 'العودة للمتاجر' : 'Back to stores'}
                    </Link>
                </div>
            </div>
        );
    }

    const dayStatus = getCurrentDayStatus();

    return (
        <div className="min-h-screen bg-gray-50" dir={direction}>
            {/* Image Gallery */}
            <div className="relative">
                <div className="h-80 md:h-96 overflow-hidden">
                    <img 
                        src={store.photos[activeImageIndex]} 
                        alt={store.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                
                {/* Image Navigation */}
                {store.photos.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="flex space-x-2">
                            {store.photos.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImageIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-colors ${
                                        index === activeImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons Overlay */}
                <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                        onClick={handleShare}
                        className="bg-white bg-opacity-90 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                    >
                        <ShareIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                        onClick={toggleFavorite}
                        className="bg-white bg-opacity-90 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                    >
                        {isFavorited ? (
                            <HeartSolidIcon className="h-5 w-5 text-red-500" />
                        ) : (
                            <HeartIcon className="h-5 w-5 text-gray-600" />
                        )}
                    </button>
                </div>

                {/* Verified Badge */}
                {store.verified && (
                    <div className="absolute top-4 left-4">
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                            <CheckBadgeIcon className="h-4 w-4 mr-1" />
                            {language === 'ar' ? 'معتمد' : 'Verified'}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Store Header */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                        {store.name}
                                    </h1>
                                    <div className="flex items-center space-x-4 mb-3">
                                        <div className="flex items-center">
                                            {renderStars(store.rating)}
                                            <span className="ml-2 text-lg font-semibold text-gray-900">
                                                {store.rating}
                                            </span>
                                            <span className="ml-1 text-gray-600">
                                                ({store.total_reviews} {language === 'ar' ? 'تقييم' : 'reviews'})
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-gray-600 mb-2">
                                        <MapPinIcon className="h-5 w-5 mr-2" />
                                        <span>{store.address}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <ClockIcon className="h-5 w-5 mr-2" />
                                        <span className={`font-medium ${
                                            dayStatus.status === 'open' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {dayStatus.text}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <EyeIcon className="h-4 w-4" />
                                    <span>{store.total_visits} {language === 'ar' ? 'زيارة' : 'visits'}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <button
                                    onClick={handleCall}
                                    className="flex items-center justify-center bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    <PhoneIcon className="h-5 w-5 mr-2" />
                                    {language === 'ar' ? 'اتصال' : 'Call'}
                                </button>
                                
                                <button
                                    onClick={handleDirections}
                                    className="flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    <MapPinIcon className="h-5 w-5 mr-2" />
                                    {language === 'ar' ? 'اتجاهات' : 'Directions'}
                                </button>
                                
                                {store.website && (
                                    <button
                                        onClick={handleWebsite}
                                        className="flex items-center justify-center bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                                    >
                                        <GlobeAltIcon className="h-5 w-5 mr-2" />
                                        {language === 'ar' ? 'موقع' : 'Website'}
                                    </button>
                                )}
                                
                                <button
                                    onClick={handleShare}
                                    className="flex items-center justify-center bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                                >
                                    <ShareIcon className="h-5 w-5 mr-2" />
                                    {language === 'ar' ? 'مشاركة' : 'Share'}
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                {language === 'ar' ? 'حول المتجر' : 'About'}
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                {showFullDescription ? store.description : store.description.slice(0, 300) + '...'}
                            </p>
                            <button
                                onClick={() => setShowFullDescription(!showFullDescription)}
                                className="text-indigo-600 hover:text-indigo-800 font-medium mt-2"
                            >
                                {showFullDescription ? 
                                    (language === 'ar' ? 'عرض أقل' : 'Show less') : 
                                    (language === 'ar' ? 'عرض المزيد' : 'Show more')
                                }
                            </button>
                        </div>

                        {/* Menu Categories */}
                        {store.menu_categories && store.menu_categories.length > 0 && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    {language === 'ar' ? 'فئات القائمة' : 'Menu Categories'}
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {store.menu_categories.map((category, index) => (
                                        <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                                            <div className="text-lg font-semibold text-gray-900">
                                                {category.count}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {category.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Photo Gallery */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                {language === 'ar' ? 'الصور' : 'Photos'}
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {store.photos.map((photo, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImageIndex(index)}
                                        className="aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                                    >
                                        <img 
                                            src={photo} 
                                            alt={`${store.name} photo ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        
                        {/* Opening Hours */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {language === 'ar' ? 'ساعات العمل' : 'Opening Hours'}
                            </h3>
                            <div className="space-y-2">
                                {Object.entries(store.opening_hours).map(([day, hours]) => (
                                    <div key={day} className="flex justify-between items-center text-sm">
                                        <span className="capitalize font-medium text-gray-700">
                                            {language === 'ar' ? {
                                                monday: 'الاثنين',
                                                tuesday: 'الثلاثاء', 
                                                wednesday: 'الأربعاء',
                                                thursday: 'الخميس',
                                                friday: 'الجمعة',
                                                saturday: 'السبت',
                                                sunday: 'الأحد'
                                            }[day] : day}
                                        </span>
                                        <span className={`${hours.closed ? 'text-red-600' : 'text-gray-900'}`}>
                                            {hours.closed ? 
                                                (language === 'ar' ? 'مغلق' : 'Closed') : 
                                                `${hours.open} - ${hours.close}`
                                            }
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Map */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {language === 'ar' ? 'الموقع' : 'Location'}
                            </h3>
                            <div className="aspect-video bg-gray-200 rounded-lg mb-4 relative overflow-hidden">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${store.latitude},${store.longitude}&zoom=15`}
                                    allowFullScreen
                                    className="rounded-lg"
                                    title="Store Location"
                                ></iframe>
                                {/* Fallback for demo */}
                                <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                                    <div className="text-center">
                                        <MapPinIcon className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">
                                            {language === 'ar' ? 'خريطة الموقع' : 'Location Map'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleDirections}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                {language === 'ar' ? 'الحصول على الاتجاهات' : 'Get Directions'}
                            </button>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {language === 'ar' ? 'معلومات الاتصال' : 'Contact Info'}
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                                    <a 
                                        href={`tel:${store.phone}`}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        {store.phone}
                                    </a>
                                </div>
                                {store.email && (
                                    <div className="flex items-center">
                                        <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-3" />
                                        <a 
                                            href={`mailto:${store.email}`}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            {store.email}
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
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            {language === 'ar' ? 'زيارة الموقع' : 'Visit Website'}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreDetailsPage;