import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    MagnifyingGlassIcon, 
    MapPinIcon, 
    StarIcon,
    UserIcon,
    BriefcaseIcon,
    ClockIcon,
    FunnelIcon,
    ListBulletIcon,
    Squares2X2Icon,
    CheckBadgeIcon,
    EyeIcon,
    HeartIcon,
    CurrencyDollarIcon,
    FireIcon,
    BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';

const FreelancersPage = () => {
    const { t, direction, language } = useLanguage();
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedExperience, setSelectedExperience] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [minRating, setMinRating] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [pagination, setPagination] = useState({});

    // Mock data for demonstration
    const mockFreelancers = [
        {
            freelancer_id: 1,
            user: { first_name: 'Ahmed', last_name: 'Al-Mansouri' },
            professional_title: 'Full Stack Developer',
            bio: 'Experienced web developer specializing in React, Laravel, and Node.js. I create modern, responsive web applications with clean code and best practices.',
            profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&q=80',
            rating: 4.8,
            total_reviews: 127,
            completed_projects: 45,
            hourly_rate: 35,
            location: { city: 'Amman' },
            skills: ['React', 'Laravel', 'Node.js', 'MySQL', 'JavaScript'],
            is_verified: true,
            is_available: true,
            experience_level: 'expert',
            category: 'web_development'
        },
        {
            freelancer_id: 2,
            user: { first_name: 'Layla', last_name: 'Qasemi' },
            professional_title: 'UI/UX Designer',
            bio: 'Creative designer with 6+ years of experience in user interface and user experience design. I help businesses create beautiful and functional digital experiences.',
            profile_image: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=150&h=150&fit=crop&crop=face&q=80',
            rating: 4.9,
            total_reviews: 89,
            completed_projects: 78,
            hourly_rate: 40,
            location: { city: 'Irbid' },
            skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
            is_verified: true,
            is_available: true,
            experience_level: 'expert',
            category: 'graphic_design'
        },
        {
            freelancer_id: 3,
            user: { first_name: 'Omar', last_name: 'Hijazi' },
            professional_title: 'Digital Marketing Specialist',
            bio: 'Results-driven marketing professional helping businesses grow their online presence through strategic digital marketing campaigns and social media management.',
            profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&q=80',
            rating: 4.6,
            total_reviews: 156,
            completed_projects: 92,
            hourly_rate: 25,
            location: { city: 'Aqaba' },
            skills: ['SEO', 'Social Media', 'Google Ads', 'Content Marketing', 'Analytics'],
            is_verified: false,
            is_available: true,
            experience_level: 'intermediate',
            category: 'digital_marketing'
        },
        {
            freelancer_id: 4,
            user: { first_name: 'Fatima', last_name: 'Khalil' },
            professional_title: 'Content Writer & Translator',
            bio: 'Professional writer and translator fluent in Arabic and English. I create engaging content and provide accurate translation services for various industries.',
            profile_image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&q=80',
            rating: 4.7,
            total_reviews: 203,
            completed_projects: 134,
            hourly_rate: 20,
            location: { city: 'Zarqa' },
            skills: ['Content Writing', 'Translation', 'Copywriting', 'SEO Writing', 'Blogging'],
            is_verified: true,
            is_available: false,
            experience_level: 'expert',
            category: 'writing_translation'
        },
        {
            freelancer_id: 5,
            user: { first_name: 'Khaled', last_name: 'Nasser' },
            professional_title: 'Mobile App Developer',
            bio: 'Mobile app developer with expertise in iOS and Android development. I build high-quality, user-friendly mobile applications using the latest technologies.',
            profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&q=80',
            rating: 4.5,
            total_reviews: 67,
            completed_projects: 23,
            hourly_rate: 45,
            location: { city: 'Amman' },
            skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase'],
            is_verified: false,
            is_available: true,
            experience_level: 'intermediate',
            category: 'mobile_development'
        },
        {
            freelancer_id: 6,
            user: { first_name: 'Nour', last_name: 'Abdallah' },
            professional_title: 'Graphic Designer',
            bio: 'Creative graphic designer specializing in brand identity, logo design, and digital artwork. I help businesses create memorable visual identities.',
            profile_image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face&q=80',
            rating: 4.8,
            total_reviews: 112,
            completed_projects: 85,
            hourly_rate: 30,
            location: { city: 'Salt' },
            skills: ['Adobe Illustrator', 'Photoshop', 'Brand Design', 'Logo Design', 'Print Design'],
            is_verified: true,
            is_available: true,
            experience_level: 'expert',
            category: 'graphic_design'
        }
    ];

    const categories = [
        'web_development', 'mobile_development', 'graphic_design', 
        'writing_translation', 'digital_marketing', 'video_animation',
        'music_audio', 'programming_tech', 'business', 'photography', 
        'consulting', 'education', 'other'
    ];

    const categoryIcons = {
        web_development: BuildingLibraryIcon,
        mobile_development: FireIcon,
        graphic_design: FireIcon,
        writing_translation: BuildingLibraryIcon,
        digital_marketing: FireIcon,
        video_animation: FireIcon,
        music_audio: BuildingLibraryIcon,
        programming_tech: BuildingLibraryIcon,
        business: BriefcaseIcon,
        photography: FireIcon,
        consulting: BriefcaseIcon,
        education: BuildingLibraryIcon,
        other: BriefcaseIcon
    };

    const experienceLevels = [
        { key: 'beginner', label: 'Beginner (0-2 years)' },
        { key: 'intermediate', label: 'Intermediate (2-5 years)' },
        { key: 'expert', label: 'Expert (5+ years)' }
    ];

    const jordanianCities = [
        'Amman', 'Irbid', 'Zarqa', 'Aqaba', 'Salt', 
        'Madaba', 'Jerash', 'Ajloun', 'Karak', 'Tafilah', 'Maan', 'Mafraq'
    ];

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setFreelancers(mockFreelancers);
            setPagination({
                current_page: 1,
                last_page: 1,
                total: mockFreelancers.length
            });
            setLoading(false);
        }, 1000);
    }, []);

    const fetchFreelancers = async (page = 1) => {
        // This would be the real API call
        console.log('Fetching freelancers...');
    };

    const filteredFreelancers = freelancers.filter(freelancer => {
        const matchesSearch = freelancer.user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            freelancer.user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            freelancer.professional_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            freelancer.bio.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || freelancer.category === selectedCategory;
        const matchesExperience = !selectedExperience || freelancer.experience_level === selectedExperience;
        const matchesLocation = !selectedLocation || freelancer.location?.city === selectedLocation;
        const matchesRating = !minRating || freelancer.rating >= parseFloat(minRating);
        
        return matchesSearch && matchesCategory && matchesExperience && matchesLocation && matchesRating;
    });

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setSelectedExperience('');
        setSelectedLocation('');
        setMinRating('');
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

    const getExperienceColor = (level) => {
        const colors = {
            beginner: 'text-green-600 bg-green-100',
            intermediate: 'text-yellow-600 bg-yellow-100',
            expert: 'text-purple-600 bg-purple-100'
        };
        return colors[level] || colors.beginner;
    };

    const FreelancerCard = ({ freelancer }) => {
        const IconComponent = categoryIcons[freelancer.category] || BriefcaseIcon;
        
        return (
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative">
                    {/* Header with gradient background */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-20 relative">
                        <div className="absolute top-3 right-3">
                            <div className="bg-white bg-opacity-90 rounded-full p-1.5">
                                <IconComponent className="h-4 w-4 text-gray-600" />
                            </div>
                        </div>
                        {freelancer.is_verified && (
                            <div className="absolute top-3 left-3">
                                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                    <CheckBadgeIcon className="h-4 w-4 mr-1" />
                                    {language === 'ar' ? 'معتمد' : 'Verified'}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Profile image overlapping */}
                    <div className="absolute -bottom-8 left-6">
                        <div className="relative">
                            <img 
                                className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-lg" 
                                src={freelancer.profile_image}
                                alt={`${freelancer.user.first_name} ${freelancer.user.last_name}`}
                            />
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                                freelancer.is_available ? 'bg-green-400' : 'bg-gray-400'
                            }`}></div>
                        </div>
                    </div>
                </div>
                
                <div className="pt-10 pb-6 px-6">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {freelancer.user.first_name} {freelancer.user.last_name}
                            </h3>
                            <p className="text-indigo-600 font-medium text-sm mb-2">
                                {freelancer.professional_title}
                            </p>
                        </div>
                        <div className="ml-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getExperienceColor(freelancer.experience_level)}`}>
                                {language === 'ar' ? 
                                    (freelancer.experience_level === 'beginner' ? 'مبتدئ' :
                                     freelancer.experience_level === 'intermediate' ? 'متوسط' : 'خبير') :
                                    freelancer.experience_level.charAt(0).toUpperCase() + freelancer.experience_level.slice(1)
                                }
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center mb-3">
                        <div className="flex items-center mr-4">
                            {renderStars(freelancer.rating)}
                            <span className="ml-1 text-sm font-medium text-gray-900">
                                {freelancer.rating}
                            </span>
                            <span className="ml-1 text-sm text-gray-500">
                                ({freelancer.total_reviews})
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-3">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span className="mr-4">{freelancer.location?.city}</span>
                        <BriefcaseIcon className="h-4 w-4 mr-1" />
                        <span>{freelancer.completed_projects} {language === 'ar' ? 'مشاريع' : 'projects'}</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {freelancer.bio}
                    </p>
                    
                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mb-4">
                        {freelancer.skills?.slice(0, 3).map((skill, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {skill}
                            </span>
                        ))}
                        {freelancer.skills?.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                +{freelancer.skills.length - 3} {language === 'ar' ? 'المزيد' : 'more'}
                            </span>
                        )}
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                freelancer.is_available ? 'text-green-700 bg-green-100' : 'text-gray-700 bg-gray-100'
                            }`}>
                                {freelancer.is_available ? 
                                    (language === 'ar' ? 'متاح' : 'Available') : 
                                    (language === 'ar' ? 'مشغول' : 'Busy')
                                }
                            </span>
                        </div>
                        
                        <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                                {freelancer.hourly_rate} {language === 'ar' ? 'د.أ' : 'JOD'}
                            </div>
                            <div className="text-sm text-gray-500">
                                {language === 'ar' ? 'في الساعة' : 'per hour'}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex space-x-2">
                        <Link 
                            to={`/freelancer/${freelancer.freelancer_id}`}
                            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium text-center"
                        >
                            {language === 'ar' ? 'عرض الملف الشخصي' : 'View Profile'}
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
                    <p className="text-gray-600">{language === 'ar' ? 'جاري تحميل المستقلين...' : 'Loading freelancers...'}</p>
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
                            {language === 'ar' ? 'اعثر على أفضل المستقلين' : 'Find Top Freelancers'}
                        </h1>
                        <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
                            {language === 'ar' ? 
                                'اكتشف المحترفين المهرة الجاهزين لمساعدتك في مشاريعك وتحقيق أهدافك' :
                                'Discover skilled professionals ready to help you achieve your goals and bring your projects to life'
                            }
                        </p>
                        <Link
                            to="/register-freelancer"
                            className="inline-flex items-center bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                        >
                            <UserIcon className="h-5 w-5 mr-2" />
                            {language === 'ar' ? 'انضم كمستقل' : 'Become a Freelancer'}
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
                                {language === 'ar' ? 'البحث' : 'Search Freelancers'}
                            </label>
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={language === 'ar' ? 'ابحث عن المستقلين...' : 'Search freelancers...'}
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
                                    <option key={category} value={category}>
                                        {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {language === 'ar' ? 'مستوى الخبرة' : 'Experience Level'}
                            </label>
                            <select
                                value={selectedExperience}
                                onChange={(e) => setSelectedExperience(e.target.value)}
                                className="w-full py-3 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">{language === 'ar' ? 'جميع المستويات' : 'All Levels'}</option>
                                {experienceLevels.map(level => (
                                    <option key={level.key} value={level.key}>
                                        {level.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {language === 'ar' ? 'الموقع' : 'Location'}
                            </label>
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full py-3 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">{language === 'ar' ? 'جميع المدن' : 'All Cities'}</option>
                                {jordanianCities.map(city => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            {language === 'ar' ? 
                                `تم العثور على ${filteredFreelancers.length} مستقل` :
                                `Found ${filteredFreelancers.length} freelancers`
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

                {/* Freelancers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {filteredFreelancers.map(freelancer => (
                        <FreelancerCard key={freelancer.freelancer_id} freelancer={freelancer} />
                    ))}
                </div>

                {/* Empty State */}
                {filteredFreelancers.length === 0 && (
                    <div className="text-center py-16">
                        <UserIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {language === 'ar' ? 'لا يوجد مستقلين' : 'No freelancers found'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {language === 'ar' ? 'جرب تعديل فلاتر البحث للعثور على مستقلين' : 'Try adjusting your search filters to find freelancers'}
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
                        {language === 'ar' ? 'هل أنت مستقل؟' : 'Are you a freelancer?'}
                    </h2>
                    <p className="text-lg opacity-90 mb-6">
                        {language === 'ar' ? 
                            'انضم إلى منصتنا واعرض مهاراتك للآلاف من العملاء المحتملين' :
                            'Join our platform and showcase your skills to thousands of potential clients'
                        }
                    </p>
                    <Link
                        to="/register-freelancer"
                        className="inline-flex items-center bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                    >
                        <UserIcon className="h-5 w-5 mr-2" />
                        {language === 'ar' ? 'انضم كمستقل' : 'Become a Freelancer'}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FreelancersPage;