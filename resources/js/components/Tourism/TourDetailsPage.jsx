import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    MapPinIcon,
    PhoneIcon,
    ShareIcon,
    HeartIcon,
    StarIcon,
    ClockIcon,
    UsersIcon,
    CurrencyDollarIcon,
    CheckBadgeIcon,
    CalendarDaysIcon,
    GlobeAltIcon,
    FireIcon,
    EyeIcon,
    BookmarkIcon,
    ChatBubbleLeftIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {
    HeartIcon as HeartSolidIcon,
    StarIcon as StarSolidIcon,
    BookmarkIcon as BookmarkSolidIcon
} from '@heroicons/react/24/solid';
import { useLanguage } from '../../contexts/LanguageContext';

const TourDetailsPage = () => {
    const { id } = useParams();
    const { t, direction, language } = useLanguage();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedPackage, setSelectedPackage] = useState('standard');

    // Mock tour data
    const mockTour = {
        tour_id: 1,
        title: "Petra Day Tour - Wonder of the World",
        description: "Embark on an unforgettable journey to Petra, one of the New Seven Wonders of the World. This comprehensive day tour takes you through the ancient Nabataean city, including the famous Treasury, Monastery, and Royal Tombs. Our expert guides will share fascinating stories about the history, culture, and architectural marvels of this UNESCO World Heritage Site.",
        highlights: "Visit the iconic Treasury (Al-Khazneh)\nExplore the ancient Roman Theater\nHike to the Monastery (Ad-Deir)\nSee the Royal Tombs and Colonnaded Street\nLearn about Nabataean civilization\nProfessional archaeological guide\nTraditional Jordanian lunch included",
        inclusions: [
            "Professional English/Arabic speaking guide",
            "Transportation from Amman",
            "Entry tickets to Petra",
            "Traditional Jordanian lunch",
            "Bottled water and snacks",
            "Hotel pickup and drop-off"
        ],
        exclusions: [
            "Personal expenses",
            "Tips for guide and driver",
            "Travel insurance",
            "Alcoholic beverages"
        ],
        itinerary: "07:00 - Pickup from Amman hotels\n09:30 - Arrival at Petra Visitor Center\n10:00 - Start exploring Petra with guide\n12:30 - Traditional lunch break\n14:00 - Continue Petra exploration\n16:30 - End of tour, departure to Amman\n19:00 - Arrival back to Amman",
        tour_type: "historical",
        difficulty_level: "moderate",
        duration_days: 1,
        duration_hours: 10,
        price_adult: 75,
        price_child: 50,
        price_senior: 65,
        currency: "JOD",
        min_participants: 2,
        max_participants: 15,
        advance_booking_hours: 24,
        instant_booking: false,
        cancellation_policy: "moderate",
        pickup_locations: [
            "Amman Hotels",
            "Queen Alia International Airport",
            "Amman Bus Station"
        ],
        destinations: ["Petra", "Wadi Musa"],
        meeting_point: "Petra Visitor Center, Wadi Musa",
        requirements: [
            "Comfortable walking shoes required",
            "Minimum age: 8 years",
            "Moderate fitness level needed",
            "Sun hat and sunscreen recommended"
        ],
        what_to_bring: [
            "Camera",
            "Comfortable walking shoes", 
            "Sun protection",
            "Small backpack",
            "Cash for personal expenses"
        ],
        languages_offered: ["English", "Arabic", "French"],
        featured_image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        gallery_images: [
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1583421432315-8c8bf6d7b2b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        average_rating: 4.8,
        total_reviews: 324,
        total_bookings: 1250,
        views_count: 5420,
        provider: {
            company_name: "Jordan Heritage Tours",
            representative_name: "Ahmad Al-Mansour",
            phone: "+962 79 123 4567",
            email: "info@jordanheritage.com",
            main_office_city: "Amman",
            years_experience: 8,
            average_rating: 4.9,
            total_tours: 45,
            verification_status: "verified",
            specialties: ["Historical Sites", "Cultural Tours", "Petra Tours"]
        }
    };

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setTour(mockTour);
            setLoading(false);
        }, 1000);
    }, [id]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: tour.title,
                text: tour.description,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert(language === 'ar' ? 'تم نسخ الرابط' : 'Link copied to clipboard');
        }
    };

    const handleBooking = () => {
        // Here you would redirect to booking page or open booking modal
        alert(language === 'ar' ? 'سيتم توجيهك لصفحة الحجز' : 'You will be redirected to booking page');
    };

    const handleContactProvider = () => {
        window.open(`tel:${tour.provider.phone}`);
    };

    const toggleFavorite = () => {
        setIsFavorited(!isFavorited);
    };

    const toggleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />);
        }

        if (hasHalfStar) {
            stars.push(<StarIcon key="half" className="h-4 w-4 text-yellow-400" />);
        }

        const remainingStars = 5 - Math.ceil(rating);
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<StarIcon key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
        }

        return stars;
    };

    const getDifficultyColor = (level) => {
        const colors = {
            easy: 'text-green-600 bg-green-100',
            moderate: 'text-yellow-600 bg-yellow-100',
            challenging: 'text-orange-600 bg-orange-100',
            extreme: 'text-red-600 bg-red-100'
        };
        return colors[level] || colors.easy;
    };

    const getDifficultyLabel = (level) => {
        const labels = {
            easy: language === 'ar' ? 'سهل' : 'Easy',
            moderate: language === 'ar' ? 'متوسط' : 'Moderate',
            challenging: language === 'ar' ? 'صعب' : 'Challenging',
            extreme: language === 'ar' ? 'صعب جداً' : 'Extreme'
        };
        return labels[level] || level;
    };

    const getCancellationPolicy = (policy) => {
        const policies = {
            flexible: language === 'ar' ? 'مرن - إلغاء مجاني حتى 24 ساعة' : 'Flexible - Free cancellation up to 24 hours',
            moderate: language === 'ar' ? 'معتدل - إلغاء مجاني حتى 48 ساعة' : 'Moderate - Free cancellation up to 48 hours', 
            strict: language === 'ar' ? 'صارم - إلغاء مجاني حتى 7 أيام' : 'Strict - Free cancellation up to 7 days'
        };
        return policies[policy] || policies.moderate;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
                </div>
            </div>
        );
    }

    if (!tour) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <GlobeAltIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {language === 'ar' ? 'لم يتم العثور على الجولة' : 'Tour not found'}
                    </h3>
                    <Link to="/tourism" className="text-indigo-600 hover:text-indigo-800">
                        {language === 'ar' ? 'العودة للجولات' : 'Back to tours'}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" dir={direction}>
            {/* Image Gallery */}
            <div className="relative">
                <div className="h-80 md:h-96 overflow-hidden">
                    <img 
                        src={tour.gallery_images[activeImageIndex]} 
                        alt={tour.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                
                {/* Image Navigation */}
                {tour.gallery_images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="flex space-x-2">
                            {tour.gallery_images.map((_, index) => (
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
                        onClick={toggleBookmark}
                        className="bg-white bg-opacity-90 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                    >
                        {isBookmarked ? (
                            <BookmarkSolidIcon className="h-5 w-5 text-indigo-500" />
                        ) : (
                            <BookmarkIcon className="h-5 w-5 text-gray-600" />
                        )}
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

                {/* Tour Type & Difficulty */}
                <div className="absolute top-4 left-4 flex space-x-2">
                    <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <FireIcon className="h-4 w-4 mr-1" />
                        {t(`tourism.tourTypes.${tour.tour_type}`)}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(tour.difficulty_level)}`}>
                        {getDifficultyLabel(tour.difficulty_level)}
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Tour Header */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                {tour.title}
                            </h1>
                            
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                <div className="flex items-center">
                                    {renderStars(tour.average_rating)}
                                    <span className="ml-2 font-semibold text-gray-900">{tour.average_rating}</span>
                                    <span className="ml-1 text-gray-600">
                                        ({tour.total_reviews} {language === 'ar' ? 'تقييم' : 'reviews'})
                                    </span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <MapPinIcon className="h-4 w-4 mr-1" />
                                    <span>{tour.destinations.join(', ')}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <EyeIcon className="h-4 w-4 mr-1" />
                                    <span>{tour.views_count} {language === 'ar' ? 'مشاهدة' : 'views'}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <ClockIcon className="h-6 w-6 text-gray-600 mx-auto mb-1" />
                                    <div className="text-sm font-medium text-gray-900">
                                        {tour.duration_days} {language === 'ar' ? 
                                            (tour.duration_days === 1 ? 'يوم' : 'أيام') : 
                                            (tour.duration_days === 1 ? 'day' : 'days')
                                        }
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {tour.duration_hours}h
                                    </div>
                                </div>
                                
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <UsersIcon className="h-6 w-6 text-gray-600 mx-auto mb-1" />
                                    <div className="text-sm font-medium text-gray-900">
                                        {tour.min_participants}-{tour.max_participants}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {language === 'ar' ? 'أشخاص' : 'people'}
                                    </div>
                                </div>
                                
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <GlobeAltIcon className="h-6 w-6 text-gray-600 mx-auto mb-1" />
                                    <div className="text-sm font-medium text-gray-900">
                                        {tour.languages_offered.length}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {language === 'ar' ? 'لغات' : 'languages'}
                                    </div>
                                </div>
                                
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <CalendarDaysIcon className="h-6 w-6 text-gray-600 mx-auto mb-1" />
                                    <div className="text-sm font-medium text-gray-900">
                                        {tour.advance_booking_hours}h
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {language === 'ar' ? 'حجز مسبق' : 'advance booking'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                {language === 'ar' ? 'وصف الجولة' : 'Tour Description'}
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                {tour.description}
                            </p>
                            
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                {language === 'ar' ? 'أبرز المعالم' : 'Highlights'}
                            </h3>
                            <div className="text-gray-700">
                                {tour.highlights.split('\n').map((highlight, index) => (
                                    <div key={index} className="flex items-start mb-2">
                                        <CheckBadgeIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span>{highlight}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Inclusions & Exclusions */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                        <CheckBadgeIcon className="h-5 w-5 text-green-500 mr-2" />
                                        {language === 'ar' ? 'متضمن' : 'Included'}
                                    </h3>
                                    <ul className="space-y-2">
                                        {tour.inclusions.map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <CheckBadgeIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700 text-sm">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                        <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                                        {language === 'ar' ? 'غير متضمن' : 'Not Included'}
                                    </h3>
                                    <ul className="space-y-2">
                                        {tour.exclusions.map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700 text-sm">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Itinerary */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                {language === 'ar' ? 'برنامج الرحلة' : 'Itinerary'}
                            </h2>
                            <div className="space-y-3">
                                {tour.itinerary.split('\n').map((item, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3"></div>
                                        <span className="text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Requirements & What to Bring */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        {language === 'ar' ? 'المتطلبات' : 'Requirements'}
                                    </h3>
                                    <ul className="space-y-2">
                                        {tour.requirements.map((req, index) => (
                                            <li key={index} className="flex items-start">
                                                <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700 text-sm">{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        {language === 'ar' ? 'ما يجب إحضاره' : 'What to Bring'}
                                    </h3>
                                    <ul className="space-y-2">
                                        {tour.what_to_bring.map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <CheckBadgeIcon className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700 text-sm">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Sidebar */}
                    <div className="space-y-6">
                        
                        {/* Booking Card */}
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
                            <div className="text-center mb-6">
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    {tour.price_adult} {tour.currency}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {language === 'ar' ? 'للشخص البالغ' : 'per adult'}
                                </div>
                                
                                {tour.price_child && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        {language === 'ar' ? 'الأطفال:' : 'Children:'} {tour.price_child} {tour.currency}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleBooking}
                                className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg mb-4"
                            >
                                {language === 'ar' ? 'احجز الآن' : 'Book Now'}
                            </button>

                            <button
                                onClick={handleContactProvider}
                                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium mb-4 flex items-center justify-center"
                            >
                                <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                                {language === 'ar' ? 'تواصل مع المقدم' : 'Contact Provider'}
                            </button>

                            <div className="text-sm text-gray-600 space-y-2">
                                <div className="flex justify-between">
                                    <span>{language === 'ar' ? 'سياسة الإلغاء:' : 'Cancellation:'}</span>
                                    <span>{getCancellationPolicy(tour.cancellation_policy)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{language === 'ar' ? 'حجز فوري:' : 'Instant booking:'}</span>
                                    <span>{tour.instant_booking ? 
                                        (language === 'ar' ? 'نعم' : 'Yes') : 
                                        (language === 'ar' ? 'لا' : 'No')
                                    }</span>
                                </div>
                            </div>
                        </div>

                        {/* Tour Provider */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {language === 'ar' ? 'مقدم الجولة' : 'Tour Provider'}
                            </h3>
                            
                            <div className="flex items-center mb-4">
                                {tour.provider.verification_status === 'verified' && (
                                    <CheckBadgeIcon className="h-5 w-5 text-green-500 mr-2" />
                                )}
                                <h4 className="font-semibold text-gray-900">
                                    {tour.provider.company_name}
                                </h4>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center">
                                    {renderStars(tour.provider.average_rating)}
                                    <span className="ml-2 font-semibold">{tour.provider.average_rating}</span>
                                    <span className="ml-1 text-gray-600 text-sm">
                                        ({tour.provider.total_tours} {language === 'ar' ? 'جولات' : 'tours'})
                                    </span>
                                </div>
                                
                                <div className="flex items-center text-sm text-gray-600">
                                    <MapPinIcon className="h-4 w-4 mr-2" />
                                    <span>{tour.provider.main_office_city}</span>
                                </div>
                                
                                <div className="flex items-center text-sm text-gray-600">
                                    <ClockIcon className="h-4 w-4 mr-2" />
                                    <span>{tour.provider.years_experience} {language === 'ar' ? 'سنوات خبرة' : 'years experience'}</span>
                                </div>

                                <div className="pt-3 border-t">
                                    <h5 className="font-medium text-gray-900 mb-2">
                                        {language === 'ar' ? 'التخصصات:' : 'Specialties:'}
                                    </h5>
                                    <div className="flex flex-wrap gap-1">
                                        {tour.provider.specialties.map((specialty, index) => (
                                            <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pickup Locations */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {language === 'ar' ? 'نقاط الانطلاق' : 'Pickup Locations'}
                            </h3>
                            <div className="space-y-2">
                                {tour.pickup_locations.map((location, index) => (
                                    <div key={index} className="flex items-center text-sm text-gray-600">
                                        <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                                        <span>{location}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>{language === 'ar' ? 'نقطة اللقاء:' : 'Meeting Point:'}</strong> {tour.meeting_point}
                                </p>
                            </div>
                        </div>

                        {/* Languages */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {language === 'ar' ? 'لغات الجولة' : 'Tour Languages'}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {tour.languages_offered.map((lang, index) => (
                                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourDetailsPage;