import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    ArrowRightIcon,
    StarIcon,
    MapPinIcon,
    CurrencyDollarIcon,
    UsersIcon,
    TrophyIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '../../contexts/LanguageContext';

const NewHomePage = () => {
    const { t, direction, language } = useLanguage();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [counters, setCounters] = useState({
        stores: 0,
        freelancers: 0,
        services: 0,
        customers: 0
    });

    // Hero slides data
    const heroSlides = [
        {
            image: 'https://images.unsplash.com/photo-1544734677-f2424e1dc2c7?w=1920&h=1080&fit=crop',
            title: language === 'ar' ? 'اكتشف الأردن كما لم تره من قبل' : 'Discover Jordan Like Never Before',
            subtitle: language === 'ar' ? 'بوابتك لمتاجر رائعة وجولات لا تُنسى وخدمات متميزة' : 'Your gateway to amazing stores, unforgettable tours, and premium services'
        },
        {
            image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d0d66f?w=1920&h=1080&fit=crop',
            title: language === 'ar' ? 'استكشف أفضل المتاجر والخدمات' : 'Explore the Best Stores & Services',
            subtitle: language === 'ar' ? 'اعثر على كل ما تحتاجه من محترفين مهرة ومتاجر موثوقة' : 'Find everything you need from skilled freelancers and trusted stores'
        },
        {
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop',
            title: language === 'ar' ? 'رحلات استكشافية مميزة' : 'Premium Adventure Tours',
            subtitle: language === 'ar' ? 'اكتشف جمال الأردن مع مرشدين خبراء ورحلات مخصصة' : 'Discover Jordan\'s beauty with expert guides and customized tours'
        }
    ];

    // Auto-slide hero
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [heroSlides.length]);

    // Animated counters
    useEffect(() => {
        const animateCounters = () => {
            const targets = { stores: 150, freelancers: 300, services: 500, customers: 2500 };
            const duration = 2000;
            const steps = 60;
            const stepDuration = duration / steps;

            Object.keys(targets).forEach(key => {
                let current = 0;
                const increment = targets[key] / steps;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= targets[key]) {
                        current = targets[key];
                        clearInterval(timer);
                    }
                    setCounters(prev => ({ ...prev, [key]: Math.floor(current) }));
                }, stepDuration);
            });
        };

        const timer = setTimeout(animateCounters, 1000);
        return () => clearTimeout(timer);
    }, []);

    const featuredStores = [
        {
            id: 1,
            name: language === 'ar' ? 'تك هب للإلكترونيات' : 'TechHub Electronics',
            description: language === 'ar' ? 'أحدث الأجهزة والإلكترونيات مع ضمان ودعم الخبراء' : 'Latest gadgets and electronics with warranty and expert support',
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
            rating: 4.9,
            reviews: 234,
            priceRange: language === 'ar' ? '50 - 2000 دينار' : '$50 - $2000',
            badge: language === 'ar' ? 'الأعلى تقييماً' : 'Top Rated'
        },
        {
            id: 2,
            name: language === 'ar' ? 'شارع الأزياء' : 'Fashion Avenue',
            description: language === 'ar' ? 'ملابس عصرية وإكسسوارات لجميع المناسبات' : 'Trendy clothes and accessories for all occasions',
            image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop',
            rating: 4.8,
            reviews: 187,
            priceRange: language === 'ar' ? '25 - 300 دينار' : '$25 - $300',
            badge: language === 'ar' ? 'وصل حديثاً' : 'New Arrival'
        },
        {
            id: 3,
            name: language === 'ar' ? 'الجمال والعافية' : 'Beauty & Wellness',
            description: language === 'ar' ? 'منتجات تجميل عالية الجودة ومستلزمات العافية' : 'Premium beauty products and wellness essentials',
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop',
            rating: 4.9,
            reviews: 156,
            priceRange: language === 'ar' ? '15 - 150 دينار' : '$15 - $150',
            badge: language === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller'
        }
    ];

    const featuredFreelancers = [
        {
            id: 1,
            name: language === 'ar' ? 'أحمد محمد' : 'Ahmad Mohammad',
            title: language === 'ar' ? 'مطور ويب متكامل' : 'Full Stack Developer',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
            rating: 4.9,
            reviews: 45,
            hourlyRate: language === 'ar' ? '25 دينار/ساعة' : '$25/hour',
            skills: language === 'ar' ? ['React', 'Laravel', 'تصميم UI/UX'] : ['React', 'Laravel', 'UI/UX Design'],
            location: language === 'ar' ? 'عمّان' : 'Amman'
        },
        {
            id: 2,
            name: language === 'ar' ? 'فاطمة أحمد' : 'Fatima Ahmad',
            title: language === 'ar' ? 'مصممة جرافيك' : 'Graphic Designer',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b6cc?w=300&h=300&fit=crop',
            rating: 4.8,
            reviews: 38,
            hourlyRate: language === 'ar' ? '20 دينار/ساعة' : '$20/hour',
            skills: language === 'ar' ? ['Photoshop', 'Illustrator', 'العلامات التجارية'] : ['Photoshop', 'Illustrator', 'Branding'],
            location: language === 'ar' ? 'إربد' : 'Irbid'
        },
        {
            id: 3,
            name: language === 'ar' ? 'محمد حسام' : 'Mohammad Husam',
            title: language === 'ar' ? 'مختص تسويق رقمي' : 'Digital Marketing Specialist',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
            rating: 4.9,
            reviews: 52,
            hourlyRate: language === 'ar' ? '30 دينار/ساعة' : '$30/hour',
            skills: language === 'ar' ? ['SEO', 'وسائل التواصل', 'إعلانات جوجل'] : ['SEO', 'Social Media', 'Google Ads'],
            location: language === 'ar' ? 'الزرقاء' : 'Zarqa'
        }
    ];

    const services = [
        {
            icon: '🚗',
            title: language === 'ar' ? 'النقل والمواصلات' : 'Transportation',
            description: language === 'ar' ? 'خدمات نقل مريحة وموثوقة مع سائقين محترفين' : 'Comfortable and reliable transportation services with professional drivers',
            price: language === 'ar' ? 'من 30 دينار/يوم' : 'From $30/day'
        },
        {
            icon: '🏨',
            title: language === 'ar' ? 'الإقامة والفنادق' : 'Accommodation',
            description: language === 'ar' ? 'فنادق ومنتجعات مختارة بعناية لتجربة إقامة مثالية' : 'Handpicked hotels and resorts for a perfect stay experience',
            price: language === 'ar' ? 'من 50 دينار/ليلة' : 'From $50/night'
        },
        {
            icon: '🍽️',
            title: language === 'ar' ? 'المطاعم والطعام' : 'Dining',
            description: language === 'ar' ? 'المأكولات الأردنية الأصيلة وتجارب طعام عالمية' : 'Authentic Jordanian cuisine and international dining experiences',
            price: language === 'ar' ? 'من 15 دينار/وجبة' : 'From $15/meal'
        },
        {
            icon: '📸',
            title: language === 'ar' ? 'التصوير الفوتوغرافي' : 'Photography',
            description: language === 'ar' ? 'خدمات تصوير احترافية لالتقاط ذكرياتك الجميلة' : 'Professional photography services to capture your memories',
            price: language === 'ar' ? 'من 100 دينار/جلسة' : 'From $100/session'
        }
    ];

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

    return (
        <div className="min-h-screen bg-gray-50" dir={direction}>
            {/* Hero Section */}
            <section className="relative h-screen overflow-hidden">
                {/* Background Slides */}
                <div className="absolute inset-0">
                    {heroSlides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${
                                index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            <div 
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${slide.image})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-blue-900/80" />
                        </div>
                    ))}
                </div>

                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-pulse opacity-30"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${3 + Math.random() * 4}s`
                            }}
                        >
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                    ))}
                </div>

                {/* Hero Content */}
                <div className="relative h-full flex items-center justify-center text-center text-white px-4">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            {heroSlides[currentSlide]?.title}
                        </h1>
                        <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                            {heroSlides[currentSlide]?.subtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/stores"
                                className="bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                            >
                                {language === 'ar' ? 'استكشف المتاجر' : 'Explore Stores'}
                            </Link>
                            <Link
                                to="/freelancers"
                                className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:bg-white/30"
                            >
                                {language === 'ar' ? 'اعثر على خبراء' : 'Find Freelancers'}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Slide Indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                            }`}
                        />
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">
                                {counters.stores}+
                            </div>
                            <div className="text-gray-600 font-medium">
                                {language === 'ar' ? 'متجر مميز' : 'Featured Stores'}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">
                                {counters.freelancers}+
                            </div>
                            <div className="text-gray-600 font-medium">
                                {language === 'ar' ? 'مستقل ماهر' : 'Skilled Freelancers'}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">
                                {counters.services}+
                            </div>
                            <div className="text-gray-600 font-medium">
                                {language === 'ar' ? 'خدمة متميزة' : 'Premium Services'}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">
                                {counters.customers}+
                            </div>
                            <div className="text-gray-600 font-medium">
                                {language === 'ar' ? 'عميل سعيد' : 'Happy Customers'}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Stores Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {language === 'ar' ? 'المتاجر المميزة' : 'Featured Stores'}
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {language === 'ar' 
                                ? 'اكتشف أفضل وجهات التسوق مع عروض حصرية ومنتجات عالية الجودة'
                                : 'Discover the best shopping destinations with exclusive deals and premium quality products'
                            }
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredStores.map((store) => (
                            <div
                                key={store.id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group cursor-pointer"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={store.image}
                                        alt={store.name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            {store.badge}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            {language === 'ar' ? 'زيارة المتجر' : 'Visit Store'}
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {store.name}
                                    </h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                        {store.description}
                                    </p>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-lg font-bold text-indigo-600">
                                            {store.priceRange}
                                        </span>
                                        <div className="flex items-center space-x-1">
                                            <div className="flex">
                                                {renderStars(store.rating)}
                                            </div>
                                            <span className="text-sm text-gray-500 ml-1">
                                                {store.rating} ({store.reviews})
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            to="/stores"
                            className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300"
                        >
                            {language === 'ar' ? 'عرض جميع المتاجر' : 'View All Stores'}
                            <ArrowRightIcon className={`h-5 w-5 ${direction === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'}`} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Freelancers Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {language === 'ar' ? 'المستقلون المميزون' : 'Featured Freelancers'}
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {language === 'ar'
                                ? 'تواصل مع محترفين مهرة جاهزين لمساعدتك في مشاريعك'
                                : 'Connect with skilled professionals ready to help with your projects'
                            }
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredFreelancers.map((freelancer) => (
                            <div
                                key={freelancer.id}
                                className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl group cursor-pointer"
                            >
                                <div className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <img
                                            src={freelancer.image}
                                            alt={freelancer.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                {freelancer.name}
                                            </h3>
                                            <p className="text-indigo-600 font-medium text-sm mb-2">
                                                {freelancer.title}
                                            </p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                                <div className="flex items-center">
                                                    <div className="flex">
                                                        {renderStars(freelancer.rating)}
                                                    </div>
                                                    <span className="ml-1">
                                                        {freelancer.rating} ({freelancer.reviews})
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <MapPinIcon className="h-4 w-4 mr-1" />
                                                    <span>{freelancer.location}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-lg font-bold text-gray-900">
                                                    {freelancer.hourlyRate}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {freelancer.skills.slice(0, 3).map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="mt-4">
                                                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-full font-semibold transition-colors duration-300">
                                                    {language === 'ar' ? 'عرض الملف الشخصي' : 'View Profile'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            to="/freelancers"
                            className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300"
                        >
                            {language === 'ar' ? 'عرض جميع المستقلين' : 'View All Freelancers'}
                            <ArrowRightIcon className={`h-5 w-5 ${direction === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'}`} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {language === 'ar' ? 'خدماتنا المتميزة' : 'Our Premium Services'}
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {language === 'ar'
                                ? 'خدمات شاملة مصممة لتجعل تجربتك سلسة ولا تُنسى'
                                : 'Comprehensive services designed to make your experience seamless and memorable'
                            }
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-md p-8 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl group cursor-pointer"
                            >
                                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {service.description}
                                </p>
                                <div className="text-lg font-bold text-indigo-600">
                                    {service.price}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            to="/services"
                            className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                        >
                            {language === 'ar' ? 'استكشف جميع الخدمات' : 'Explore All Services'}
                            <ArrowRightIcon className={`h-5 w-5 ${direction === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'}`} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {language === 'ar' ? 'ابقَ على اطلاع' : 'Stay Updated'}
                    </h2>
                    <p className="text-lg mb-8 opacity-90">
                        {language === 'ar'
                            ? 'احصل على أحدث العروض وباقات الرحلات والعروض الحصرية في صندوق البريد'
                            : 'Get the latest deals, tour packages, and exclusive offers delivered to your inbox'
                        }
                    </p>
                    <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                        <input
                            type="email"
                            placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'}
                            className="flex-1 px-6 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/25"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                        >
                            {language === 'ar' ? 'اشترك' : 'Subscribe'}
                        </button>
                    </form>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8">
                            <TrophyIcon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {language === 'ar' ? 'حائز على جوائز' : 'Award Winning'}
                            </h3>
                            <p className="text-gray-600">
                                {language === 'ar'
                                    ? 'معترف بنا كمزود الخدمات والرحلات الرائد في الأردن مع أكثر من 50 جائزة دولية'
                                    : 'Recognized as Jordan\'s leading tour and service provider with 50+ international awards'
                                }
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
                            <UsersIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {language === 'ar' ? 'عملاء سعداء' : 'Happy Customers'}
                            </h3>
                            <p className="text-gray-600">
                                {language === 'ar'
                                    ? 'أكثر من 10,000 عميل راضٍ وثقوا بنا في تجربتهم الأردنية'
                                    : 'Over 10,000+ satisfied customers have trusted us with their Jordan experience'
                                }
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
                            <ClockIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {language === 'ar' ? 'خبرة محلية' : 'Local Expertise'}
                            </h3>
                            <p className="text-gray-600">
                                {language === 'ar'
                                    ? 'أكثر من 15 عاماً من الخبرة المحلية والمعرفة بكنوز الأردن المخفية'
                                    : '15+ years of local expertise and knowledge of Jordan\'s hidden gems'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NewHomePage;