import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    MapPinIcon,
    PhoneIcon,
    ShareIcon,
    HeartIcon,
    StarIcon,
    ClockIcon,
    CurrencyDollarIcon,
    CheckBadgeIcon,
    CalendarDaysIcon,
    GlobeAltIcon,
    FireIcon,
    EyeIcon,
    BookmarkIcon,
    ChatBubbleLeftIcon,
    ExclamationTriangleIcon,
    UserIcon,
    BriefcaseIcon,
    TagIcon,
    PlayIcon,
    BuildingLibraryIcon,
    ShoppingCartIcon,
    TruckIcon,
    DocumentTextIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import {
    HeartIcon as HeartSolidIcon,
    StarIcon as StarSolidIcon,
    BookmarkIcon as BookmarkSolidIcon,
    CheckBadgeIcon as CheckBadgeSolidIcon
} from '@heroicons/react/24/solid';
import { useLanguage } from '../../contexts/LanguageContext';

const ServiceDetailsPage = () => {
    const { id } = useParams();
    const { t, direction, language } = useLanguage();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedPackage, setSelectedPackage] = useState('standard');
    const [showFullDescription, setShowFullDescription] = useState(false);

    // Mock service data
    const mockService = {
        service_id: 1,
        title: "Professional Website Development - Modern & Responsive",
        description: "Transform your business with a cutting-edge website that drives results. I specialize in creating modern, responsive websites using the latest technologies including React, Laravel, and Node.js. Whether you need a simple landing page or a complex e-commerce solution, I deliver high-quality, SEO-optimized websites that engage your audience and convert visitors into customers.\n\nWhat sets my service apart:\n• Custom design tailored to your brand\n• Mobile-first responsive approach\n• SEO optimization included\n• Fast loading times (under 3 seconds)\n• Cross-browser compatibility\n• Clean, maintainable code\n• Post-launch support included\n\nI've helped over 200 businesses establish their online presence with websites that not only look great but also perform exceptionally well in search engines and convert visitors into customers.",
        category: 'web_development',
        subcategory: 'full_stack',
        featured_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop&q=80',
        gallery_images: [
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop&q=80',
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop&q=80',
            'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&h=500&fit=crop&q=80',
            'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=500&fit=crop&q=80',
            'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop&q=80'
        ],
        rating: 4.9,
        total_reviews: 156,
        total_orders: 234,
        views_count: 1520,
        is_featured: true,
        tags: ['React', 'Laravel', 'Node.js', 'Responsive Design', 'SEO', 'E-commerce', 'CMS', 'API Integration'],
        packages: [
            {
                name: 'Basic',
                price: 150,
                delivery_days: 7,
                revisions: 2,
                description: 'Perfect for small businesses and startups',
                features: [
                    'Single page responsive website',
                    'Mobile-friendly design',
                    'Basic SEO optimization',
                    'Contact form integration',
                    '2 rounds of revisions',
                    '30 days support'
                ]
            },
            {
                name: 'Standard',
                price: 300,
                delivery_days: 10,
                revisions: 3,
                description: 'Ideal for growing businesses',
                features: [
                    'Up to 5 pages website',
                    'Custom responsive design',
                    'Advanced SEO optimization',
                    'Contact forms & social integration',
                    'Basic CMS integration',
                    'Google Analytics setup',
                    '3 rounds of revisions',
                    '60 days support'
                ]
            },
            {
                name: 'Premium',
                price: 500,
                delivery_days: 14,
                revisions: 5,
                description: 'Complete solution for established businesses',
                features: [
                    'Unlimited pages',
                    'Custom advanced design',
                    'E-commerce functionality',
                    'Advanced CMS with admin panel',
                    'Payment gateway integration',
                    'Advanced SEO & performance optimization',
                    'Google Analytics & Search Console',
                    'Social media integration',
                    '5 rounds of revisions',
                    '90 days support',
                    'Source code included'
                ]
            }
        ],
        freelancer: {
            id: 1,
            name: 'Ahmed Al-Mansouri',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&q=80',
            is_verified: true,
            level: 'expert',
            location: 'Amman, Jordan',
            rating: 4.8,
            total_reviews: 89,
            total_services: 12,
            years_experience: 6,
            response_time: '1 hour',
            completion_rate: 98,
            specialties: ['React Development', 'Laravel Backend', 'E-commerce Solutions', 'API Integration']
        },
        faqs: [
            {
                question: 'What do you need from me to get started?',
                answer: 'I\'ll need your brand guidelines (if any), content for the website, any specific functionality requirements, and examples of websites you like. Don\'t worry if you don\'t have everything ready - I\'ll guide you through the process.'
            },
            {
                question: 'Do you provide ongoing maintenance?',
                answer: 'Yes, I offer maintenance packages starting from $50/month which includes regular updates, security monitoring, backup management, and minor content changes.'
            },
            {
                question: 'Will my website be mobile-friendly?',
                answer: 'Absolutely! All websites I create are mobile-first and fully responsive, ensuring they look and work perfectly on all devices - phones, tablets, and desktops.'
            },
            {
                question: 'Can you help with hosting and domain setup?',
                answer: 'Yes, I can recommend reliable hosting providers and help you set up your domain. I can also handle the entire setup process for you if needed (additional charges may apply).'
            }
        ],
        requirements: [
            'Clear project brief and requirements',
            'Brand assets (logo, colors, fonts)',
            'Content and images for the website',
            'Any specific functionality needs',
            'Timeline expectations'
        ],
        portfolio_samples: [
            {
                title: 'E-commerce Fashion Store',
                description: 'Modern online store with payment integration',
                image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop&q=80',
                url: '#'
            },
            {
                title: 'Restaurant Website',
                description: 'Elegant restaurant site with online ordering',
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop&q=80',
                url: '#'
            },
            {
                title: 'Corporate Business Site',
                description: 'Professional business website with CMS',
                image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=200&fit=crop&q=80',
                url: '#'
            }
        ]
    };

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setService(mockService);
            setLoading(false);
        }, 1000);
    }, [id]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: service.title,
                text: service.description,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert(language === 'ar' ? 'تم نسخ الرابط' : 'Link copied to clipboard');
        }
    };

    const handleOrder = (packageType) => {
        const selectedPkg = service.packages.find(pkg => pkg.name.toLowerCase() === packageType);
        alert(language === 'ar' ? 
            `سيتم توجيهك لصفحة الطلب - ${selectedPkg.name} باكج (${selectedPkg.price} د.أ)` : 
            `You will be redirected to order page - ${selectedPkg.name} package (${selectedPkg.price} JOD)`
        );
    };

    const handleContactFreelancer = () => {
        alert(language === 'ar' ? 'سيتم توجيهك لصفحة المحادثة' : 'You will be redirected to chat page');
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

    const getLevelColor = (level) => {
        const colors = {
            beginner: 'text-green-600 bg-green-100',
            intermediate: 'text-yellow-600 bg-yellow-100',
            expert: 'text-purple-600 bg-purple-100'
        };
        return colors[level] || colors.beginner;
    };

    const getLevelLabel = (level) => {
        const labels = {
            beginner: language === 'ar' ? 'مبتدئ' : 'Beginner',
            intermediate: language === 'ar' ? 'متوسط' : 'Intermediate',
            expert: language === 'ar' ? 'خبير' : 'Expert'
        };
        return labels[level] || level;
    };

    const getCategoryIcon = (category) => {
        const icons = {
            web_development: BuildingLibraryIcon,
            mobile_development: FireIcon,
            graphic_design: SparklesIcon,
            digital_marketing: GlobeAltIcon,
            writing_translation: DocumentTextIcon,
            video_animation: PlayIcon,
            business: BriefcaseIcon
        };
        return icons[category] || BriefcaseIcon;
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

    if (!service) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <BriefcaseIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {language === 'ar' ? 'لم يتم العثور على الخدمة' : 'Service not found'}
                    </h3>
                    <Link to="/services" className="text-indigo-600 hover:text-indigo-800">
                        {language === 'ar' ? 'العودة للخدمات' : 'Back to services'}
                    </Link>
                </div>
            </div>
        );
    }

    const IconComponent = getCategoryIcon(service.category);
    const selectedPkg = service.packages.find(pkg => pkg.name.toLowerCase() === selectedPackage);

    return (
        <div className="min-h-screen bg-gray-50" dir={direction}>
            {/* Image Gallery */}
            <div className="relative">
                <div className="h-80 md:h-96 overflow-hidden">
                    <img 
                        src={service.gallery_images[activeImageIndex]} 
                        alt={service.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                
                {/* Image Navigation */}
                {service.gallery_images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="flex space-x-2">
                            {service.gallery_images.map((_, index) => (
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

                {/* Service Category & Featured Badge */}
                <div className="absolute top-4 left-4 flex space-x-2">
                    <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <IconComponent className="h-4 w-4 mr-1" />
                        {service.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    {service.is_featured && (
                        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                            <StarSolidIcon className="h-4 w-4 mr-1" />
                            {language === 'ar' ? 'مميز' : 'Featured'}
                        </span>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Service Header */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                {service.title}
                            </h1>
                            
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                <div className="flex items-center">
                                    {renderStars(service.rating)}
                                    <span className="ml-2 font-semibold text-gray-900">{service.rating}</span>
                                    <span className="ml-1 text-gray-600">
                                        ({service.total_reviews} {language === 'ar' ? 'تقييم' : 'reviews'})
                                    </span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <EyeIcon className="h-4 w-4 mr-1" />
                                    <span>{service.views_count} {language === 'ar' ? 'مشاهدة' : 'views'}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <ShoppingCartIcon className="h-4 w-4 mr-1" />
                                    <span>{service.total_orders} {language === 'ar' ? 'طلبات' : 'orders'}</span>
                                </div>
                            </div>

                            {/* Freelancer Quick Info */}
                            <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-4">
                                <img 
                                    src={service.freelancer.avatar} 
                                    alt={service.freelancer.name}
                                    className="h-12 w-12 rounded-full object-cover mr-4"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <h3 className="font-semibold text-gray-900 mr-2">{service.freelancer.name}</h3>
                                        {service.freelancer.is_verified && (
                                            <CheckBadgeSolidIcon className="h-5 w-5 text-green-500" />
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getLevelColor(service.freelancer.level)}`}>
                                            {getLevelLabel(service.freelancer.level)}
                                        </span>
                                        <span>{service.freelancer.location}</span>
                                        <span>{service.freelancer.years_experience} {language === 'ar' ? 'سنوات خبرة' : 'years experience'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {service.tags.map((tag, index) => (
                                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                        <TagIcon className="h-3 w-3 mr-1" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                {language === 'ar' ? 'وصف الخدمة' : 'About This Service'}
                            </h2>
                            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {showFullDescription ? service.description : service.description.slice(0, 500) + '...'}
                            </div>
                            <button
                                onClick={() => setShowFullDescription(!showFullDescription)}
                                className="text-indigo-600 hover:text-indigo-800 font-medium mt-4"
                            >
                                {showFullDescription ? 
                                    (language === 'ar' ? 'عرض أقل' : 'Show Less') : 
                                    (language === 'ar' ? 'عرض المزيد' : 'Read More')
                                }
                            </button>
                        </div>

                        {/* Portfolio Samples */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                {language === 'ar' ? 'أعمال سابقة' : 'Portfolio Samples'}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {service.portfolio_samples.map((sample, index) => (
                                    <div key={index} className="group cursor-pointer">
                                        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-2">
                                            <img 
                                                src={sample.image} 
                                                alt={sample.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                            />
                                        </div>
                                        <h4 className="font-medium text-gray-900 text-sm">{sample.title}</h4>
                                        <p className="text-gray-600 text-xs">{sample.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
                            </h2>
                            <div className="space-y-4">
                                {service.faqs.map((faq, index) => (
                                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                                        <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                                        <p className="text-gray-700 text-sm">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Package Selection & Order */}
                    <div className="space-y-6">
                        
                        {/* Package Selection */}
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {language === 'ar' ? 'اختر الباقة' : 'Select Package'}
                            </h3>
                            
                            {/* Package Tabs */}
                            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4">
                                {service.packages.map((pkg) => (
                                    <button
                                        key={pkg.name}
                                        onClick={() => setSelectedPackage(pkg.name.toLowerCase())}
                                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                            selectedPackage === pkg.name.toLowerCase()
                                                ? 'bg-white text-indigo-600 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {pkg.name}
                                    </button>
                                ))}
                            </div>

                            {/* Selected Package Details */}
                            {selectedPkg && (
                                <div className="mb-6">
                                    <div className="text-center mb-4">
                                        <div className="text-3xl font-bold text-gray-900 mb-1">
                                            {selectedPkg.price} {language === 'ar' ? 'د.أ' : 'JOD'}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {selectedPkg.description}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                                            <ClockIcon className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                                            <div className="text-sm font-medium text-gray-900">
                                                {selectedPkg.delivery_days} {language === 'ar' ? 'أيام' : 'days'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {language === 'ar' ? 'التسليم' : 'Delivery'}
                                            </div>
                                        </div>
                                        
                                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                                            <DocumentTextIcon className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                                            <div className="text-sm font-medium text-gray-900">
                                                {selectedPkg.revisions}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {language === 'ar' ? 'تعديلات' : 'Revisions'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Package Features */}
                                    <div className="mb-6">
                                        <h4 className="font-medium text-gray-900 mb-3">
                                            {language === 'ar' ? 'ما تحصل عليه:' : 'What you get:'}
                                        </h4>
                                        <ul className="space-y-2">
                                            {selectedPkg.features.map((feature, index) => (
                                                <li key={index} className="flex items-start text-sm">
                                                    <CheckBadgeIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-700">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <button
                                        onClick={() => handleOrder(selectedPackage)}
                                        className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg mb-3"
                                    >
                                        {language === 'ar' ? 'اطلب الآن' : 'Order Now'}
                                    </button>

                                    <button
                                        onClick={handleContactFreelancer}
                                        className="w-full bg-gray-100 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
                                    >
                                        <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                                        {language === 'ar' ? 'تواصل مع البائع' : 'Contact Seller'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Freelancer Profile */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {language === 'ar' ? 'عن البائع' : 'About the Seller'}
                            </h3>
                            
                            <div className="flex items-center mb-4">
                                <img 
                                    src={service.freelancer.avatar} 
                                    alt={service.freelancer.name}
                                    className="h-16 w-16 rounded-full object-cover mr-4"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center mb-1">
                                        <h4 className="font-semibold text-gray-900 mr-2">{service.freelancer.name}</h4>
                                        {service.freelancer.is_verified && (
                                            <CheckBadgeSolidIcon className="h-5 w-5 text-green-500" />
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-sm">{service.freelancer.location}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-1">
                                        {renderStars(service.freelancer.rating)}
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">{service.freelancer.rating}</div>
                                    <div className="text-xs text-gray-500">
                                        ({service.freelancer.total_reviews} {language === 'ar' ? 'تقييمات' : 'reviews'})
                                    </div>
                                </div>
                                
                                <div className="text-center">
                                    <div className="text-sm font-medium text-gray-900 mb-1">
                                        {service.freelancer.response_time}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {language === 'ar' ? 'متوسط الرد' : 'Response time'}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">{language === 'ar' ? 'الخدمات:' : 'Services:'}</span>
                                    <span className="font-medium">{service.freelancer.total_services}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">{language === 'ar' ? 'معدل الإنجاز:' : 'Completion rate:'}</span>
                                    <span className="font-medium">{service.freelancer.completion_rate}%</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h5 className="font-medium text-gray-900 mb-2">
                                    {language === 'ar' ? 'التخصصات:' : 'Specialties:'}
                                </h5>
                                <div className="flex flex-wrap gap-1">
                                    {service.freelancer.specialties.map((specialty, index) => (
                                        <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-medium">
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <Link 
                                to={`/freelancer/${service.freelancer.id}`}
                                className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors text-center block font-medium"
                            >
                                {language === 'ar' ? 'عرض الملف الشخصي' : 'View Profile'}
                            </Link>
                        </div>

                        {/* Requirements */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {language === 'ar' ? 'متطلبات الطلب' : 'Requirements'}
                            </h3>
                            <ul className="space-y-2">
                                {service.requirements.map((requirement, index) => (
                                    <li key={index} className="flex items-start text-sm">
                                        <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">{requirement}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailsPage;