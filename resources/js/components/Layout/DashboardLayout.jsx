import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
    HomeIcon,
    BuildingStorefrontIcon,
    PhotoIcon,
    DocumentTextIcon,
    ChartBarIcon,
    CogIcon,
    Bars3Icon,
    XMarkIcon,
    PlusIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout, isAdmin } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const baseNavigation = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'My Stores', href: '/dashboard/stores', icon: BuildingStorefrontIcon },
        { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
    ];

    const adminNavigation = [
        { name: 'Store Management', href: '/dashboard/admin/stores', icon: ShieldCheckIcon },
    ];

    const navigation = isAdmin() 
        ? [...baseNavigation, ...adminNavigation]
        : baseNavigation;

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                    <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                type="button"
                                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <XMarkIcon className="h-6 w-6 text-white" />
                            </button>
                        </div>
                        <SidebarContent navigation={navigation} isActive={isActive} />
                    </div>
                </div>
            )}

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex min-h-0 flex-1 flex-col bg-white shadow-lg">
                    <SidebarContent navigation={navigation} isActive={isActive} />
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top navigation */}
                <div className="sticky top-0 z-10 bg-white shadow-sm">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                        <button
                            type="button"
                            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>

                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <Link
                                to="/dashboard/stores/create"
                                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                            >
                                <PlusIcon className="h-4 w-4" />
                                Add Store
                            </Link>

                            <span className="text-sm font-medium text-gray-700">
                {user?.first_name} {user?.last_name}
              </span>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-gray-700 hover:text-gray-900"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="py-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

const SidebarContent = ({ navigation, isActive }) => (
    <div className="flex flex-1 flex-col pt-5 pb-4">
        <div className="flex flex-shrink-0 items-center px-4">
            <h1 className="text-xl font-bold text-gray-900">🏪 Al Amaken</h1>
        </div>
        <nav className="mt-5 flex-1 space-y-1 px-2">
            {navigation.map((item) => (
                <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive(item.href)
                            ? 'bg-indigo-100 text-indigo-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                    <item.icon className={`mr-3 h-6 w-6 ${
                        isActive(item.href) ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    {item.name}
                </Link>
            ))}
        </nav>
    </div>
);

export default DashboardLayout;
