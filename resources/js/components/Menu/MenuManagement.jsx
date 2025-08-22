import React from 'react';
import { useParams } from 'react-router-dom';

const MenuManagement = () => {
    const { id } = useParams();

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Menu Management
                </h1>
                <p className="text-gray-600">
                    Manage menu for store ID: {id}
                </p>
                <div className="mt-4 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <p className="text-gray-500">Menu management feature coming soon...</p>
                    <p className="text-sm text-gray-400 mt-2">Create categories and add menu items</p>
                </div>
            </div>
        </div>
    );
};

export default MenuManagement;
