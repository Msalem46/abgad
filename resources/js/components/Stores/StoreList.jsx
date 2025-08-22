import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
    BuildingStorefrontIcon,
    PencilIcon,
    PhotoIcon,
    DocumentTextIcon,
    EyeIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ShieldCheckIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const StoreList = () => {
    const { user, isAdmin } = useContext(AuthContext);
    const { t } = useLanguage();
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const response = await api.get('/stores');
            setStores(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching stores:', error);
            // Demo data
            setStores([
                {
                    store_id: 1,
                    trading_name: 'مطعم الأصالة الأردنية',
                    category: 'Restaurant',
                    city: 'عمان',
                    is_verified: true,
                    is_active: true,
                    created_at: '2024-01-15'
                },
                {
                    store_id: 2,
                    trading_name: 'Golden Cafe',
                    category: 'Cafe',
                    city: 'Amman',
                    is_verified: false,
                    is_active: true,
                    created_at: '2024-02-20'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleStoreApproval = async (storeId, isApproved) => {
        if (actionLoading) return;
        
        setActionLoading(true);
        try {
            await api.put(`/admin/stores/${storeId}/verify`, {
                is_verified: isApproved,
                verification_notes: isApproved 
                    ? 'Store approved via dashboard quick action.'
                    : 'Store needs additional review before approval.'
            });
            
            toast.success(`Store ${isApproved ? 'approved' : 'rejected'} successfully!`);
            fetchStores(); // Refresh the list
        } catch (error) {
            console.error('Error updating store status:', error);
            toast.error(`Failed to ${isApproved ? 'approve' : 'reject'} store`);
        } finally {
            setActionLoading(false);
        }
    };

    const filteredStores = stores.filter(store => {
        if (filter === 'verified') return store.is_verified;
        if (filter === 'pending') return !store.is_verified;
        return true;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('storeList.myStores')}</h1>
                    <p className="text-gray-600">Manage your store listings</p>
                </div>
                <Link
                    to="/dashboard/stores/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    <BuildingStorefrontIcon className="-ml-1 mr-2 h-5 w-5" />
                    Add New Store
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex space-x-4">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                            filter === 'all'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {t('storeList.allStores')} ({stores.length})
                    </button>
                    <button
                        onClick={() => setFilter('verified')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                            filter === 'verified'
                                ? 'bg-green-100 text-green-700'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {t('storeList.verified')} ({stores.filter(s => s.is_verified).length})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                            filter === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {t('storeList.pending')} ({stores.filter(s => !s.is_verified).length})
                    </button>
                </div>
            </div>

            {/* Stores Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStores.map((store) => (
                    <div key={store.store_id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <BuildingStorefrontIcon className="h-8 w-8 text-gray-400 mr-3" />
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {store.trading_name}
                                        </h3>
                                        <p className="text-sm text-gray-500">{store.category}</p>
                                    </div>
                                </div>
                                {store.is_verified ? (
                                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                ) : (
                                    <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
                                )}
                            </div>

                            <div className="space-y-2 mb-4">
                                <p className="text-sm text-gray-600">📍 {store.city}</p>
                                <p className="text-sm text-gray-600">
                                    📅 Created {new Date(store.created_at).toLocaleDateString()}
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        {store.is_verified ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                {t('store.verified')}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                                                {t('store.pending')}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Admin Quick Actions */}
                                    {isAdmin() && !store.is_verified && (
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleStoreApproval(store.store_id, true)}
                                                disabled={actionLoading}
                                                className="inline-flex items-center px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                                            >
                                                <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                Quick Approve
                                            </button>
                                            <button
                                                onClick={() => handleStoreApproval(store.store_id, false)}
                                                disabled={actionLoading}
                                                className="inline-flex items-center px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-50"
                                            >
                                                <XCircleIcon className="h-3 w-3 mr-1" />
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                    
                                    {/* Store Owner Guidance */}
                                    {!isAdmin() && !store.is_verified && (
                                        <div className="text-xs text-gray-600">
                                            <p>⏳ Your store is pending admin approval</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                {/* Regular Action Buttons */}
                                <div className="grid grid-cols-2 gap-2">
                                    <Link
                                        to={`/dashboard/stores/${store.store_id}/edit`}
                                        className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        <PencilIcon className="h-4 w-4 mr-1" />
                                        {t('common.edit')}
                                    </Link>
                                    <Link
                                        to={`/dashboard/stores/${store.store_id}/gallery`}
                                        className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        <PhotoIcon className="h-4 w-4 mr-1" />
                                        {t('storeList.gallery')}
                                    </Link>
                                    <Link
                                        to={`/dashboard/stores/${store.store_id}/menu`}
                                        className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        <DocumentTextIcon className="h-4 w-4 mr-1" />
                                        {t('storeList.menu')}
                                    </Link>
                                    <Link
                                        to={`/stores/${store.store_id}`}
                                        target="_blank"
                                        className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        <EyeIcon className="h-4 w-4 mr-1" />
                                        {t('storeList.view')}
                                    </Link>
                                </div>
                                
                                {/* Admin Link for Store Management */}
                                {isAdmin() && (
                                    <Link
                                        to="/dashboard/admin/stores"
                                        className="flex items-center justify-center w-full px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-md text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
                                    >
                                        <ShieldCheckIcon className="h-4 w-4 mr-1" />
                                        Admin Store Management
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredStores.length === 0 && (
                <div className="text-center py-12">
                    <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                        {filter === 'all' ? 'No stores yet' : `No ${filter} stores`}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {filter === 'all'
                            ? 'Get started by creating your first store.'
                            : `You don't have any ${filter} stores.`
                        }
                    </p>
                    {filter === 'all' && (
                        <div className="mt-6">
                            <Link
                                to="/dashboard/stores/create"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                <BuildingStorefrontIcon className="-ml-1 mr-2 h-5 w-5" />
                                Add Your First Store
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StoreList;
