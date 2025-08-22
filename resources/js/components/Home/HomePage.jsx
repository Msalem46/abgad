import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    MagnifyingGlassIcon, 
    MapIcon, 
    ListBulletIcon,
    FunnelIcon,
    StarIcon,
    ClockIcon,
    MapPinIcon,
    PhoneIcon,
    GlobeAltIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';
import HeroSection from './HeroSection';
import StoreCard from './StoreCard';
import StoreMap from './StoreMap';

const HomePage = () => {
    const { t } = useLanguage();
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
    const [showFilters, setShowFilters] = useState(false);
    const [categories, setCategories] = useState([]);
    const [cities, setCities] = useState([]);
    const [pagination, setPagination] = useState({});

    const categoryList = [
        { key: 'all', label: 'All' },
        { key: 'restaurant', label: t('categories.restaurant') },
        { key: 'cafe', label: t('categories.cafe') },
        { key: 'shop', label: t('categories.shop') },
        { key: 'service', label: t('categories.service') },
        { key: 'healthcare', label: t('categories.healthcare') },
        { key: 'automotive', label: t('categories.automotive') },
        { key: 'beautyWellness', label: t('categories.beautyWellness') },
        { key: 'education', label: t('categories.education') },
        { key: 'other', label: t('categories.other') }
    ];

    useEffect(() => {
        fetchStores();
        fetchCategories();
        fetchCities();
    }, [searchQuery, selectedCategory, selectedCity]);

    const fetchStores = async (page = 1) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page,
                per_page: 12,
                verified: true, // Only show verified stores on public page
            });

            if (searchQuery) params.append('search', searchQuery);
            if (selectedCategory && selectedCategory !== 'All') {
                params.append('category', selectedCategory);
            }
            if (selectedCity) params.append('city', selectedCity);

            const response = await api.get(`/stores?${params}`);
            setStores(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching stores:', error);
            setStores([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            // This would ideally come from an API endpoint
            // For now, we'll use the static list
            setCategories(categoryList);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchCities = async () => {
        try {
            // In a real app, this would come from an API
            const jordanianCities = [
                { key: 'all', label: 'All Cities' },
                { key: 'amman', label: 'Amman' },
                { key: 'irbid', label: 'Irbid' },
                { key: 'zarqa', label: 'Zarqa' },
                { key: 'aqaba', label: 'Aqaba' },
                { key: 'salt', label: 'Salt' },
                { key: 'madaba', label: 'Madaba' },
                { key: 'jerash', label: 'Jerash' },
                { key: 'ajloun', label: 'Ajloun' },
                { key: 'karak', label: 'Karak' },
                { key: 'tafilah', label: 'Tafilah' },
                { key: 'maan', label: 'Maan' },
                { key: 'mafraq', label: 'Mafraq' }
            ];
            setCities(jordanianCities);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const handleCityChange = (cityKey) => {
        const city = cities.find(c => c.key === cityKey);
        setSelectedCity(cityKey === 'all' ? '' : city?.label || cityKey);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setSelectedCity('');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <HeroSection />

            {/* Search and Filters Section */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Search Bar */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-4">
                        <div className="flex-1">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={t('home.searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        
                        {/* View Toggle */}
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <ListBulletIcon className="h-4 w-4 mr-2" />
                                {t('home.gridView')}
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    viewMode === 'map'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <MapIcon className="h-4 w-4 mr-2" />
                                {t('home.mapView')}
                            </button>
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <FunnelIcon className="h-4 w-4 mr-2" />
                            {t('common.filter')}
                        </button>
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Category Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('home.filterByCategory')}
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                    >
                                        {categoryList.map(category => (
                                            <option key={category.key} value={category.key === 'all' ? '' : category.label}>
                                                {category.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* City Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('home.filterByCity')}
                                    </label>
                                    <select
                                        value={selectedCity ? cities.find(c => c.label === selectedCity)?.key || 'all' : 'all'}
                                        onChange={(e) => handleCityChange(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                    >
                                        {cities.map(city => (
                                            <option key={city.key} value={city.key}>
                                                {city.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Clear Filters */}
                                <div className="flex items-end">
                                    <button
                                        onClick={clearFilters}
                                        className="w-full px-4 py-2 text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                                    >
                                        {t('home.resetFilters')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Active Filters Display */}
                    {(searchQuery || selectedCategory || selectedCity) && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            <span className="text-sm text-gray-600">{t('common.filter')}:</span>
                            {searchQuery && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {t('common.search')}: "{searchQuery}"
                                </span>
                            )}
                            {selectedCategory && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {selectedCategory}
                                </span>
                            )}
                            {selectedCity && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {selectedCity}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Results Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {searchQuery ? t('common.search') + ' Results' : t('home.title')}
                        </h2>
                        <p className="text-gray-600 mt-1">
                            {pagination.total ? `${pagination.total} ${t('home.noStoresFound')}` : t('common.loading')}
                        </p>
                    </div>
                </div>

                {/* Content Based on View Mode */}
                {viewMode === 'map' ? (
                    <StoreMap stores={stores} />
                ) : (
                    <>
                        {/* Store Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, index) => (
                                    <div key={index} className="animate-pulse">
                                        <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : stores.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {stores.map(store => (
                                    <StoreCard key={store.store_id} store={store} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                                    <MagnifyingGlassIcon />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {t('home.noStoresFound')}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {t('home.noStoresMessage')}
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                                >
                                    {t('home.resetFilters')}
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.last_page > 1 && (
                            <div className="flex justify-center mt-12">
                                <nav className="flex items-center space-x-1">
                                    {pagination.current_page > 1 && (
                                        <button
                                            onClick={() => fetchStores(pagination.current_page - 1)}
                                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                            {t('publicRegistration.previous')}
                                        </button>
                                    )}
                                    
                                    {[...Array(Math.min(pagination.last_page, 5))].map((_, index) => {
                                        const page = index + 1;
                                        const isCurrentPage = page === pagination.current_page;
                                        
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => fetchStores(page)}
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
                                            onClick={() => fetchStores(pagination.current_page + 1)}
                                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                            {t('publicRegistration.next')}
                                        </button>
                                    )}
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default HomePage;