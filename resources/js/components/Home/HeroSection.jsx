import React from 'react';
import { Link } from 'react-router-dom';
import { 
    MagnifyingGlassIcon, 
    MapPinIcon, 
    BuildingStorefrontIcon,
    StarIcon,
    UsersIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';

const HeroSection = () => {
    const { t } = useLanguage();
    const categories = [
        { name: t('categories.restaurant'), icon: '🍽️', count: '150+' },
        { name: t('categories.cafe'), icon: '☕', count: '89+' },
        { name: t('categories.shop'), icon: '🛍️', count: '200+' },
        { name: t('categories.service'), icon: '🔧', count: '120+' },
        { name: t('categories.healthcare'), icon: '🏥', count: '45+' },
        { name: t('categories.education'), icon: '📚', count: '30+' }
    ];

    const stats = [
        { label: t('home.verifiedBusiness'), value: '500+', icon: BuildingStorefrontIcon },
        { label: t('home.happyCustomers'), value: '10K+', icon: UsersIcon },
        { label: t('home.citiesCovered'), value: '12', icon: MapPinIcon },
        { label: t('home.dailyUpdates'), value: '24/7', icon: ClockIcon }
    ];

    return (
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-800 text-white">
            {/* Main Hero Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="text-center">
                    {/* Main Heading */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        {t('home.title')}
                    </h1>
                    
                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
                        {t('home.subtitle')}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <button 
                            onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 bg-yellow-400 text-indigo-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors text-lg"
                        >
                            <MagnifyingGlassIcon className="h-5 w-5 inline mr-2" />
                            {t('home.startExploring')}
                        </button>
                        <Link 
                            to="/register-store"
                            className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-indigo-900 transition-colors text-lg"
                        >
                            <BuildingStorefrontIcon className="h-5 w-5 inline mr-2" />
                            {t('home.listYourBusiness')}
                        </Link>
                    </div>

                    {/* Featured Categories */}
                    <div className="mb-16">
                        <h3 className="text-xl font-semibold mb-6 text-indigo-100">
                            {t('home.popularCategories')}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {categories.map((category) => (
                                <div 
                                    key={category.name}
                                    className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer group"
                                >
                                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                                        {category.icon}
                                    </div>
                                    <div className="text-sm font-medium mb-1">{category.name}</div>
                                    <div className="text-xs text-indigo-200">{category.count}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-3">
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                                <div className="text-sm text-indigo-200">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Wave Divider */}
            <div className="relative">
                <svg
                    className="absolute bottom-0 w-full h-6 md:h-8 lg:h-12 text-gray-50"
                    preserveAspectRatio="none"
                    viewBox="0 0 1440 54"
                    fill="currentColor"
                >
                    <path d="M0,22 C240,60 480,0 720,22 C960,44 1200,-16 1440,22 L1440,54 L0,54 Z"></path>
                </svg>
            </div>
        </div>
    );
};

export default HeroSection;