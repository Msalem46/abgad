import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const LanguageSwitcher = () => {
    const { language, changeLanguage, t } = useLanguage();

    return (
        <div className="relative group">
            <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                <span className="text-lg">{language === 'ar' ? '🇯🇴' : '🇺🇸'}</span>
                <span>{language === 'ar' ? 'العربية' : 'English'}</span>
                <ChevronDownIcon className="h-4 w-4" />
            </button>
            
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                    <button
                        onClick={() => changeLanguage('en')}
                        className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                            language === 'en' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700'
                        }`}
                    >
                        <span className="mr-3 text-lg">🇺🇸</span>
                        English
                    </button>
                    <button
                        onClick={() => changeLanguage('ar')}
                        className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                            language === 'ar' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700'
                        }`}
                    >
                        <span className="mr-3 text-lg">🇯🇴</span>
                        العربية
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LanguageSwitcher;