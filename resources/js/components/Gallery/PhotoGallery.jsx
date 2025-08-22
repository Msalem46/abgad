import React from 'react';
import { useParams } from 'react-router-dom';

const PhotoGallery = () => {
const { id } = useParams();

return (
<div className="space-y-6">
    <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Photo Gallery
        </h1>
        <p className="text-gray-600">
            Manage photos for store ID: {id}
        </p>
        <div className="mt-4 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <p className="text-gray-500">Photo gallery feature coming soon...</p>
            <p className="text-sm text-gray-400 mt-2">Upload and manage your store photos</p>
        </div>
    </div>
</div>
);
};

export default PhotoGallery;
