import React from 'react';
import { Link } from 'react-router-dom';
import { 
    MagnifyingGlassIcon, 
    BuildingStorefrontIcon,
    UserIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../UI/LanguageSwitcher';

const PublicLayout = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { t, direction } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50" dir={direction}>
            {/* Navigation */}
            <nav className="bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-200 sticky top-0 z-40 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center group">
                            <BuildingStorefrontIcon className="h-8 w-8 text-indigo-600 mr-2 group-hover:scale-110 transition-transform duration-200" />
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Abjad Amaken
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link 
                                to="/" 
                                className="relative text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-all duration-300 group"
                            >
                                {t('nav.home')}
                                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                            </Link>
                            <Link 
                                to="/stores" 
                                className="relative text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-all duration-300 group"
                            >
                                {t('nav.stores')}
                                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                            </Link>
                            <Link 
                                to="/freelancers" 
                                className="relative text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-all duration-300 group"
                            >
                                {t('nav.freelancers')}
                                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                            </Link>
                            <Link 
                                to="/services" 
                                className="relative text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-all duration-300 group"
                            >
                                {t('nav.services')}
                                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                            </Link>
                            <Link 
                                to="/tourism" 
                                className="relative text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-all duration-300 group"
                            >
                                {t('nav.tourism')}
                                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                            </Link>
                            <Link 
                                to="/about" 
                                className="relative text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-all duration-300 group"
                            >
                                {t('nav.about')}
                                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                            </Link>
                        </div>

                        {/* Desktop Auth Links */}
                        <div className="hidden md:flex items-center space-x-4">
                            <LanguageSwitcher />
                            <Link
                                to="/login"
                                className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
                            >
                                {t('nav.signin')}
                            </Link>
                            <Link
                                to="/register-freelancer"
                                className="text-indigo-600 border border-indigo-600 px-4 py-2 text-sm font-medium rounded-full hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                            >
                                {t('nav.becomeFreelancer')}
                            </Link>
                            <Link
                                to="/register-tourism"
                                className="text-green-600 border border-green-600 px-4 py-2 text-sm font-medium rounded-full hover:bg-green-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                            >
                                {t('nav.becomeTourismProvider')}
                            </Link>
                            <Link
                                to="/register-store"
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 text-sm font-medium rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                                {t('nav.listBusiness')}
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {mobileMenuOpen ? (
                                    <XMarkIcon className="h-6 w-6" />
                                ) : (
                                    <Bars3Icon className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
                            <Link 
                                to="/" 
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors"
                            >
                                {t('nav.home')}
                            </Link>
                            <Link 
                                to="/stores" 
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors"
                            >
                                {t('nav.stores')}
                            </Link>
                            <Link 
                                to="/freelancers" 
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors"
                            >
                                {t('nav.freelancers')}
                            </Link>
                            <Link 
                                to="/services" 
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors"
                            >
                                {t('nav.services')}
                            </Link>
                            <Link 
                                to="/tourism" 
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors"
                            >
                                {t('nav.tourism')}
                            </Link>
                            <Link 
                                to="/about" 
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors"
                            >
                                {t('nav.about')}
                            </Link>
                            <div className="border-t border-gray-200 pt-3">
                                <div className="px-3 py-2">
                                    <LanguageSwitcher />
                                </div>
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors"
                                >
                                    {t('nav.signin')}
                                </Link>
                                <Link
                                    to="/register-freelancer"
                                    className="block px-3 py-2 text-base font-medium text-indigo-600 border border-indigo-600 hover:bg-indigo-50 rounded-full transition-colors mx-3 mt-2"
                                >
                                    {t('nav.becomeFreelancer')}
                                </Link>
                                <Link
                                    to="/register-tourism"
                                    className="block px-3 py-2 text-base font-medium text-green-600 border border-green-600 hover:bg-green-50 rounded-full transition-colors mx-3 mt-2"
                                >
                                    {t('nav.becomeTourismProvider')}
                                </Link>
                                <Link
                                    to="/register-store"
                                    className="block px-3 py-2 text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 rounded-full transition-colors mx-3 mt-2"
                                >
                                    {t('nav.listBusiness')}
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center mb-4">
                                <BuildingStorefrontIcon className="h-8 w-8 text-indigo-400 mr-2" />
                                <span className="text-xl font-bold">Abjad Amaken</span>
                            </div>
                            <p className="text-gray-400 mb-4">
                                {t('footer.description')}
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">Facebook</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">Instagram</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988c6.62 0 11.987-5.367 11.987-11.988C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.72 13.559 3.72 12.017c0-1.542.478-2.878 1.406-3.674c.875-.807 2.026-1.297 3.323-1.297c1.297 0 2.448.49 3.323 1.297c.928.796 1.406 2.132 1.406 3.674c0 1.542-.478 2.878-1.406 3.674c-.875.807-2.026 1.297-3.323 1.297zm7.718-9.469c-.312 0-.596-.12-.807-.334c-.211-.215-.334-.498-.334-.807c0-.309.123-.596.334-.807c.211-.214.495-.334.807-.334c.312 0 .596.12.807.334c.211.211.334.498.334.807c0 .309-.123.592-.334.807c-.211.214-.495.334-.807.334z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
                            <ul className="space-y-2">
                                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">{t('nav.home')}</Link></li>
                                <li><Link to="/categories" className="text-gray-400 hover:text-white transition-colors">{t('nav.categories')}</Link></li>
                                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">{t('nav.about')}</Link></li>
                                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">{t('nav.contact')}</Link></li>
                                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">{t('footer.privacyPolicy')}</Link></li>
                            </ul>
                        </div>

                        {/* For Business */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">{t('footer.support')}</h3>
                            <ul className="space-y-2">
                                <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors">{t('nav.listBusiness')}</Link></li>
                                <li><Link to="/business-resources" className="text-gray-400 hover:text-white transition-colors">Business Resources</Link></li>
                                <li><Link to="/advertise" className="text-gray-400 hover:text-white transition-colors">Advertise</Link></li>
                                <li><Link to="/support" className="text-gray-400 hover:text-white transition-colors">{t('footer.helpCenter')}</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © 2024 Abjad Amaken. {t('footer.allRightsReserved')}
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                                {t('footer.termsOfService')}
                            </Link>
                            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                                {t('footer.privacyPolicy')}
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;