import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import {
    BuildingStorefrontIcon,
    CheckCircleIcon,
    XCircleIcon,
    EyeIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    MapPinIcon,
    PhoneIcon,
    GlobeAltIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AdminStoreList = () => {
    const { user, isAdmin } = useContext(AuthContext);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [selectedStore, setSelectedStore] = useState(null);
    const [verificationNotes, setVerificationNotes] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (isAdmin()) {
            fetchStores();
        }
    }, [user]);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/stores');
            setStores(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching admin stores:', error);
            toast.error('Failed to fetch stores');
        } finally {
            setLoading(false);
        }
    };

    const handleVerification = async (storeId, isVerified) => {
        if (!selectedStore) return;
        
        setActionLoading(true);
        try {
            await api.put(`/admin/stores/${storeId}/verify`, {
                is_verified: isVerified,
                verification_notes: verificationNotes
            });
            
            toast.success(`Store ${isVerified ? 'approved' : 'rejected'} successfully!`);
            setSelectedStore(null);
            setVerificationNotes('');
            fetchStores(); // Refresh the list
        } catch (error) {
            console.error('Error verifying store:', error);
            toast.error(`Failed to ${isVerified ? 'approve' : 'reject'} store`);
        } finally {
            setActionLoading(false);
        }
    };

    const filteredStores = stores.filter(store => {
        if (filter === 'verified') return store.is_verified;
        if (filter === 'pending') return !store.is_verified;
        return true;
    });

    const getStatusBadge = (store) => {
        if (store.is_verified) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircleSolid className="h-3 w-3 mr-1" />
                    Verified
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <ClockIcon className="h-3 w-3 mr-1" />
                Pending Review
            </span>
        );
    };

    if (!isAdmin()) {
        return (
            <div className="text-center py-12">
                <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
                <p className="mt-1 text-sm text-gray-500">You need admin privileges to access this page.</p>
            </div>
        );
    }

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
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Store Management</h1>
                        <p className="text-gray-600">Review and approve store registrations</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                            {filteredStores.length} {filter} stores
                        </span>
                    </div>
                </div>

                {/* Filters */}
                <div className="mt-4 flex space-x-4">
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                            filter === 'pending'
                                ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                                : 'text-gray-500 hover:text-gray-700 border border-gray-300'
                        }`}
                    >
                        Pending Review ({stores.filter(s => !s.is_verified).length})
                    </button>
                    <button
                        onClick={() => setFilter('verified')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                            filter === 'verified'
                                ? 'bg-green-100 text-green-700 border border-green-300'
                                : 'text-gray-500 hover:text-gray-700 border border-gray-300'
                        }`}
                    >
                        Verified ({stores.filter(s => s.is_verified).length})
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                            filter === 'all'
                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                                : 'text-gray-500 hover:text-gray-700 border border-gray-300'
                        }`}
                    >
                        All Stores ({stores.length})
                    </button>
                </div>
            </div>

            {/* Stores List */}
            <div className="space-y-4">
                {filteredStores.map((store) => (
                    <div key={store.store_id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <BuildingStorefrontIcon className="h-8 w-8 text-gray-400" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {store.trading_name}
                                            </h3>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className="text-sm text-gray-600">{store.category}</span>
                                                <span className="text-gray-400">•</span>
                                                {getStatusBadge(store)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <MapPinIcon className="h-4 w-4 mr-2" />
                                                {store.primary_location ? 
                                                    `${store.primary_location.city}, ${store.primary_location.governorate}` :
                                                    'No location set'
                                                }
                                            </div>
                                            {store.phone && (
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <PhoneIcon className="h-4 w-4 mr-2" />
                                                    {store.phone}
                                                </div>
                                            )}
                                            {store.website && (
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <GlobeAltIcon className="h-4 w-4 mr-2" />
                                                    <a href={store.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
                                                        Website
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-sm">
                                                <span className="text-gray-500">Owner:</span>
                                                <span className="ml-2 text-gray-900">
                                                    {store.owner ? `${store.owner.first_name} ${store.owner.last_name}` : 'Unknown'}
                                                </span>
                                            </div>
                                            <div className="text-sm">
                                                <span className="text-gray-500">Created:</span>
                                                <span className="ml-2 text-gray-900">
                                                    {new Date(store.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {store.verification_date && (
                                                <div className="text-sm">
                                                    <span className="text-gray-500">Verified:</span>
                                                    <span className="ml-2 text-gray-900">
                                                        {new Date(store.verification_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {store.description && (
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-700 line-clamp-2">{store.description}</p>
                                        </div>
                                    )}

                                    {store.verification_notes && (
                                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center mb-1">
                                                <DocumentTextIcon className="h-4 w-4 text-gray-500 mr-2" />
                                                <span className="text-sm font-medium text-gray-700">Admin Notes</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{store.verification_notes}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col space-y-2 ml-6">
                                    <button
                                        onClick={() => setSelectedStore(store)}
                                        className="flex items-center px-3 py-2 border border-indigo-300 rounded-md text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition-colors"
                                    >
                                        <EyeIcon className="h-4 w-4 mr-1" />
                                        Review
                                    </button>
                                    
                                    {!store.is_verified && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setSelectedStore(store);
                                                    setVerificationNotes('Store approved after review.');
                                                }}
                                                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                                            >
                                                <CheckCircleIcon className="h-4 w-4 mr-1" />
                                                Quick Approve
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedStore(store);
                                                    setVerificationNotes('Store requires additional documentation.');
                                                }}
                                                className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                                            >
                                                <XCircleIcon className="h-4 w-4 mr-1" />
                                                Quick Reject
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredStores.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No {filter} stores found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {filter === 'pending' 
                                ? 'All stores have been reviewed.' 
                                : `There are no ${filter} stores at the moment.`
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {selectedStore && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Review Store: {selectedStore.trading_name}
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Verification Notes
                                </label>
                                <textarea
                                    value={verificationNotes}
                                    onChange={(e) => setVerificationNotes(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter notes about your decision..."
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setSelectedStore(null);
                                        setVerificationNotes('');
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    disabled={actionLoading}
                                >
                                    Cancel
                                </button>
                                {!selectedStore.is_verified && (
                                    <>
                                        <button
                                            onClick={() => handleVerification(selectedStore.store_id, false)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? 'Processing...' : 'Reject'}
                                        </button>
                                        <button
                                            onClick={() => handleVerification(selectedStore.store_id, true)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? 'Processing...' : 'Approve'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStoreList;