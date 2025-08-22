import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    ShareIcon,
    HeartIcon,
    StarIcon,
    ClockIcon,
    BriefcaseIcon,
    CurrencyDollarIcon,
    CheckBadgeIcon,
    UserIcon,
    EyeIcon,
    ChartBarIcon,
    GlobeAltIcon,
    ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import {
    HeartIcon as HeartSolidIcon,
    StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';
import { useLanguage } from '../../contexts/LanguageContext';

const FreelancerProfilePage = () => {
    const { id } = useParams();
    const { t, direction, language } = useLanguage();
    const [freelancer, setFreelancer] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false);
    const [activePortfolioIndex, setActivePortfolioIndex] = useState(0);

    // Mock freelancer data
    const mockFreelancer = {
        freelancer_id: 1,
        user: {
            first_name: "Ahmad",
            last_name: "Al-Mansour",
            email: "ahmad.mansour@example.com"
        },
        professional_title: "Full Stack Web Developer & UI/UX Designer",
        bio: "I am a passionate full-stack developer with over 5 years of experience in creating modern web applications. I specialize in React.js, Node.js, and modern design principles. I have worked with numerous clients across Jordan and the Middle East, delivering high-quality solutions that drive business growth. My expertise includes e-commerce platforms, business websites, mobile applications, and custom software solutions. I pride myself on clear communication, meeting deadlines, and exceeding client expectations.",
        skills: [
            "React.js", "Node.js", "JavaScript", "TypeScript", "PHP", "Laravel", 
            "MySQL", "MongoDB", "UI/UX Design", "Figma", "Photoshop", "HTML/CSS"
        ],
        hourly_rate: 25,
        experience_level: "expert",
        location: {
            city: "Amman",
            country: "Jordan"
        },
        languages: ["Arabic", "English", "French"],
        availability_status: "available",
        profile_image: "/api/placeholder/200/200",
        portfolio_images: [
            "/api/placeholder/600/400",
            "/api/placeholder/600/400",
            "/api/placeholder/600/400",
            "/api/placeholder/600/400",
            "/api/placeholder/600/400"
        ],
        average_rating: 4.9,
        total_reviews: 87,
        total_projects: 156,
        response_time: "within 1 hour",
        verification_status: "verified",
        member_since: "2019-03-15",
        last_seen: "2024-08-22T10:30:00Z"
    };

    const mockServices = [
        {
            service_id: 1,
            title: "Complete E-commerce Website Development",
            description: "I will create a fully functional e-commerce website with payment integration, inventory management, and admin panel.",
            base_price: 500,
            delivery_time: 14,
            category: "Web Development",
            rating: 4.9,
            orders_completed: 45,
            featured_image: "/api/placeholder/400/250"
        },
        {
            service_id: 2,
            title: "Modern Business Website Design",
            description: "Professional business website with responsive design, SEO optimization, and content management system.",
            base_price: 250,
            delivery_time: 7,
            category: "Web Design",
            rating: 4.8,
            orders_completed: 32,
            featured_image: "/api/placeholder/400/250"
        },
        {
            service_id: 3,
            title: "Mobile App UI/UX Design",
            description: "Complete mobile app design including user research, wireframes, prototypes, and final designs.",
            base_price: 300,
            delivery_time: 10,
            category: "UI/UX Design",
            rating: 5.0,
            orders_completed: 28,
            featured_image: "/api/placeholder/400/250"
        }
    ];

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setFreelancer(mockFreelancer);
            setServices(mockServices);
            setLoading(false);
        }, 1000);
    }, [id]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${freelancer.user.first_name} ${freelancer.user.last_name} - ${freelancer.professional_title}`,
                text: freelancer.bio,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert(language === 'ar' ? 'تم نسخ الرابط' : 'Link copied to clipboard');
        }
    };

    const toggleFavorite = () => {
        setIsFavorited(!isFavorited);
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

    const getExperienceLabel = (level) => {
        const labels = {
            beginner: language === 'ar' ? 'مبتدئ' : 'Beginner',
            intermediate: language === 'ar' ? 'متوسط' : 'Intermediate', 
            expert: language === 'ar' ? 'خبير' : 'Expert'
        };
        return labels[level] || level;
    };

    const getAvailabilityStatus = (status) => {
        const statuses = {
            available: { 
                label: language === 'ar' ? 'متوفر' : 'Available',
                color: 'text-green-600 bg-green-100'
            },
            busy: {
                label: language === 'ar' ? 'مشغول' : 'Busy', 
                color: 'text-yellow-600 bg-yellow-100'
            },
            unavailable: {
                label: language === 'ar' ? 'غير متوفر' : 'Unavailable',
                color: 'text-red-600 bg-red-100'
            }
        };
        return statuses[status] || statuses.available;
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

    if (!freelancer) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <UserIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {language === 'ar' ? 'لم يتم العثور على المستقل' : 'Freelancer not found'}
                    </h3>
                    <Link to="/freelancers" className="text-indigo-600 hover:text-indigo-800">
                        {language === 'ar' ? 'العودة للمستقلين' : 'Back to freelancers'}
                    </Link>
                </div>
            </div>
        );
    }

    const availability = getAvailabilityStatus(freelancer.availability_status);

    return (
        <div className="min-h-screen bg-gray-50" dir={direction}>
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                        
                        {/* Profile Image */}
                        <div className="relative">
                            <img 
                                src={freelancer.profile_image} 
                                alt={`${freelancer.user.first_name} ${freelancer.user.last_name}`}
                                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover"
                            />
                            {freelancer.verification_status === 'verified' && (
                                <div className="absolute -bottom-2 -right-2">
                                    <div className="bg-green-500 text-white p-2 rounded-full">
                                        <CheckBadgeIcon className="h-5 w-5" />
                                    </div>
                                </div>
                            )}
                            <div className="absolute -top-2 -right-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${availability.color}`}>
                                    {availability.label}
                                </span>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left text-white">
                            <h1 className="text-2xl md:text-4xl font-bold mb-2">
                                {freelancer.user.first_name} {freelancer.user.last_name}
                            </h1>
                            <p className="text-lg md:text-xl opacity-90 mb-4">
                                {freelancer.professional_title}
                            </p>
                            
                            <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-6 mb-4">
                                <div className="flex items-center">
                                    {renderStars(freelancer.average_rating)}
                                    <span className="ml-2 font-semibold">
                                        {freelancer.average_rating}
                                    </span>
                                    <span className="ml-1 opacity-80">
                                        ({freelancer.total_reviews} {language === 'ar' ? 'تقييم' : 'reviews'})
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <MapPinIcon className="h-5 w-5 mr-1" />
                                    <span>{freelancer.location.city}, {freelancer.location.country}</span>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-6">
                                <div className="flex items-center">
                                    <CurrencyDollarIcon className="h-5 w-5 mr-1" />
                                    <span className="font-semibold">${freelancer.hourly_rate}/hr</span>
                                </div>
                                <div className="flex items-center">
                                    <ChartBarIcon className="h-5 w-5 mr-1" />
                                    <span>{getExperienceLabel(freelancer.experience_level)}</span>
                                </div>
                                <div className="flex items-center">
                                    <ClockIcon className="h-5 w-5 mr-1" />
                                    <span>{language === 'ar' ? 'يرد خلال' : 'Responds'} {freelancer.response_time}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                            <button
                                onClick={handleShare}
                                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-colors"
                            >
                                <ShareIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={toggleFavorite}
                                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-colors"
                            >
                                {isFavorited ? (
                                    <HeartSolidIcon className="h-5 w-5 text-red-400" />
                                ) : (
                                    <HeartIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* About */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                {language === 'ar' ? 'حول المستقل' : 'About'}
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                {freelancer.bio}
                            </p>
                        </div>

                        {/* Skills */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                {language === 'ar' ? 'المهارات' : 'Skills'}
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {freelancer.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Portfolio */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                {language === 'ar' ? 'معرض الأعمال' : 'Portfolio'}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {freelancer.portfolio_images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActivePortfolioIndex(index)}
                                        className="aspect-video rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                                    >
                                        <img 
                                            src={image} 
                                            alt={`Portfolio ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Services */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                {language === 'ar' ? 'الخدمات المتاحة' : 'Available Services'}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {services.map(service => (
                                    <div key={service.service_id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                        <img 
                                            src={service.featured_image} 
                                            alt={service.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                                                    {service.category}
                                                </span>
                                                <div className="flex items-center">
                                                    {renderStars(service.rating)}
                                                    <span className="ml-1 text-sm text-gray-600">
                                                        ({service.orders_completed})
                                                    </span>
                                                </div>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                                {service.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {service.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="text-lg font-bold text-gray-900">
                                                    ${service.base_price}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {service.delivery_time} {language === 'ar' ? 'أيام' : 'days'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        
                        {/* Contact */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {language === 'ar' ? 'تواصل معي' : 'Contact Me'}
                                </h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${availability.color}`}>
                                    {availability.label}
                                </span>
                            </div>
                            <div className="space-y-3 mb-4">
                                <button className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center">
                                    <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                                    {language === 'ar' ? 'إرسال رسالة' : 'Send Message'}
                                </button>
                                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center">
                                    <PhoneIcon className="h-5 w-5 mr-2" />
                                    {language === 'ar' ? 'اتصال صوتي' : 'Voice Call'}
                                </button>
                            </div>
                            <div className="text-sm text-gray-600">
                                <div className="flex items-center mb-2">
                                    <ClockIcon className="h-4 w-4 mr-2" />
                                    <span>{language === 'ar' ? 'يرد عادة خلال' : 'Usually responds'} {freelancer.response_time}</span>
                                </div>
                                <div className="flex items-center">
                                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                                    <span>{freelancer.user.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {language === 'ar' ? 'الإحصائيات' : 'Statistics'}
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">{language === 'ar' ? 'المشاريع المكتملة' : 'Projects Completed'}</span>
                                    <span className="font-semibold">{freelancer.total_projects}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">{language === 'ar' ? 'معدل التقييم' : 'Average Rating'}</span>
                                    <span className="font-semibold">{freelancer.average_rating}/5</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">{language === 'ar' ? 'عدد التقييمات' : 'Total Reviews'}</span>
                                    <span className="font-semibold">{freelancer.total_reviews}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">{language === 'ar' ? 'عضو منذ' : 'Member Since'}</span>
                                    <span className="font-semibold">
                                        {new Date(freelancer.member_since).getFullYear()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Languages */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {language === 'ar' ? 'اللغات' : 'Languages'}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {freelancer.languages.map((lang, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                                    >
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
                            </h3>
                            <div className="text-sm text-gray-600">
                                <div className="flex items-center">
                                    <EyeIcon className="h-4 w-4 mr-2" />
                                    <span>
                                        {language === 'ar' ? 'شوهد آخر مرة' : 'Last seen'}: {' '}
                                        {new Date(freelancer.last_seen).toLocaleDateString(language === 'ar' ? 'ar' : 'en')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreelancerProfilePage;