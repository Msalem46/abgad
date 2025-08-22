import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import LocationPicker from '../Maps/LocationPicker';
import ImageUpload from '../Forms/ImageUpload';

const StoreForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        trading_name: '',
        national_id: '',
        trading_license_number: '',
        commercial_registration_number: '',
        tax_number: '',
        municipality_license: '',
        health_permit: '',
        fire_safety_certificate: '',
        description: '',
        category: '',
        subcategory: '',
        established_date: '',
        website: '',
        social_media: {
            facebook: '',
            instagram: '',
            twitter: ''
        },
        operating_hours: {
            sunday: { open: '09:00', close: '22:00' },
            monday: { open: '09:00', close: '22:00' },
            tuesday: { open: '09:00', close: '22:00' },
            wednesday: { open: '09:00', close: '22:00' },
            thursday: { open: '09:00', close: '22:00' },
            friday: { open: '14:00', close: '22:00' },
            saturday: { open: '09:00', close: '22:00' }
        },
        location: {
            latitude: 31.9454,
            longitude: 35.9284,
            street_address: '',
            building_number: '',
            floor_number: '',
            apartment_unit: '',
            neighborhood: '',
            city: 'Amman',
            governorate: 'Amman',
            postal_code: '',
            landmarks: '',
            parking_availability: false,
            public_transport_access: ''
        }
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [externalImages, setExternalImages] = useState([]);
    const [internalImages, setInternalImages] = useState([]);

    const categories = [
        'Restaurant', 'Cafe', 'Shop', 'Service', 'Healthcare',
        'Automotive', 'Beauty & Wellness', 'Education', 'Other'
    ];

    const days = [
        'sunday', 'monday', 'tuesday', 'wednesday',
        'thursday', 'friday', 'saturday'
    ];

    useEffect(() => {
        if (isEdit) {
            fetchStore();
        }
    }, [id]);

    const fetchStore = async () => {
        try {
            const response = await api.get(`/stores/${id}`);
            const storeData = response.data.data;
            
            // Ensure location object exists with proper structure
            const locationData = storeData.primaryLocation || storeData.location || {};
            
            setFormData({
                ...storeData,
                location: {
                    latitude: locationData.latitude || 31.9454,
                    longitude: locationData.longitude || 35.9284,
                    street_address: locationData.street_address || '',
                    building_number: locationData.building_number || '',
                    floor_number: locationData.floor_number || '',
                    apartment_unit: locationData.apartment_unit || '',
                    neighborhood: locationData.neighborhood || '',
                    city: locationData.city || 'Amman',
                    governorate: locationData.governorate || 'Amman',
                    postal_code: locationData.postal_code || '',
                    landmarks: locationData.landmarks || '',
                    parking_availability: locationData.parking_availability || false,
                    public_transport_access: locationData.public_transport_access || ''
                }
            });
        } catch (error) {
            toast.error('Error loading store data');
            navigate('/dashboard/stores');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSocialMediaChange = (platform, value) => {
        setFormData(prev => ({
            ...prev,
            social_media: {
                ...prev.social_media,
                [platform]: value
            }
        }));
    };

    const handleOperatingHoursChange = (day, field, value) => {
        setFormData(prev => ({
            ...prev,
            operating_hours: {
                ...prev.operating_hours,
                [day]: {
                    ...prev.operating_hours[day],
                    [field]: value
                }
            }
        }));
    };

    const handleLocationSelect = (location) => {
        setFormData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                latitude: location.lat,
                longitude: location.lng
            }
        }));
    };

    const handleLocationChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                [field]: value
            }
        }));
    };

    const handleExternalImagesChange = (images) => {
        setExternalImages(images);
    };

    const handleInternalImagesChange = (images) => {
        setInternalImages(images);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const submitData = new FormData();
            
            // Add form data
            Object.keys(formData).forEach(key => {
                if (typeof formData[key] === 'object' && formData[key] !== null) {
                    submitData.append(key, JSON.stringify(formData[key]));
                } else {
                    submitData.append(key, formData[key]);
                }
            });

            // Add external images
            externalImages.forEach((image, index) => {
                if (image.file) {
                    submitData.append(`external_images[${index}]`, image.file);
                }
            });

            // Add internal images
            internalImages.forEach((image, index) => {
                if (image.file) {
                    submitData.append(`internal_images[${index}]`, image.file);
                }
            });

            if (isEdit) {
                await api.put(`/stores/${id}`, submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                toast.success('Store updated successfully!');
            } else {
                await api.post('/stores', submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                toast.success('Store created successfully!');
            }
            navigate('/dashboard/stores');
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                toast.error('Error saving store');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h1 className="text-xl font-semibold text-gray-900">
                        {isEdit ? 'Edit Store' : 'Add New Store'}
                    </h1>
                    <p className="text-sm text-gray-600">
                        {isEdit ? 'Update your store information' : 'Register your business with Store Viewer Jordan'}
                    </p>
                    
                    {/* Verification Status Banner */}
                    {isEdit && formData.is_verified !== undefined && (
                        <div className={`mt-3 p-3 rounded-lg border ${
                            formData.is_verified 
                                ? 'bg-green-50 border-green-200 text-green-800' 
                                : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                        }`}>
                            <div className="flex items-center">
                                {formData.is_verified ? (
                                    <>
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium">✅ Store Verified</p>
                                            <p className="text-xs">Your store has been approved and is visible to customers.</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium">⏳ Pending Verification</p>
                                            <p className="text-xs">Your store is under admin review. You can still edit your information while waiting for approval.</p>
                                            {formData.verification_notes && (
                                                <p className="text-xs mt-1 font-medium">Admin notes: {formData.verification_notes}</p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Trading Name *
                                </label>
                                <input
                                    type="text"
                                    name="trading_name"
                                    value={formData.trading_name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter your business name"
                                    required
                                />
                                {errors.trading_name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.trading_name[0]}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    National ID * <span className="text-xs text-gray-500">(13 digits)</span>
                                </label>
                                <input
                                    type="text"
                                    name="national_id"
                                    value={formData.national_id}
                                    onChange={handleInputChange}
                                    maxLength="13"
                                    pattern="[0-9]{13}"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="1234567890123"
                                    required
                                />
                                {errors.national_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.national_id[0]}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Trading License Number *
                                </label>
                                <input
                                    type="text"
                                    name="trading_license_number"
                                    value={formData.trading_license_number}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="TL-AMM-2024-001"
                                    required
                                />
                                {errors.trading_license_number && (
                                    <p className="mt-1 text-sm text-red-600">{errors.trading_license_number[0]}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Jordanian Authorizations */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Jordanian Authorizations
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Commercial Registration Number
                                </label>
                                <input
                                    type="text"
                                    name="commercial_registration_number"
                                    value={formData.commercial_registration_number}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="CR-123456789"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tax Number
                                </label>
                                <input
                                    type="text"
                                    name="tax_number"
                                    value={formData.tax_number}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="TAX-987654321"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Municipality License
                                </label>
                                <input
                                    type="text"
                                    name="municipality_license"
                                    value={formData.municipality_license}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="MUN-AMM-2024-001"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Health Permit
                                </label>
                                <input
                                    type="text"
                                    name="health_permit"
                                    value={formData.health_permit}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="HP-2024-001"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Operating Hours */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Operating Hours
                        </h3>
                        <div className="space-y-4">
                            {days.map(day => (
                                <div key={day} className="flex items-center space-x-4">
                                    <div className="w-24">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {day}
                    </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="time"
                                            value={formData.operating_hours[day]?.open || ''}
                                            onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <span className="text-gray-500">to</span>
                                        <input
                                            type="time"
                                            value={formData.operating_hours[day]?.close || ''}
                                            onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="border-t pt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Store Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Describe your store, products, or services..."
                        />
                    </div>

                    {/* Location Section */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Store Location
                        </h3>
                        
                        {/* Map Location Picker */}
                        <div className="mb-6">
                            <LocationPicker
                                onLocationSelect={handleLocationSelect}
                                initialPosition={{
                                    lat: formData.location?.latitude || 31.9454,
                                    lng: formData.location?.longitude || 35.9284
                                }}
                            />
                        </div>

                        {/* Address Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Street Address *
                                </label>
                                <input
                                    type="text"
                                    value={formData.location?.street_address || ''}
                                    onChange={(e) => handleLocationChange('street_address', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Street name and number"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Building Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.location?.building_number || ''}
                                    onChange={(e) => handleLocationChange('building_number', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Building number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    value={formData.location?.city || ''}
                                    onChange={(e) => handleLocationChange('city', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="City"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Governorate *
                                </label>
                                <select
                                    value={formData.location?.governorate || ''}
                                    onChange={(e) => handleLocationChange('governorate', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">Select Governorate</option>
                                    <option value="Amman">Amman</option>
                                    <option value="Irbid">Irbid</option>
                                    <option value="Zarqa">Zarqa</option>
                                    <option value="Balqa">Balqa</option>
                                    <option value="Madaba">Madaba</option>
                                    <option value="Karak">Karak</option>
                                    <option value="Tafilah">Tafilah</option>
                                    <option value="Maan">Maan</option>
                                    <option value="Aqaba">Aqaba</option>
                                    <option value="Jerash">Jerash</option>
                                    <option value="Ajloun">Ajloun</option>
                                    <option value="Mafraq">Mafraq</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Neighborhood
                                </label>
                                <input
                                    type="text"
                                    value={formData.location?.neighborhood || ''}
                                    onChange={(e) => handleLocationChange('neighborhood', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Neighborhood or area"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Landmarks
                                </label>
                                <input
                                    type="text"
                                    value={formData.location?.landmarks || ''}
                                    onChange={(e) => handleLocationChange('landmarks', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Nearby landmarks"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.location?.parking_availability || false}
                                    onChange={(e) => handleLocationChange('parking_availability', e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    Parking Available
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Store Images */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-6">
                            Store Images
                        </h3>
                        
                        {/* External Images */}
                        <div className="mb-8">
                            <ImageUpload
                                type="exterior"
                                onImagesChange={handleExternalImagesChange}
                                maxImages={10}
                            />
                        </div>

                        {/* Internal Images */}
                        <div>
                            <ImageUpload
                                type="interior"
                                onImagesChange={handleInternalImagesChange}
                                maxImages={10}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/stores')}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (isEdit ? 'Update Store' : 'Create Store')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StoreForm;
