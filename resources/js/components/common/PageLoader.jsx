import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const PageLoader = ({ 
    message = null, 
    showProgress = false, 
    progress = 0,
    size = 'large',
    overlay = true,
    animated = true
}) => {
    const { language, direction } = useLanguage();

    const defaultMessages = {
        ar: 'جاري التحميل...',
        en: 'Loading...'
    };

    const loadingMessage = message || defaultMessages[language] || defaultMessages.en;

    const sizeClasses = {
        small: 'h-6 w-6',
        medium: 'h-10 w-10',
        large: 'h-16 w-16',
        xlarge: 'h-24 w-24'
    };

    const spinnerSize = sizeClasses[size] || sizeClasses.large;

    return (
        <div 
            className={`
                ${overlay ? 'fixed inset-0 z-50' : 'relative'} 
                flex items-center justify-center
                ${overlay ? 'bg-white bg-opacity-90 backdrop-blur-sm' : ''}
            `}
            dir={direction}
        >
            <div className="text-center max-w-sm mx-auto px-4">
                {/* Main Spinner */}
                <div className="relative mb-6">
                    <div className={`${spinnerSize} mx-auto relative`}>
                        {/* Outer ring */}
                        <div className={`absolute inset-0 border-4 border-gray-200 rounded-full ${animated ? 'animate-pulse' : ''}`}></div>
                        
                        {/* Spinning ring */}
                        <div className={`absolute inset-0 border-4 border-transparent border-t-indigo-600 border-r-indigo-500 rounded-full ${animated ? 'animate-spin' : ''}`}></div>
                        
                        {/* Inner glow effect */}
                        <div className={`absolute inset-2 border-2 border-transparent border-t-purple-400 rounded-full ${animated ? 'animate-spin animate-reverse' : ''} opacity-70`}></div>
                    </div>
                    
                    {/* Floating dots around spinner */}
                    {animated && (
                        <>
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                            </div>
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-300"></div>
                            </div>
                            <div className="absolute top-1/2 -left-2 transform -translate-y-1/2">
                                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce animation-delay-150"></div>
                            </div>
                            <div className="absolute top-1/2 -right-2 transform -translate-y-1/2">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce animation-delay-450"></div>
                            </div>
                        </>
                    )}
                </div>

                {/* Loading Message */}
                <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {loadingMessage}
                    </h3>
                    
                    {/* Animated dots */}
                    {animated && (
                        <div className="flex justify-center space-x-1">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse animation-delay-150"></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse animation-delay-300"></div>
                        </div>
                    )}

                    {/* Progress Bar */}
                    {showProgress && (
                        <div className="w-64 mx-auto">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>{language === 'ar' ? 'التقدم' : 'Progress'}</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div 
                                    className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%` }}
                                >
                                    {animated && (
                                        <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Optional secondary message */}
                    <p className="text-sm text-gray-500 mt-2">
                        {language === 'ar' ? 'يرجى الانتظار قليلاً...' : 'Please wait a moment...'}
                    </p>
                </div>
            </div>

            {/* Background pattern */}
            {overlay && animated && (
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-100 rounded-full opacity-20 animate-pulse animation-delay-700"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-100 rounded-full opacity-20 animate-pulse animation-delay-1000"></div>
                    <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-pink-100 rounded-full opacity-20 animate-pulse animation-delay-500"></div>
                </div>
            )}
        </div>
    );
};

// Simple inline loader for smaller components
export const InlineLoader = ({ size = 'small', message = null }) => {
    const { language } = useLanguage();
    const loadingText = message || (language === 'ar' ? 'تحميل...' : 'Loading...');
    
    return (
        <div className="flex items-center justify-center p-4">
            <div className={`border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin mr-3 ${size === 'small' ? 'h-4 w-4' : 'h-6 w-6'}`}></div>
            <span className="text-gray-600 text-sm">{loadingText}</span>
        </div>
    );
};

// Card skeleton loader for list items
export const CardSkeleton = ({ count = 3 }) => {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-6 space-y-3">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-300 rounded"></div>
                            <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                        </div>
                        <div className="flex justify-between">
                            <div className="h-6 bg-gray-300 rounded w-20"></div>
                            <div className="h-6 bg-gray-300 rounded w-16"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PageLoader;