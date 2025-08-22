import React, { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ImageUpload = ({ 
    label, 
    type = 'exterior', 
    multiple = true, 
    onImagesChange, 
    initialImages = [],
    maxImages = 10
}) => {
    const [images, setImages] = useState(initialImages);
    const [dragOver, setDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (files) => {
        const fileArray = Array.from(files);
        
        if (!multiple && fileArray.length > 1) {
            alert('Only one image is allowed');
            return;
        }

        if (images.length + fileArray.length > maxImages) {
            alert(`Maximum ${maxImages} images allowed`);
            return;
        }

        const validFiles = fileArray.filter(file => {
            // Check file type
            if (!file.type.startsWith('image/')) {
                alert(`${file.name} is not an image file`);
                return false;
            }
            
            // Check file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                alert(`${file.name} is too large. Maximum size is 10MB`);
                return false;
            }
            
            return true;
        });

        if (validFiles.length === 0) return;

        // Create preview objects
        const newImages = validFiles.map((file, index) => ({
            id: Date.now() + index,
            file,
            preview: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            type: type
        }));

        const updatedImages = multiple ? [...images, ...newImages] : newImages;
        setImages(updatedImages);
        onImagesChange(updatedImages);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const files = e.dataTransfer.files;
        handleFileSelect(files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const removeImage = (imageId) => {
        const updatedImages = images.filter(img => img.id !== imageId);
        setImages(updatedImages);
        onImagesChange(updatedImages);
        
        // Revoke object URL to prevent memory leaks
        const imageToRemove = images.find(img => img.id === imageId);
        if (imageToRemove && imageToRemove.preview) {
            URL.revokeObjectURL(imageToRemove.preview);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getTypeLabel = () => {
        switch (type) {
            case 'exterior':
                return 'External Store Images';
            case 'interior':
                return 'Internal Store Images';
            default:
                return label || 'Images';
        }
    };

    const getTypeDescription = () => {
        switch (type) {
            case 'exterior':
                return 'Upload photos of your store exterior, signage, and entrance';
            case 'interior':
                return 'Upload photos of your store interior, seating area, and ambiance';
            default:
                return 'Upload images';
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getTypeLabel()}
                </label>
                <p className="text-xs text-gray-500 mb-3">
                    {getTypeDescription()}. Maximum {maxImages} images, 10MB per image.
                </p>
            </div>

            {/* Upload Area */}
            <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                    dragOver
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <div className="text-center">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                        <label
                            htmlFor={`file-upload-${type}`}
                            className="cursor-pointer"
                        >
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                                Drop images here or{' '}
                                <span className="text-indigo-600 hover:text-indigo-500">
                                    browse
                                </span>
                            </span>
                        </label>
                        <input
                            ref={fileInputRef}
                            id={`file-upload-${type}`}
                            type="file"
                            className="sr-only"
                            multiple={multiple}
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e.target.files)}
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG, JPEG up to 10MB
                    </p>
                </div>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900">
                        Selected Images ({images.length}/{maxImages})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image) => (
                            <div key={image.id} className="relative group">
                                <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                                    <img
                                        src={image.preview}
                                        alt={image.name}
                                        className="w-full h-24 object-cover"
                                    />
                                </div>
                                
                                {/* Remove button */}
                                <button
                                    type="button"
                                    onClick={() => removeImage(image.id)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>

                                {/* Image info */}
                                <div className="mt-1">
                                    <p className="text-xs text-gray-600 truncate" title={image.name}>
                                        {image.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {formatFileSize(image.size)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {uploading && (
                <div className="text-center py-2">
                    <div className="inline-flex items-center text-sm text-gray-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                        Uploading images...
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;