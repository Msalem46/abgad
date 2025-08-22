import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    MagnifyingGlassIcon,
    MapPinIcon,
    StarIcon,
    ClockIcon,
    CurrencyDollarIcon,
    CheckBadgeIcon,
    EyeIcon,
    HeartIcon,
    FireIcon,
    BuildingLibraryIcon,
    BriefcaseIcon,
    GlobeAltIcon,
    UsersIcon,
    TagIcon,
    PlayIcon
} from '@heroicons/react/24/outline';
import { 
    StarIcon as StarSolidIcon, 
    HeartIcon as HeartSolidIcon,
    CheckBadgeIcon as CheckBadgeSolidIcon 
} from '@heroicons/react/24/solid';
import { useLanguage } from '../../contexts/LanguageContext';

const ServicesPage = () => {
    const { t, direction, language } = useLanguage();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedPriceRange, setSelectedPriceRange] = useState('');
    const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('');
    const [selectedRating, setSelectedRating] = useState('');

    // Mock data for demonstration
    const mockServices = [
        {
            service_id: 1,
            title: 'Professional Website Development',
            description: 'I will create a modern, responsive website using React and Laravel. Perfect for businesses looking to establish their online presence with a professional, fast-loading website.',
            category: 'web_development',
            subcategory: 'full_stack',
            price_starting: 150,
            delivery_time_days: 7,
            featured_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&q=80',
            gallery_images: [
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&q=80',
                'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop&q=80'
            ],
            rating: 4.9,
            total_reviews: 156,
            total_orders: 234,
            views_count: 1520,
            is_featured: true,
            tags: ['React', 'Laravel', 'Responsive', 'SEO-Ready'],
            freelancer: {
                id: 1,
                name: 'Ahmed Al-Mansouri',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&q=80',
                is_verified: true,
                level: 'expert',
                location: 'Amman'
            },
            packages: [
                { name: 'Basic', price: 150, delivery_days: 7, description: 'Simple landing page' },
                { name: 'Standard', price: 300, delivery_days: 10, description: 'Multi-page website' },
                { name: 'Premium', price: 500, delivery_days: 14, description: 'Full e-commerce solution' }
            ]
        },
        {
            service_id: 2,
            title: 'Brand Identity & Logo Design',
            description: 'Transform your business with a stunning brand identity. I create memorable logos, business cards, and complete brand guidelines that make your business stand out.',
            category: 'graphic_design',
            subcategory: 'branding',
            price_starting: 75,
            delivery_time_days: 3,
            featured_image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=250&fit=crop&q=80',
            gallery_images: [
                'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=250&fit=crop&q=80',
                'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop&q=80'
            ],
            rating: 4.8,
            total_reviews: 89,
            total_orders: 147,
            views_count: 890,
            is_featured: true,
            tags: ['Logo Design', 'Branding', 'Print Ready', 'Unlimited Revisions'],
            freelancer: {
                id: 2,
                name: 'Layla Qasemi',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=150&h=150&fit=crop&crop=face&q=80',
                is_verified: true,
                level: 'expert',
                location: 'Irbid'
            },
            packages: [
                { name: 'Basic', price: 75, delivery_days: 3, description: 'Logo design only' },
                { name: 'Standard', price: 150, delivery_days: 5, description: 'Logo + business card' },
                { name: 'Premium', price: 250, delivery_days: 7, description: 'Complete brand package' }
            ]
        },
        {
            service_id: 3,
            title: 'Digital Marketing Strategy & Management',
            description: 'Boost your online presence with comprehensive digital marketing. I provide SEO, social media management, and Google Ads campaigns to grow your business.',
            category: 'digital_marketing',
            subcategory: 'social_media',
            price_starting: 100,
            delivery_time_days: 5,
            featured_image: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=400&h=250&fit=crop&q=80',
            gallery_images: [
                'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=400&h=250&fit=crop&q=80',
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&q=80'
            ],
            rating: 4.6,
            total_reviews: 123,
            total_orders: 178,
            views_count: 1200,
            is_featured: false,
            tags: ['SEO', 'Social Media', 'Google Ads', 'Analytics'],
            freelancer: {
                id: 3,
                name: 'Omar Hijazi',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&q=80',
                is_verified: false,
                level: 'intermediate',
                location: 'Aqaba'
            },
            packages: [
                { name: 'Basic', price: 100, delivery_days: 5, description: 'SEO audit + strategy' },
                { name: 'Standard', price: 200, delivery_days: 7, description: 'Social media management' },
                { name: 'Premium', price: 350, delivery_days: 14, description: 'Complete marketing package' }
            ]
        },
        {
            service_id: 4,
            title: 'Professional Content Writing & Translation',
            description: 'High-quality content writing and accurate translation services in Arabic and English. Perfect for websites, blogs, marketing materials, and business documents.',
            category: 'writing_translation',
            subcategory: 'content_writing',
            price_starting: 25,
            delivery_time_days: 2,
            featured_image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=250&fit=crop&q=80',
            gallery_images: [
                'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=250&fit=crop&q=80',
                'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop&q=80'
            ],
            rating: 4.7,
            total_reviews: 234,
            total_orders: 312,
            views_count: 980,
            is_featured: false,
            tags: ['Content Writing', 'Translation', 'SEO Writing', 'Copywriting'],
            freelancer: {
                id: 4,
                name: 'Fatima Khalil',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&q=80',
                is_verified: true,
                level: 'expert',
                location: 'Zarqa'
            },
            packages: [
                { name: 'Basic', price: 25, delivery_days: 2, description: '500 words article' },
                { name: 'Standard', price: 50, delivery_days: 3, description: '1000 words + SEO' },
                { name: 'Premium', price: 100, delivery_days: 5, description: '2000 words + translation' }
            ]
        },
        {
            service_id: 5,
            title: 'Mobile App Development (iOS & Android)',
            description: 'Custom mobile app development using React Native and Flutter. I create beautiful, functional mobile applications that work perfectly on both iOS and Android.',
            category: 'mobile_development',
            subcategory: 'cross_platform',
            price_starting: 300,
            delivery_time_days: 14,
            featured_image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop&q=80',
            gallery_images: [
                'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop&q=80',
                'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop&q=80'
            ],
            rating: 4.5,
            total_reviews: 67,
            total_orders: 89,
            views_count: 750,
            is_featured: false,
            tags: ['React Native', 'Flutter', 'iOS', 'Android'],
            freelancer: {
                id: 5,
                name: 'Khaled Nasser',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&q=80',
                is_verified: false,
                level: 'intermediate',
                location: 'Amman'
            },
            packages: [
                { name: 'Basic', price: 300, delivery_days: 14, description: 'Simple app with 3 screens' },
                { name: 'Standard', price: 600, delivery_days: 21, description: 'Full app with backend' },
                { name: 'Premium', price: 1000, delivery_days: 30, description: 'Complex app + deployment' }
            ]
        },
        {
            service_id: 6,
            title: 'Video Editing & Motion Graphics',
            description: 'Professional video editing and motion graphics services. Perfect for social media content, promotional videos, explainer videos, and brand storytelling.',
            category: 'video_animation',
            subcategory: 'video_editing',
            price_starting: 80,
            delivery_time_days: 4,
            featured_image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=250&fit=crop&q=80',
            gallery_images: [
                'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=250&fit=crop&q=80',
                'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&h=250&fit=crop&q=80'
            ],
            rating: 4.8,
            total_reviews: 94,
            total_orders: 134,
            views_count: 1100,
            is_featured: true,
            tags: ['Video Editing', 'Motion Graphics', 'After Effects', 'Social Media'],
            freelancer: {
                id: 6,
                name: 'Nour Abdallah',
                avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face&q=80',
                is_verified: true,
                level: 'expert',
                location: 'Salt'
            },
            packages: [
                { name: 'Basic', price: 80, delivery_days: 4, description: 'Basic video editing' },
                { name: 'Standard', price: 150, delivery_days: 6, description: 'Video + motion graphics' },
                { name: 'Premium', price: 250, delivery_days: 8, description: 'Full production package' }
            ]
        }
    ];

    const categories = [
        { key: 'web_development', name: 'Web Development', icon: BuildingLibraryIcon },
        { key: 'mobile_development', name: 'Mobile Development', icon: FireIcon },
        { key: 'graphic_design', name: 'Graphic Design', icon: FireIcon },
        { key: 'digital_marketing', name: 'Digital Marketing', icon: GlobeAltIcon },
        { key: 'writing_translation', name: 'Writing & Translation', icon: BuildingLibraryIcon },
        { key: 'video_animation', name: 'Video & Animation', icon: PlayIcon },
        { key: 'music_audio', name: 'Music & Audio', icon: FireIcon },
        { key: 'programming_tech', name: 'Programming & Tech', icon: BuildingLibraryIcon },
        { key: 'business', name: 'Business', icon: BriefcaseIcon },
        { key: 'photography', name: 'Photography', icon: FireIcon }
    ];

    const priceRanges = [
        { key: 'budget', label: 'Budget (Under 50 JOD)', min: 0, max: 49 },
        { key: 'standard', label: 'Standard (50-150 JOD)', min: 50, max: 149 },
        { key: 'premium', label: 'Premium (150-500 JOD)', min: 150, max: 499 },
        { key: 'enterprise', label: 'Enterprise (500+ JOD)', min: 500, max: 999999 }
    ];

    const deliveryTimes = [
        { key: '1-3', label: '1-3 Days' },
        { key: '4-7', label: '4-7 Days' },
        { key: '8-14', label: '1-2 Weeks' },
        { key: '15+', label: '2+ Weeks' }
    ];

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setServices(mockServices);
            setLoading(false);
        }, 1000);
    }, []);

    const filteredServices = services.filter(service => {
        const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = !selectedCategory || service.category === selectedCategory;
        const matchesPriceRange = !selectedPriceRange || (() => {
            const range = priceRanges.find(r => r.key === selectedPriceRange);
            return range && service.price_starting >= range.min && service.price_starting <= range.max;
        })();
        const matchesDeliveryTime = !selectedDeliveryTime || (() => {
            if (selectedDeliveryTime === '1-3') return service.delivery_time_days <= 3;
            if (selectedDeliveryTime === '4-7') return service.delivery_time_days >= 4 && service.delivery_time_days <= 7;
            if (selectedDeliveryTime === '8-14') return service.delivery_time_days >= 8 && service.delivery_time_days <= 14;
            if (selectedDeliveryTime === '15+') return service.delivery_time_days >= 15;
            return true;
        })();
        const matchesRating = !selectedRating || service.rating >= parseFloat(selectedRating);
        
        return matchesSearch && matchesCategory && matchesPriceRange && matchesDeliveryTime && matchesRating;
    });

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setSelectedPriceRange('');
        setSelectedDeliveryTime('');
        setSelectedRating('');
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

    const getLevelColor = (level) => {
        const colors = {
            beginner: 'text-green-600 bg-green-100',
            intermediate: 'text-yellow-600 bg-yellow-100',
            expert: 'text-purple-600 bg-purple-100'
        };
        return colors[level] || colors.beginner;
    };

    const ServiceCard = ({ service }) => {
        const categoryData = categories.find(cat => cat.key === service.category);
        const IconComponent = categoryData?.icon || BriefcaseIcon;
        
        return (
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative">
                    <img 
                        src={service.featured_image} 
                        alt={service.title}
                        className="w-full h-48 object-cover"
                    />
                    
                    {/* Featured badge */}
                    {service.is_featured && (
                        <div className="absolute top-3 left-3">
                            <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                <StarSolidIcon className="h-4 w-4 mr-1" />
                                {language === 'ar' ? 'مميز' : 'Featured'}
                            </div>
                        </div>
                    )}

                    {/* Category icon */}
                    <div className="absolute top-3 right-3">
                        <div className="bg-white bg-opacity-90 rounded-full p-1.5">
                            <IconComponent className="h-4 w-4 text-gray-600" />
                        </div>
                    </div>

                    {/* Price badge */}
                    <div className="absolute bottom-3 right-3">
                        <div className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-md font-medium">
                            {language === 'ar' ? 'يبدأ من' : 'Starting at'} {service.price_starting} {language === 'ar' ? 'د.أ' : 'JOD'}
                        </div>
                    </div>
                </div>
                
                <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                            {service.title}
                        </h3>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {service.description}
                    </p>

                    {/* Freelancer info */}
                    <div className="flex items-center mb-4">
                        <img 
                            src={service.freelancer.avatar} 
                            alt={service.freelancer.name}
                            className="h-8 w-8 rounded-full object-cover mr-3"
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                                <p className="text-sm font-medium text-gray-900 truncate mr-2">
                                    {service.freelancer.name}
                                </p>
                                {service.freelancer.is_verified && (
                                    <CheckBadgeSolidIcon className="h-4 w-4 text-green-500" />
                                )}
                            </div>
                            <div className="flex items-center">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getLevelColor(service.freelancer.level)}`}>
                                    {language === 'ar' ? 
                                        (service.freelancer.level === 'beginner' ? 'مبتدئ' :
                                         service.freelancer.level === 'intermediate' ? 'متوسط' : 'خبير') :
                                        service.freelancer.level.charAt(0).toUpperCase() + service.freelancer.level.slice(1)
                                    }
                                </span>
                                <span className="text-xs text-gray-500 ml-2">{service.freelancer.location}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            {renderStars(service.rating)}
                            <span className="ml-1 text-sm font-medium text-gray-900">
                                {service.rating}
                            </span>
                            <span className="ml-1 text-sm text-gray-500">
                                ({service.total_reviews})
                            </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            <span>{service.delivery_time_days} {language === 'ar' ? 
                                (service.delivery_time_days === 1 ? 'يوم' : 'أيام') : 
                                (service.delivery_time_days === 1 ? 'day' : 'days')
                            }</span>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                        {service.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {tag}
                            </span>
                        ))}
                        {service.tags.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                +{service.tags.length - 3} {language === 'ar' ? 'المزيد' : 'more'}
                            </span>
                        )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                            <EyeIcon className="h-4 w-4 mr-1" />
                            <span>{service.views_count} {language === 'ar' ? 'مشاهدة' : 'views'}</span>
                            <span className="mx-2">•</span>
                            <UsersIcon className="h-4 w-4 mr-1" />
                            <span>{service.total_orders} {language === 'ar' ? 'طلبات' : 'orders'}</span>
                        </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                        <Link 
                            to={`/service/${service.service_id}`}
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
                    <p className="text-gray-600">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
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
                            {language === 'ar' ? 'اكتشف الخدمات الاحترافية' : 'Discover Professional Services'}
                        </h1>
                        <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
                            {language === 'ar' ? 
                                'استكشف آلاف الخدمات عالية الجودة من مستقلين محترفين جاهزين لتحقيق أهدافك' :
                                'Explore thousands of high-quality services from professional freelancers ready to bring your vision to life'
                            }
                        </p>
                        <Link
                            to="/register-freelancer"
                            className="inline-flex items-center bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                        >
                            <BriefcaseIcon className="h-5 w-5 mr-2" />
                            {language === 'ar' ? 'ابدأ البيع' : 'Start Selling'}
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
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {language === 'ar' ? 'البحث' : 'Search Services'}
                            </label>
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={language === 'ar' ? 'ابحث عن الخدمات...' : 'Search services...'}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {language === 'ar' ? 'الفئة' : 'Category'}
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full py-3 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">{language === 'ar' ? 'جميع الفئات' : 'All Categories'}</option>
                                {categories.map(category => (
                                    <option key={category.key} value={category.key}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {language === 'ar' ? 'نطاق السعر' : 'Price Range'}
                            </label>
                            <select
                                value={selectedPriceRange}
                                onChange={(e) => setSelectedPriceRange(e.target.value)}
                                className="w-full py-3 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">{language === 'ar' ? 'جميع الأسعار' : 'All Prices'}</option>
                                {priceRanges.map(range => (
                                    <option key={range.key} value={range.key}>
                                        {range.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {language === 'ar' ? 'وقت التسليم' : 'Delivery Time'}
                            </label>
                            <select
                                value={selectedDeliveryTime}
                                onChange={(e) => setSelectedDeliveryTime(e.target.value)}
                                className="w-full py-3 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">{language === 'ar' ? 'أي وقت' : 'Any Time'}</option>
                                {deliveryTimes.map(time => (
                                    <option key={time.key} value={time.key}>
                                        {time.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {language === 'ar' ? 'التقييم الأدنى' : 'Min Rating'}
                            </label>
                            <select
                                value={selectedRating}
                                onChange={(e) => setSelectedRating(e.target.value)}
                                className="w-full py-3 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">{language === 'ar' ? 'أي تقييم' : 'Any Rating'}</option>
                                <option value="4">4+ {language === 'ar' ? 'نجوم' : 'Stars'}</option>
                                <option value="4.5">4.5+ {language === 'ar' ? 'نجوم' : 'Stars'}</option>
                                <option value="4.8">4.8+ {language === 'ar' ? 'نجوم' : 'Stars'}</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            {language === 'ar' ? 
                                `تم العثور على ${filteredServices.length} خدمة` :
                                `Found ${filteredServices.length} services`
                            }
                        </p>
                        <button
                            onClick={clearFilters}
                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            {language === 'ar' ? 'إعادة تعيين الفلاتر' : 'Reset Filters'}
                        </button>
                    </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {filteredServices.map(service => (
                        <ServiceCard key={service.service_id} service={service} />
                    ))}
                </div>

                {/* Empty State */}
                {filteredServices.length === 0 && (
                    <div className="text-center py-16">
                        <BriefcaseIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {language === 'ar' ? 'لا توجد خدمات' : 'No services found'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {language === 'ar' ? 'جرب تعديل فلاتر البحث للعثور على خدمات' : 'Try adjusting your search filters to find services'}
                        </p>
                        <button
                            onClick={clearFilters}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            {language === 'ar' ? 'إعادة تعيين الفلاتر' : 'Reset Filters'}
                        </button>
                    </div>
                )}

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        {language === 'ar' ? 'لديك مهارة أو خدمة تقدمها؟' : 'Have a skill or service to offer?'}
                    </h2>
                    <p className="text-lg opacity-90 mb-6">
                        {language === 'ar' ? 
                            'ابدأ ببيع خدماتك الآن وابني مصدر دخل مستدام من مهاراتك' :
                            'Start selling your services today and build a sustainable income from your skills'
                        }
                    </p>
                    <Link
                        to="/register-freelancer"
                        className="inline-flex items-center bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                    >
                        <BriefcaseIcon className="h-5 w-5 mr-2" />
                        {language === 'ar' ? 'ابدأ البيع الآن' : 'Start Selling Now'}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;