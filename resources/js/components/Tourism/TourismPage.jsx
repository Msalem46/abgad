import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    MagnifyingGlassIcon,
    MapPinIcon,
    StarIcon,
    ClockIcon,
    UsersIcon,
    CurrencyDollarIcon,
    EyeIcon,
    GlobeAltIcon,
    BuildingLibraryIcon,
    HeartIcon,
    CameraIcon,
    FireIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';

const TourismPage = () => {
    const { t, direction, language } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTourType, setSelectedTourType] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [priceRange, setPriceRange] = useState('');
    const [loading, setLoading] = useState(true);
    const [tours, setTours] = useState([]);
    const [providers, setProviders] = useState([]);

    // Mock data for demonstration
    const mockTours = [
        {
            id: 1,
            title: 'Petra Day Tour - Wonder of the World',
            description: 'Explore the ancient city of Petra, one of the New Seven Wonders of the World. Walk through the Siq canyon and marvel at the Treasury.',
            tour_type: 'historical',
            duration_days: 1,
            price_adult: 75,
            featured_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop&q=80',
            average_rating: 4.8,
            total_reviews: 324,
            provider: {
                company_name: 'Jordan Heritage Tours',
                main_office_city: 'Amman'
            },
            destinations: ['Petra', 'Little Petra'],
            difficulty_level: 'moderate'
        },
        {
            id: 2,
            title: 'Wadi Rum Desert Adventure',
            description: 'Experience the magical desert landscape of Wadi Rum. Jeep tours, camel riding, and overnight camping under the stars.',
            tour_type: 'adventure',
            duration_days: 2,
            price_adult: 120,
            featured_image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=250&fit=crop&q=80',
            average_rating: 4.9,
            total_reviews: 187,
            provider: {
                company_name: 'Desert Stars Tourism',
                main_office_city: 'Aqaba'
            },
            destinations: ['Wadi Rum'],
            difficulty_level: 'easy'
        },
        {
            id: 3,
            title: 'Dead Sea Wellness Experience',
            description: 'Relax and rejuvenate at the lowest point on Earth. Enjoy the therapeutic mud and floating in the mineral-rich waters.',
            tour_type: 'nature',
            duration_days: 1,
            price_adult: 45,
            featured_image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop&q=80',
            average_rating: 4.6,
            total_reviews: 256,
            provider: {
                company_name: 'Wellness Jordan',
                main_office_city: 'Madaba'
            },
            destinations: ['Dead Sea'],
            difficulty_level: 'easy'
        },
        {
            id: 4,
            title: 'Jordan Trail Hiking Adventure',
            description: 'Multi-day hiking experience through diverse landscapes from Dana to Petra along the famous Jordan Trail.',
            tour_type: 'adventure',
            duration_days: 5,
            price_adult: 350,
            featured_image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=250&fit=crop&q=80',
            average_rating: 4.7,
            total_reviews: 89,
            provider: {
                company_name: 'Mountain Adventures Jordan',
                main_office_city: 'Dana'
            },
            destinations: ['Dana', 'Shobak', 'Petra'],
            difficulty_level: 'challenging'
        },
        {
            id: 5,
            title: 'Jerash & Ajloun Historical Tour',
            description: 'Discover the best-preserved Roman city of Jerash and the medieval Ajloun Castle in one incredible day.',
            tour_type: 'historical',
            duration_days: 1,
            price_adult: 65,
            featured_image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=250&fit=crop&q=80',
            average_rating: 4.5,
            total_reviews: 143,
            provider: {
                company_name: 'Ancient Jordan Tours',
                main_office_city: 'Jerash'
            },
            destinations: ['Jerash', 'Ajloun'],
            difficulty_level: 'easy'
        },
        {
            id: 6,
            title: 'Aqaba Red Sea Diving',
            description: 'Explore the vibrant coral reefs of the Red Sea. Perfect for both beginners and experienced divers.',
            tour_type: 'diving',
            duration_days: 1,
            price_adult: 95,
            featured_image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=250&fit=crop&q=80',
            average_rating: 4.8,
            total_reviews: 201,
            provider: {
                company_name: 'Red Sea Divers',
                main_office_city: 'Aqaba'
            },
            destinations: ['Aqaba'],
            difficulty_level: 'moderate'
        }
    ];

    const tourTypeIcons = {
        cultural: BuildingLibraryIcon,
        adventure: FireIcon,
        historical: BuildingLibraryIcon,
        nature: GlobeAltIcon,
        religious: HeartIcon,
        city: GlobeAltIcon,
        desert: FireIcon,
        diving: GlobeAltIcon
    };

    const difficultyColors = {
        easy: 'text-green-600 bg-green-100',
        moderate: 'text-yellow-600 bg-yellow-100',
        challenging: 'text-orange-600 bg-orange-100',
        extreme: 'text-red-600 bg-red-100'
    };

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setTours(mockTours);
            setLoading(false);
        }, 1000);
    }, []);

    const filteredTours = tours.filter(tour => {
        const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            tour.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = !selectedTourType || tour.tour_type === selectedTourType;
        const matchesCity = !selectedCity || tour.destinations.includes(selectedCity);
        const matchesPrice = !priceRange || 
            (priceRange === 'low' && tour.price_adult < 50) ||
            (priceRange === 'medium' && tour.price_adult >= 50 && tour.price_adult < 150) ||
            (priceRange === 'high' && tour.price_adult >= 150);
        
        return matchesSearch && matchesType && matchesCity && matchesPrice;
    });

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedTourType('');
        setSelectedCity('');
        setPriceRange('');
    };

    const renderTourCard = (tour) => {
        const IconComponent = tourTypeIcons[tour.tour_type] || GlobeAltIcon;
        
        return (
            <div key={tour.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative">
                    <img 
                        src={tour.featured_image} 
                        alt={tour.title}
                        className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[tour.difficulty_level]}`}>
                            {language === 'ar' ? 
                                (tour.difficulty_level === 'easy' ? 'سهل' :
                                 tour.difficulty_level === 'moderate' ? 'متوسط' :
                                 tour.difficulty_level === 'challenging' ? 'صعب' : 'صعب جداً') :
                                tour.difficulty_level.charAt(0).toUpperCase() + tour.difficulty_level.slice(1)
                            }
                        </span>
                    </div>
                    <div className="absolute top-3 right-3">
                        <div className="bg-white bg-opacity-90 rounded-full p-1.5">
                            <IconComponent className="h-4 w-4 text-gray-600" />
                        </div>
                    </div>
                    <div className="absolute bottom-3 right-3">
                        <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-sm font-medium">
                            {tour.duration_days} {language === 'ar' ? 
                                (tour.duration_days === 1 ? 'يوم' : 'أيام') : 
                                (tour.duration_days === 1 ? 'day' : 'days')
                            }
                        </div>
                    </div>
                </div>
                
                <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                            {tour.title}
                        </h3>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {tour.description}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span>{tour.destinations.join(', ')}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                        <BuildingLibraryIcon className="h-4 w-4 mr-1" />
                        <span>{tour.provider.company_name}</span>
                        <span className="mx-2">•</span>
                        <span>{tour.provider.main_office_city}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex items-center mr-4">
                                <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="ml-1 text-sm font-medium text-gray-900">
                                    {tour.average_rating}
                                </span>
                                <span className="ml-1 text-sm text-gray-500">
                                    ({tour.total_reviews})
                                </span>
                            </div>
                        </div>
                        
                        <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                                {tour.price_adult} {language === 'ar' ? 'د.أ' : 'JOD'}
                            </div>
                            <div className="text-sm text-gray-500">
                                {language === 'ar' ? 'للفرد' : 'per person'}
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                        <Link 
                            to={`/tour/${tour.id}`}
                            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium text-center"
                        >
                            {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                        </Link>
                        <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
                            <HeartIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{language === 'ar' ? 'جاري تحميل الرحلات السياحية...' : 'Loading tours...'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" dir={direction}>
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            {t('tourism.title')}
                        </h1>
                        <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
                            {t('tourism.subtitle')}
                        </p>
                        <Link
                            to="/register-tourism"
                            className="inline-flex items-center bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                        >
                            <GlobeAltIcon className="h-5 w-5 mr-2" />
                            {t('tourism.registerProvider')}
                        </Link>
                    </div>
                </div>
                
                {/* Decorative shapes */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-white bg-opacity-10 rounded-full -translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 right-0 w-60 h-60 bg-white bg-opacity-5 rounded-full translate-x-20 translate-y-20"></div>
            </div>

            {/* Filters & Search */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {language === 'ar' ? 'البحث' : 'Search Tours'}
                            </label>
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={language === 'ar' ? 'ابحث عن الجولات...' : 'Search tours...'}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {language === 'ar' ? 'نوع الجولة' : 'Tour Type'}
                            </label>
                            <select
                                value={selectedTourType}
                                onChange={(e) => setSelectedTourType(e.target.value)}
                                className="w-full py-3 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</option>
                                <option value="cultural">{t('tourism.tourTypes.cultural')}</option>
                                <option value="adventure">{t('tourism.tourTypes.adventure')}</option>
                                <option value="historical">{t('tourism.tourTypes.historical')}</option>
                                <option value="nature">{t('tourism.tourTypes.nature')}</option>
                                <option value="diving">{t('tourism.tourTypes.diving')}</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {language === 'ar' ? 'الوجهة' : 'Destination'}
                            </label>
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="w-full py-3 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">{language === 'ar' ? 'جميع الوجهات' : 'All Destinations'}</option>
                                <option value="Petra">Petra</option>
                                <option value="Wadi Rum">Wadi Rum</option>
                                <option value="Dead Sea">Dead Sea</option>
                                <option value="Aqaba">Aqaba</option>
                                <option value="Jerash">Jerash</option>
                                <option value="Dana">Dana</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {language === 'ar' ? 'نطاق السعر' : 'Price Range'}
                            </label>
                            <select
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-full py-3 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">{language === 'ar' ? 'جميع الأسعار' : 'All Prices'}</option>
                                <option value="low">{language === 'ar' ? 'أقل من 50 د.أ' : 'Under 50 JOD'}</option>
                                <option value="medium">{language === 'ar' ? '50-150 د.أ' : '50-150 JOD'}</option>
                                <option value="high">{language === 'ar' ? 'أكثر من 150 د.أ' : 'Over 150 JOD'}</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            {language === 'ar' ? 
                                `تم العثور على ${filteredTours.length} جولة` :
                                `Found ${filteredTours.length} tours`
                            }
                        </p>
                        <button
                            onClick={resetFilters}
                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            {language === 'ar' ? 'إعادة تعيين الفلاتر' : 'Reset Filters'}
                        </button>
                    </div>
                </div>

                {/* Tours Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {filteredTours.map(tour => renderTourCard(tour))}
                </div>

                {/* Empty State */}
                {filteredTours.length === 0 && (
                    <div className="text-center py-16">
                        <GlobeAltIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {language === 'ar' ? 'لا توجد جولات' : 'No tours found'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {language === 'ar' ? 'جرب تعديل فلاتر البحث للعثور على جولات' : 'Try adjusting your search filters to find tours'}
                        </p>
                        <button
                            onClick={resetFilters}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            {language === 'ar' ? 'إعادة تعيين الفلاتر' : 'Reset Filters'}
                        </button>
                    </div>
                )}

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        {language === 'ar' ? 'هل أنت مقدم خدمات سياحية؟' : 'Are you a tourism provider?'}
                    </h2>
                    <p className="text-lg opacity-90 mb-6">
                        {language === 'ar' ? 
                            'انضم إلى منصتنا واعرض جولاتك السياحية للآلاف من المسافرين' :
                            'Join our platform and showcase your tours to thousands of travelers'
                        }
                    </p>
                    <Link
                        to="/register-tourism"
                        className="inline-flex items-center bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                    >
                        <GlobeAltIcon className="h-5 w-5 mr-2" />
                        {t('tourism.registerProvider')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TourismPage;