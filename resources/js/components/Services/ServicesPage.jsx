import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    MagnifyingGlassIcon, 
    ClockIcon,
    StarIcon,
    TagIcon,
    CurrencyDollarIcon,
    FunnelIcon,
    Squares2X2Icon,
    ListBulletIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';

const ServicesPage = () => {
    const { t, direction } = useLanguage();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [maxDeliveryDays, setMaxDeliveryDays] = useState('');
    const [minRating, setMinRating] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [pagination, setPagination] = useState({});

    const [categories, setCategories] = useState({});

    useEffect(() => {
        fetchCategories();
        fetchServices();
    }, []);

    useEffect(() => {
        fetchServices();
    }, [searchQuery, selectedCategory, serviceType, minPrice, maxPrice, maxDeliveryDays, minRating]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/services/categories');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchServices = async (page = 1) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page,
                per_page: 12
            });

            if (searchQuery) params.append('search', searchQuery);
            if (selectedCategory) params.append('category', selectedCategory);
            if (serviceType) params.append('service_type', serviceType);
            if (minPrice) params.append('min_price', minPrice);
            if (maxPrice) params.append('max_price', maxPrice);
            if (maxDeliveryDays) params.append('max_delivery_days', maxDeliveryDays);
            if (minRating) params.append('min_rating', minRating);

            const response = await api.get(`/services?${params}`);
            setServices(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching services:', error);
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setServiceType('');
        setMinPrice('');
        setMaxPrice('');
        setMaxDeliveryDays('');
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

    const ServiceCard = ({ service }) => (
        <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
            {service.featured_image && (
                <div className="aspect-w-16 aspect-h-10">
                    <img 
                        className="w-full h-48 object-cover rounded-t-lg" 
                        src={`/storage/${service.featured_image}`}
                        alt={service.title}
                    />
                </div>
            )}
            
            <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {service.title}
                    </h3>
                    {service.featured && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ml-2">
                            Featured
                        </span>
                    )}
                </div>

                <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                        {service.freelancer?.profile_image ? (
                            <img 
                                className="h-6 w-6 rounded-full object-cover" 
                                src={`/storage/${service.freelancer.profile_image}`}
                                alt={service.freelancer.user.first_name}
                            />
                        ) : (
                            <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-xs font-medium text-indigo-600">
                                    {service.freelancer?.user.first_name?.[0]}
                                </span>
                            </div>
                        )}
                    </div>
                    <span className="text-sm text-gray-600">
                        by {service.freelancer?.user.first_name} {service.freelancer?.user.last_name}
                    </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {service.description}
                </p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                        {renderStars(service.rating)}
                        <span className="ml-1">({service.total_reviews})</span>
                    </div>
                    
                    <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>{service.delivery_days} day{service.delivery_days > 1 ? 's' : ''}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {service.category?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    
                    <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                            {service.display_price || `${service.base_price} JOD`}
                        </div>
                        {service.price_type !== 'fixed' && (
                            <div className="text-xs text-gray-500">
                                {service.price_type === 'hourly' ? 'per hour' : 'starting from'}
                            </div>
                        )}
                    </div>
                </div>

                {service.tags && service.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {service.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                <TagIcon className="h-3 w-3 mr-1" />
                                {tag}
                            </span>
                        ))}
                        {service.tags.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                +{service.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                <Link 
                    to={`/services/${service.service_id}`}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                    View Details
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50" dir={direction}>
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Professional Services</h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Find the perfect service for your project needs
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
                                    placeholder="Search services by title, description, or tags..."
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
                                        {Object.entries(categories).map(([key, value]) => (
                                            <option key={key} value={key}>
                                                {value}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Service Type
                                    </label>
                                    <select
                                        value={serviceType}
                                        onChange={(e) => setServiceType(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">All Types</option>
                                        <option value="remote">Remote</option>
                                        <option value="onsite">On-site</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price Range (JOD)
                                    </label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Delivery Time
                                    </label>
                                    <select
                                        value={maxDeliveryDays}
                                        onChange={(e) => setMaxDeliveryDays(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Any Time</option>
                                        <option value="1">1 Day</option>
                                        <option value="3">3 Days</option>
                                        <option value="7">1 Week</option>
                                        <option value="14">2 Weeks</option>
                                        <option value="30">1 Month</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Minimum Rating
                                    </label>
                                    <select
                                        value={minRating}
                                        onChange={(e) => setMinRating(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Any Rating</option>
                                        <option value="4">4+ Stars</option>
                                        <option value="4.5">4.5+ Stars</option>
                                        <option value="4.8">4.8+ Stars</option>
                                    </select>
                                </div>

                                <div className="flex items-end">
                                    <button
                                        onClick={clearFilters}
                                        className="px-4 py-2 text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
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
                            {pagination.total ? `${pagination.total} services found` : 'Loading...'}
                        </p>
                    </div>
                </div>

                {/* Services Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="animate-pulse">
                                <div className="bg-white rounded-lg shadow-sm border p-6">
                                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
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
                ) : services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map(service => (
                            <ServiceCard key={service.service_id} service={service} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No services found
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
                                    onClick={() => fetchServices(pagination.current_page - 1)}
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
                                        onClick={() => fetchServices(page)}
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
                                    onClick={() => fetchServices(pagination.current_page + 1)}
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

export default ServicesPage;