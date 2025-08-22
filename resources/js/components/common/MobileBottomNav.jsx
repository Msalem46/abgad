import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    HomeIcon,
    BuildingStorefrontIcon,
    UserGroupIcon,
    BriefcaseIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeSolidIcon,
    BuildingStorefrontIcon as BuildingStorefrontSolidIcon,
    UserGroupIcon as UserGroupSolidIcon,
    BriefcaseIcon as BriefcaseSolidIcon,
    MapPinIcon as MapPinSolidIcon
} from '@heroicons/react/24/solid';
import { useLanguage } from '../../contexts/LanguageContext';

const MobileBottomNav = () => {
    const location = useLocation();
    const { language } = useLanguage();

    const navItems = [
        {
            path: '/',
            label: language === 'ar' ? 'الرئيسية' : 'Home',
            icon: HomeIcon,
            solidIcon: HomeSolidIcon,
            activeColor: 'text-indigo-600'
        },
        {
            path: '/stores',
            label: language === 'ar' ? 'المتاجر' : 'Stores',
            icon: BuildingStorefrontIcon,
            solidIcon: BuildingStorefrontSolidIcon,
            activeColor: 'text-indigo-600'
        },
        {
            path: '/freelancers',
            label: language === 'ar' ? 'المستقلون' : 'Freelancers',
            icon: UserGroupIcon,
            solidIcon: UserGroupSolidIcon,
            activeColor: 'text-indigo-600'
        },
        {
            path: '/services',
            label: language === 'ar' ? 'الخدمات' : 'Services',
            icon: BriefcaseIcon,
            solidIcon: BriefcaseSolidIcon,
            activeColor: 'text-indigo-600'
        },
        {
            path: '/tourism',
            label: language === 'ar' ? 'السياحة' : 'Tourism',
            icon: MapPinIcon,
            solidIcon: MapPinSolidIcon,
            activeColor: 'text-indigo-600'
        }
    ];

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item, index) => {
                    const active = isActive(item.path);
                    const IconComponent = active ? item.solidIcon : item.icon;
                    
                    return (
                        <Link
                            key={index}
                            to={item.path}
                            className={`flex flex-col items-center justify-center min-w-0 flex-1 p-1 transition-colors duration-200 ${
                                active 
                                    ? `${item.activeColor} transform scale-105` 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <IconComponent className={`h-6 w-6 mb-1 ${active ? 'animate-pulse' : ''}`} />
                            <span className={`text-xs font-medium truncate ${active ? 'font-semibold' : ''}`}>
                                {item.label}
                            </span>
                            {active && (
                                <div className="absolute -bottom-0.5 w-6 h-0.5 bg-indigo-600 rounded-full"></div>
                            )}
                        </Link>
                    );
                })}
            </div>
            
            {/* Active indicator bar */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
        </div>
    );
};

export default MobileBottomNav;