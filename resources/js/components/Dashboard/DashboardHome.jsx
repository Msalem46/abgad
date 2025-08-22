import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import {
    BuildingStorefrontIcon,
    EyeIcon,
    ClockIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const DashboardHome = () => {
    const { user } = useContext(AuthContext);
    const { t } = useLanguage();
    const [stats, setStats] = useState(null);
    const [recentStores, setRecentStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsResponse, storesResponse] = await Promise.all([
                api.get('/dashboard/stats'),
                api.get('/dashboard/recent-stores')
            ]);
            setStats(statsResponse.data.data);
            setRecentStores(storesResponse.data.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            // Set dummy data for demo
            setStats({
                total_stores: 2,
                total_views: 1247,
                avg_duration: '2m 34s',
                monthly_growth: 23.5
            });
            setRecentStores([
                {
                    store_id: 1,
                    trading_name: 'مطعم الأصالة الأردنية',
                    category: 'Restaurant',
                    city: 'عمان',
                    is_verified: true
                },
                {
                    store_id: 2,
                    trading_name: 'Golden Cafe',
                    category: 'Cafe',
                    city: 'Amman',
                    is_verified: false
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    const statCards = [
        {
            title: t('dashboard.totalStores'),
            value: stats?.total_stores || 0,
            icon: BuildingStorefrontIcon,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            title: t('dashboard.totalViews'),
            value: stats?.total_views || 0,
            icon: EyeIcon,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            title: t('dashboard.avgVisitDuration'),
            value: stats?.avg_duration || '0m',
            icon: ClockIcon,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            title: t('dashboard.monthlyGrowth'),
            value: `${stats?.monthly_growth || 0}%`,
            icon: ChartBarIcon,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('dashboard.welcome')}, {user?.first_name}! 👋
                </h1>
                <p className="text-gray-600">
                    {t('dashboard.subtitle')}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to="/dashboard/stores/create"
                        className="flex items-center p-4 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                        <BuildingStorefrontIcon className="h-8 w-8 text-indigo-600 mr-3" />
                        <div>
                            <h3 className="font-medium text-gray-900">Add New Store</h3>
                            <p className="text-sm text-gray-600">Register your business</p>
                        </div>
                    </Link>

                    <Link
                        to="/dashboard/analytics"
                        className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                    >
                        <ChartBarIcon className="h-8 w-8 text-green-600 mr-3" />
                        <div>
                            <h3 className="font-medium text-gray-900">View Analytics</h3>
                            <p className="text-sm text-gray-600">Check your performance</p>
                        </div>
                    </Link>

                    <Link
                        to="/dashboard/stores"
                        className="flex items-center p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                        <EyeIcon className="h-8 w-8 text-purple-600 mr-3" />
                        <div>
                            <h3 className="font-medium text-gray-900">Manage Stores</h3>
                            <p className="text-sm text-gray-600">Edit your listings</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Recent Stores */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Your Stores</h2>
                    <Link
                        to="/dashboard/stores"
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                        View all
                    </Link>
                </div>
                <div className="divide-y divide-gray-200">
                    {recentStores.map((store) => (
                        <div key={store.store_id} className="px-6 py-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <BuildingStorefrontIcon className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">
                                            {store.trading_name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {store.category} • {store.city}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {store.is_verified ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      Verified
                    </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                      Pending
                    </span>
                                    )}
                                    <Link
                                        to={`/dashboard/stores/${store.store_id}/edit`}
                                        className="text-indigo-600 hover:text-indigo-700 text-sm"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                    {recentStores.length === 0 && (
                        <div className="px-6 py-8 text-center">
                            <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No stores yet</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by creating your first store.</p>
                            <div className="mt-6">
                                <Link
                                    to="/dashboard/stores/create"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    <BuildingStorefrontIcon className="-ml-1 mr-2 h-5 w-5" />
                                    Add Store
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
    </div>
);

export default DashboardHome;
