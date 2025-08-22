import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    MagnifyingGlassIcon, 
    MapPinIcon, 
    StarIcon,
    ClockIcon,
    PhoneIcon,
    GlobeAltIcon,
    BuildingStorefrontIcon,
    FunnelIcon,
    Squares2X2Icon,
    ListBulletIcon,
    HeartIcon,
    ShareIcon,
    EyeIcon,
    ChevronDownIcon,
    XMarkIcon,
    CheckIcon
} from '@heroicons/react/24/outline';
import { 
    StarIcon as StarSolidIcon,
    HeartIcon as HeartSolidIcon,
    MapPinIcon as MapPinSolidIcon
} from '@heroicons/react/24/solid';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';

const StoresPage = () => {
    const { t, direction, language } = useLanguage();
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [priceRange, setPriceRange] = useState('');
    const [sortBy, setSortBy] = useState('rating');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [favoriteStores, setFavoriteStores] = useState(new Set());
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    // Sample store data (in real app, this would come from API)
    const featuredStores = [
        {
            id: 1,
            name: language === 'ar' ? 'تك هب للإلكترونيات' : 'TechHub Electronics',
            description: language === 'ar' 
                ? 'أحدث الأجهزة الإلكترونية والتقنية مع ضمان شامل وخدمة عملاء متميزة' 
                : 'Latest electronic devices and technology with comprehensive warranty and excellent customer service',
            category: language === 'ar' ? 'إلكترونيات' : 'Electronics',
            location: language === 'ar' ? 'عمّان، الأردن' : 'Amman, Jordan',
            rating: 4.9,
            reviews: 234,
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
            hours: language === 'ar' ? '٩ صباحاً - ٩ مساءً' : '9 AM - 9 PM',
            phone: '+962 6 123 4567',
            website: 'www.techhub-jo.com',
            priceRange: '$$',
            isOpen: true,
            isFeatured: true,
            isVerified: true,
            badges: [language === 'ar' ? 'الأعلى تقييماً' : 'Top Rated', language === 'ar' ? 'موثق' : 'Verified'],
            gallery: [
                'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop',
                'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
                'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop'
            ],
            views: 1234,
            established: 2020
        },
        {
            id: 2,
            name: language === 'ar' ? 'شارع الأزياء' : 'Fashion Avenue',
            description: language === 'ar' 
                ? 'أحدث صيحات الموضة والأزياء العصرية للرجال والنساء من أفضل الماركات العالمية' 
                : 'Latest fashion trends and modern clothing for men and women from top international brands',
            category: language === 'ar' ? 'أزياء وملابس' : 'Fashion & Clothing',
            location: language === 'ar' ? 'إربد، الأردن' : 'Irbid, Jordan',
            rating: 4.8,
            reviews: 187,
            image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop',
            hours: language === 'ar' ? '١٠ صباحاً - ١٠ مساءً' : '10 AM - 10 PM',
            phone: '+962 2 234 5678',
            website: 'www.fashionavenue-jo.com',
            priceRange: '$$$',
            isOpen: true,
            isFeatured: true,
            isVerified: true,
            badges: [language === 'ar' ? 'وصل حديثاً' : 'New Arrival', language === 'ar' ? 'أزياء عالمية' : 'International Fashion'],
            gallery: [
                'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop',
                'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300&h=200&fit=crop',
                'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop'
            ],
            views: 987,
            established: 2018
        },
        {
            id: 3,
            name: language === 'ar' ? 'مقهى الأصدقاء' : 'Friends Café',
            description: language === 'ar' 
                ? 'مقهى مريح يقدم أفضل أنواع القهوة والمشروبات الساخنة مع أجواء هادئة ومريحة' 
                : 'Cozy café serving the finest coffee and hot beverages with a quiet and comfortable atmosphere',
            category: language === 'ar' ? 'مقاهي ومطاعم' : 'Cafés & Restaurants',
            location: language === 'ar' ? 'الزرقاء، الأردن' : 'Zarqa, Jordan',
            rating: 4.7,
            reviews: 156,
            image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop',
            hours: language === 'ar' ? '٧ صباحاً - ١١ مساءً' : '7 AM - 11 PM',
            phone: '+962 5 345 6789',
            website: 'www.friendscafe-jo.com',
            priceRange: '$',
            isOpen: true,
            isFeatured: false,
            isVerified: true,
            badges: [language === 'ar' ? 'قهوة طازجة' : 'Fresh Coffee', language === 'ar' ? 'أجواء مريحة' : 'Cozy Atmosphere'],
            gallery: [
                'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=200&fit=crop',
                'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=300&h=200&fit=crop',
                'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=300&h=200&fit=crop'
            ],
            views: 678,
            established: 2019
        },
        {
            id: 4,
            name: language === 'ar' ? 'مركز الجمال والصحة' : 'Beauty & Wellness Center',
            description: language === 'ar' 
                ? 'مركز متخصص في خدمات التجميل والعناية بالبشرة مع أحدث التقنيات والمنتجات الطبيعية' 
                : 'Specialized center for beauty and skincare services with the latest technologies and natural products',
            category: language === 'ar' ? 'جمال وعناية' : 'Beauty & Care',
            location: language === 'ar' ? 'العقبة، الأردن' : 'Aqaba, Jordan',
            rating: 4.9,
            reviews: 203,
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop',
            hours: language === 'ar' ? '٩ صباحاً - ٨ مساءً' : '9 AM - 8 PM',
            phone: '+962 3 456 7890',
            website: 'www.beautywellness-jo.com',
            priceRange: '$$',
            isOpen: false,
            isFeatured: true,
            isVerified: true,
            badges: [language === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller', language === 'ar' ? 'منتجات طبيعية' : 'Natural Products'],
            gallery: [
                'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop',
                'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=300&h=200&fit=crop',
                'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=200&fit=crop'
            ],
            views: 1456,
            established: 2017
        },
        {
            id: 5,
            name: language === 'ar' ? 'مكتبة المعرفة' : 'Knowledge Bookstore',
            description: language === 'ar' 
                ? 'مكتبة شاملة تضم أحدث الكتب والمراجع في جميع المجالات مع قسم خاص للأطفال' 
                : 'Comprehensive bookstore featuring the latest books and references in all fields with a special children\'s section',
            category: language === 'ar' ? 'كتب وقرطاسية' : 'Books & Stationery',
            location: language === 'ar' ? 'السلط، الأردن' : 'Salt, Jordan',
            rating: 4.6,
            reviews: 89,
            image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
            hours: language === 'ar' ? '٨ صباحاً - ٧ مساءً' : '8 AM - 7 PM',
            phone: '+962 5 567 8901',
            website: 'www.knowledgebooks-jo.com',
            priceRange: '$',
            isOpen: true,
            isFeatured: false,
            isVerified: false,
            badges: [language === 'ar' ? 'كتب متنوعة' : 'Diverse Books'],
            gallery: [
                'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
                'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=300&h=200&fit=crop'
            ],
            views: 432,
            established: 2021
        },
        {
            id: 6,
            name: language === 'ar' ? 'متجر الرياضة المتقدم' : 'Advanced Sports Store',
            description: language === 'ar' 
                ? 'متجر متخصص في المعدات الرياضية والملابس الرياضية من أفضل العلامات التجارية العالمية' 
                : 'Specialized store for sports equipment and athletic wear from top international brands',
            category: language === 'ar' ? 'رياضة ولياقة' : 'Sports & Fitness',
            location: language === 'ar' ? 'مادبا، الأردن' : 'Madaba, Jordan',
            rating: 4.5,
            reviews: 134,
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
            hours: language === 'ar' ? '٩ صباحاً - ٩ مساءً' : '9 AM - 9 PM',
            phone: '+962 5 678 9012',
            website: 'www.advancedsports-jo.com',
            priceRange: '$$',
            isOpen: true,
            isFeatured: false,
            isVerified: true,
            badges: [language === 'ar' ? 'معدات احترافية' : 'Professional Equipment'],
            gallery: [
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
                'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=200&fit=crop',
                'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=300&h=200&fit=crop'
            ],
            views: 789,
            established: 2016
        }
    ];

    const categories = [
        { key: 'electronics', label: language === 'ar' ? 'إلكترونيات' : 'Electronics' },
        { key: 'fashion', label: language === 'ar' ? 'أزياء وملابس' : 'Fashion & Clothing' },
        { key: 'food', label: language === 'ar' ? 'مقاهي ومطاعم' : 'Cafés & Restaurants' },
        { key: 'beauty', label: language === 'ar' ? 'جمال وعناية' : 'Beauty & Care' },
        { key: 'books', label: language === 'ar' ? 'كتب وقرطاسية' : 'Books & Stationery' },
        { key: 'sports', label: language === 'ar' ? 'رياضة ولياقة' : 'Sports & Fitness' },
        { key: 'home', label: language === 'ar' ? 'منزل وحديقة' : 'Home & Garden' },
        { key: 'automotive', label: language === 'ar' ? 'سيارات وقطع غيار' : 'Automotive' },
        { key: 'health', label: language === 'ar' ? 'صحة ودواء' : 'Health & Medicine' },
        { key: 'toys', label: language === 'ar' ? 'ألعاب وأطفال' : 'Toys & Kids' }
    ];

    const jordanianCities = [
        { key: 'amman', label: language === 'ar' ? 'عمّان' : 'Amman' },
        { key: 'irbid', label: language === 'ar' ? 'إربد' : 'Irbid' },
        { key: 'zarqa', label: language === 'ar' ? 'الزرقاء' : 'Zarqa' },
        { key: 'aqaba', label: language === 'ar' ? 'العقبة' : 'Aqaba' },
        { key: 'salt', label: language === 'ar' ? 'السلط' : 'Salt' },
        { key: 'madaba', label: language === 'ar' ? 'مادبا' : 'Madaba' },
        { key: 'jerash', label: language === 'ar' ? 'جرش' : 'Jerash' },
        { key: 'karak', label: language === 'ar' ? 'الكرك' : 'Karak' },
        { key: 'tafilah', label: language === 'ar' ? 'الطفيلة' : 'Tafilah' },
        { key: 'maan', label: language === 'ar' ? 'معان' : 'Ma\'an' }
    ];

    const sortOptions = [
        { key: 'rating', label: language === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated' },
        { key: 'reviews', label: language === 'ar' ? 'الأكثر مراجعة' : 'Most Reviewed' },
        { key: 'newest', label: language === 'ar' ? 'الأحدث' : 'Newest' },
        { key: 'name', label: language === 'ar' ? 'الاسم' : 'Name' },
        { key: 'popular', label: language === 'ar' ? 'الأكثر شعبية' : 'Most Popular' }
    ];

    useEffect(() => {
        // In a real app, fetch stores from API
        setStores(featuredStores);
        setLoading(false);
        
        // Simulate pagination
        setPagination({
            current_page: 1,
            per_page: 12,
            total: featuredStores.length,
            last_page: Math.ceil(featuredStores.length / 12)
        });
    }, []);

    // Filter and search logic
    const filteredStores = stores.filter(store => {
        const matchesSearch = !searchQuery || 
            store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            store.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            store.category.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = !selectedCategory || 
            store.category.toLowerCase().includes(selectedCategory);
        
        const matchesCity = !selectedCity || 
            store.location.toLowerCase().includes(selectedCity);
        
        const matchesRating = !selectedRating || store.rating >= parseFloat(selectedRating);

        return matchesSearch && matchesCategory && matchesCity && matchesRating;
    });

    const toggleFavorite = (storeId) => {
        setFavoriteStores(prev => {
            const newSet = new Set(prev);
            if (newSet.has(storeId)) {
                newSet.delete(storeId);
            } else {
                newSet.add(storeId);
            }
            return newSet;
        });
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />);
            } else {
                stars.push(<StarIcon key={i} className="h-4 w-4 text-gray-300" />);
            }
        }
        return stars;
    };

    const getPriceRangeDisplay = (priceRange) => {
        switch (priceRange) {
            case '$': return language === 'ar' ? 'اقتصادي' : 'Budget';
            case '$$': return language === 'ar' ? 'متوسط' : 'Moderate';
            case '$$$': return language === 'ar' ? 'مرتفع' : 'Expensive';
            case '$$$$': return language === 'ar' ? 'فاخر' : 'Luxury';
            default: return '';
        }
    };

    const StoreCard = ({ store, isGrid = true }) => (
        <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group cursor-pointer ${
            !isGrid ? 'flex' : ''
        }`}>
            {/* Store Image */}
            <div className={`relative overflow-hidden ${isGrid ? 'h-48' : 'w-64 h-48 flex-shrink-0'}`}>
                <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex space-x-3">
                        <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors">
                            <EyeIcon className="h-5 w-5" />
                        </button>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(store.id);
                            }}
                            className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                        >
                            {favoriteStores.has(store.id) ? 
                                <HeartSolidIcon className="h-5 w-5 text-red-400" /> : 
                                <HeartIcon className="h-5 w-5" />
                            }
                        </button>
                        <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors">
                            <ShareIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {store.isFeatured && (
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {language === 'ar' ? 'مميز' : 'Featured'}
                        </span>
                    )}
                    {store.isVerified && (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                            <CheckIcon className="h-3 w-3 mr-1" />
                            {language === 'ar' ? 'موثق' : 'Verified'}
                        </span>
                    )}
                </div>

                {/* Store Status */}
                <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        store.isOpen 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {store.isOpen 
                            ? (language === 'ar' ? 'مفتوح' : 'Open')
                            : (language === 'ar' ? 'مغلق' : 'Closed')
                        }
                    </span>
                </div>
            </div>

            {/* Store Content */}
            <div className={`p-6 ${!isGrid ? 'flex-1' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                            {store.name}
                        </h3>
                        <p className="text-indigo-600 font-medium text-sm">
                            {store.category}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-gray-500 text-sm">
                            {getPriceRangeDisplay(store.priceRange)}
                        </div>
                    </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {store.description}
                </p>

                {/* Store Info */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                        <MapPinSolidIcon className="h-4 w-4 mr-2 text-red-400" />
                        <span>{store.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        <span>{store.hours}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <PhoneIcon className="h-4 w-4 mr-2" />
                        <span>{store.phone}</span>
                    </div>
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="flex">
                            {renderStars(store.rating)}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                            {store.rating}
                        </span>
                        <span className="text-sm text-gray-500">
                            ({store.reviews} {language === 'ar' ? 'مراجعة' : 'reviews'})
                        </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        <span>{store.views}</span>
                    </div>
                </div>

                {/* Badges */}
                {store.badges && store.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {store.badges.map((badge, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                                {badge}
                            </span>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    <Link
                        to={`/store/${store.id}`}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-center py-2 px-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                        {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                    </Link>
                    {store.website && (
                        <a
                            href={`https://${store.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition-colors"
                        >
                            <GlobeAltIcon className="h-5 w-5" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50" dir={direction}>
            {/* Header Section */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 to-purple-900/50" />
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=400&fit=crop")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.1
                    }} />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            {language === 'ar' ? 'استكشف أفضل المتاجر' : 'Discover Amazing Stores'}
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                            {language === 'ar' 
                                ? 'اكتشف متاجر مميزة وموثوقة في جميع أنحاء الأردن مع أفضل المنتجات والخدمات'
                                : 'Find trusted and verified stores across Jordan with the best products and services'
                            }
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 max-w-md mx-auto">
                            <div className="w-full">
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder={language === 'ar' ? 'ابحث عن المتاجر...' : 'Search stores...'}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/25"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="text-3xl font-bold text-indigo-600">{stores.length}+</div>
                            <div className="text-gray-600">{language === 'ar' ? 'متجر مميز' : 'Featured Stores'}</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-purple-600">4.8+</div>
                            <div className="text-gray-600">{language === 'ar' ? 'متوسط التقييم' : 'Average Rating'}</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-pink-600">10+</div>
                            <div className="text-gray-600">{language === 'ar' ? 'مدن مختلفة' : 'Different Cities'}</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-green-600">50+</div>
                            <div className="text-gray-600">{language === 'ar' ? 'فئة متنوعة' : 'Categories'}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Controls */}
            <div className="bg-white shadow-sm border-b sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                        {/* Filter Controls */}
                        <div className="flex flex-wrap items-center space-x-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors"
                            >
                                <FunnelIcon className="h-4 w-4 mr-2" />
                                {language === 'ar' ? 'فلاتر' : 'Filters'}
                                <ChevronDownIcon className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                {sortOptions.map(option => (
                                    <option key={option.key} value={option.key}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* View Controls */}
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600">
                                {filteredStores.length} {language === 'ar' ? 'متجر' : 'stores found'}
                            </span>
                            
                            <div className="flex items-center bg-gray-100 rounded-full p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-full transition-colors ${
                                        viewMode === 'grid' 
                                            ? 'bg-white text-indigo-600 shadow-sm' 
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    <Squares2X2Icon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-full transition-colors ${
                                        viewMode === 'list' 
                                            ? 'bg-white text-indigo-600 shadow-sm' 
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    <ListBulletIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Expandable Filters */}
                    {showFilters && (
                        <div className="mt-6 p-6 bg-gray-50 rounded-xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {language === 'ar' ? 'الفئة' : 'Category'}
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">{language === 'ar' ? 'جميع الفئات' : 'All Categories'}</option>
                                        {categories.map(category => (
                                            <option key={category.key} value={category.key}>
                                                {category.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {language === 'ar' ? 'المدينة' : 'City'}
                                    </label>
                                    <select
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">{language === 'ar' ? 'جميع المدن' : 'All Cities'}</option>
                                        {jordanianCities.map(city => (
                                            <option key={city.key} value={city.key}>
                                                {city.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {language === 'ar' ? 'التقييم الأدنى' : 'Minimum Rating'}
                                    </label>
                                    <select
                                        value={selectedRating}
                                        onChange={(e) => setSelectedRating(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">{language === 'ar' ? 'أي تقييم' : 'Any Rating'}</option>
                                        <option value="4">4+ {language === 'ar' ? 'نجوم' : 'Stars'}</option>
                                        <option value="4.5">4.5+ {language === 'ar' ? 'نجوم' : 'Stars'}</option>
                                        <option value="4.8">4.8+ {language === 'ar' ? 'نجوم' : 'Stars'}</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {language === 'ar' ? 'نطاق الأسعار' : 'Price Range'}
                                    </label>
                                    <select
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">{language === 'ar' ? 'جميع الأسعار' : 'All Prices'}</option>
                                        <option value="$">{language === 'ar' ? 'اقتصادي ($)' : 'Budget ($)'}</option>
                                        <option value="$$">{language === 'ar' ? 'متوسط ($$)' : 'Moderate ($$)'}</option>
                                        <option value="$$$">{language === 'ar' ? 'مرتفع ($$$)' : 'Expensive ($$$)'}</option>
                                        <option value="$$$$">{language === 'ar' ? 'فاخر ($$$$)' : 'Luxury ($$$$)'}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => {
                                        setSelectedCategory('');
                                        setSelectedCity('');
                                        setSelectedRating('');
                                        setPriceRange('');
                                        setSearchQuery('');
                                    }}
                                    className="flex items-center px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                                >
                                    <XMarkIcon className="h-4 w-4 mr-2" />
                                    {language === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Stores Grid/List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="animate-pulse bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="h-48 bg-gray-200"></div>
                                <div className="p-6">
                                    <div className="space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                        <div className="h-8 bg-gray-200 rounded w-full"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredStores.length > 0 ? (
                    <div className={viewMode === 'grid' 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                        : "space-y-6"
                    }>
                        {filteredStores.map(store => (
                            <StoreCard 
                                key={store.id} 
                                store={store} 
                                isGrid={viewMode === 'grid'} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <BuildingStorefrontIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {language === 'ar' ? 'لم يتم العثور على متاجر' : 'No stores found'}
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {language === 'ar' 
                                ? 'جرب تعديل معايير البحث أو الفلاتر للعثور على المتاجر التي تبحث عنها.'
                                : 'Try adjusting your search criteria or filters to find the stores you\'re looking for.'
                            }
                        </p>
                        <button
                            onClick={() => {
                                setSelectedCategory('');
                                setSelectedCity('');
                                setSelectedRating('');
                                setPriceRange('');
                                setSearchQuery('');
                            }}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition-colors"
                        >
                            {language === 'ar' ? 'مسح جميع الفلاتر' : 'Clear All Filters'}
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="flex justify-center mt-12">
                        <nav className="flex items-center space-x-1">
                            {pagination.current_page > 1 && (
                                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                    {language === 'ar' ? 'السابق' : 'Previous'}
                                </button>
                            )}
                            
                            {[...Array(Math.min(pagination.last_page, 5))].map((_, index) => {
                                const page = index + 1;
                                const isCurrentPage = page === pagination.current_page;
                                
                                return (
                                    <button
                                        key={page}
                                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                                            isCurrentPage
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                            
                            {pagination.current_page < pagination.last_page && (
                                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                    {language === 'ar' ? 'التالي' : 'Next'}
                                </button>
                            )}
                        </nav>
                    </div>
                )}
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {language === 'ar' ? 'هل لديك متجر؟' : 'Own a Store?'}
                    </h2>
                    <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                        {language === 'ar' 
                            ? 'انضم إلى منصتنا واعرض متجرك لآلاف العملاء المحتملين في جميع أنحاء الأردن'
                            : 'Join our platform and showcase your store to thousands of potential customers across Jordan'
                        }
                    </p>
                    <Link
                        to="/register-store"
                        className="inline-flex items-center bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors transform hover:scale-105"
                    >
                        {language === 'ar' ? 'سجل متجرك الآن' : 'Register Your Store Now'}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StoresPage;