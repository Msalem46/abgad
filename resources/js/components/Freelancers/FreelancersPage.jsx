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
    Squares2X2Icon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';

const FreelancersPage = () => {
    const { t, direction } = useLanguage();
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

    const categories = [
        'web_development', 'mobile_development', 'graphic_design', 
        'writing_translation', 'digital_marketing', 'video_animation',
        'music_audio', 'programming_tech', 'business', 'photography', 
        'consulting', 'education', 'other'
    ];

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
        fetchFreelancers();
    }, [searchQuery, selectedCategory, selectedExperience, selectedLocation, minRating]);

    const fetchFreelancers = async (page = 1) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page,
                per_page: 12
            });

            if (searchQuery) params.append('search', searchQuery);
            if (selectedCategory) params.append('category', selectedCategory);
            if (selectedExperience) params.append('experience_level', selectedExperience);
            if (selectedLocation) params.append('location', selectedLocation);
            if (minRating) params.append('min_rating', minRating);

            const response = await api.get(`/freelancers?${params}`);
            setFreelancers(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching freelancers:', error);
            setFreelancers([]);
        } finally {
            setLoading(false);
        }
    };

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

    const FreelancerCard = ({ freelancer }) => (
        <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        {freelancer.profile_image ? (
                            <img 
                                className="h-16 w-16 rounded-full object-cover" 
                                src={`/storage/${freelancer.profile_image}`}
                                alt={freelancer.display_name}
                            />
                        ) : (
                            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                                <UserIcon className="h-8 w-8 text-indigo-600" />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {freelancer.user.first_name} {freelancer.user.last_name}
                            </h3>
                            {freelancer.is_verified && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Verified
                                </span>
                            )}
                        </div>
                        
                        <p className="text-sm font-medium text-indigo-600 mb-1">
                            {freelancer.professional_title}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                            <div className="flex items-center">
                                {renderStars(freelancer.rating)}
                                <span className="ml-1">({freelancer.total_reviews})</span>
                            </div>
                            
                            {freelancer.location?.city && (
                                <div className="flex items-center">
                                    <MapPinIcon className="h-4 w-4 mr-1" />
                                    <span>{freelancer.location.city}</span>
                                </div>
                            )}
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {freelancer.bio}
                        </p>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                                <BriefcaseIcon className="h-4 w-4 mr-1" />
                                <span>{freelancer.completed_projects} projects completed</span>
                            </div>
                            
                            {freelancer.hourly_rate && (
                                <div className="text-lg font-semibold text-gray-900">
                                    {freelancer.hourly_rate} JOD/hr
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-1 mt-3">
                            {freelancer.skills?.slice(0, 3).map((skill, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {skill}
                                </span>
                            ))}
                            {freelancer.skills?.length > 3 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    +{freelancer.skills.length - 3} more
                                </span>
                            )}
                        </div>

                        <div className="mt-4">
                            <Link 
                                to={`/freelancers/${freelancer.freelancer_id}`}
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-indigo-600 rounded-md text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                            >
                                View Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50" dir={direction}>
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Find Talented Freelancers</h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Discover skilled professionals ready to help with your projects
                        </p>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row gap-4 mb-4">
                        <div className="flex-1">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search freelancers by name, skills, or expertise..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400'}`}
                            >
                                <Squares2X2Icon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400'}`}
                            >
                                <ListBulletIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <FunnelIcon className="h-4 w-4 mr-2" />
                                Filters
                            </button>
                        </div>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>
                                                {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Experience Level
                                    </label>
                                    <select
                                        value={selectedExperience}
                                        onChange={(e) => setSelectedExperience(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">All Levels</option>
                                        {experienceLevels.map(level => (
                                            <option key={level.key} value={level.key}>
                                                {level.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location
                                    </label>
                                    <select
                                        value={selectedLocation}
                                        onChange={(e) => setSelectedLocation(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">All Cities</option>
                                        {jordanianCities.map(city => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Minimum Rating
                                    </label>
                                    <select
                                        value={minRating}
                                        onChange={(e) => setMinRating(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Any Rating</option>
                                        <option value="4">4+ Stars</option>
                                        <option value="4.5">4.5+ Stars</option>
                                        <option value="4.8">4.8+ Stars</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-gray-600">
                            {pagination.total ? `${pagination.total} freelancers found` : 'Loading...'}
                        </p>
                    </div>
                </div>

                {/* Freelancers Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="animate-pulse">
                                <div className="bg-white rounded-lg shadow-sm border p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : freelancers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {freelancers.map(freelancer => (
                            <FreelancerCard key={freelancer.freelancer_id} freelancer={freelancer} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <UserIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No freelancers found
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Try adjusting your search criteria or filters.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="text-indigo-600 hover:text-indigo-500 font-medium"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="flex justify-center mt-12">
                        <nav className="flex items-center space-x-1">
                            {pagination.current_page > 1 && (
                                <button
                                    onClick={() => fetchFreelancers(pagination.current_page - 1)}
                                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                            )}
                            
                            {[...Array(Math.min(pagination.last_page, 5))].map((_, index) => {
                                const page = index + 1;
                                const isCurrentPage = page === pagination.current_page;
                                
                                return (
                                    <button
                                        key={page}
                                        onClick={() => fetchFreelancers(page)}
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
                                <button
                                    onClick={() => fetchFreelancers(pagination.current_page + 1)}
                                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FreelancersPage;