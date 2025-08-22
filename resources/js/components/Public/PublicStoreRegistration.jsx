import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    BuildingStorefrontIcon,
    UserIcon,
    MapPinIcon,
    PhotoIcon,
    ClockIcon,
    PhoneIcon,
    GlobeAltIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import LocationPicker from '../Maps/LocationPicker';
import ImageUpload from '../Forms/ImageUpload';
import api from '../../services/api';

const PublicStoreRegistration = () => {
    const navigate = useNavigate();
    const { t, direction } = useLanguage();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Form data state
    const [formData, setFormData] = useState({
        // Owner information
        owner_first_name: '',
        owner_last_name: '',
        owner_email: '',
        owner_phone: '',
        password: '',
        password_confirmation: '',
        
        // Store information
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

    const [externalImages, setExternalImages] = useState([]);
    const [internalImages, setInternalImages] = useState([]);

    const categories = [
        { key: 'restaurant', label: t('categories.restaurant') },
        { key: 'cafe', label: t('categories.cafe') },
        { key: 'shop', label: t('categories.shop') },
        { key: 'service', label: t('categories.service') },
        { key: 'healthcare', label: t('categories.healthcare') },
        { key: 'automotive', label: t('categories.automotive') },
        { key: 'beautyWellness', label: t('categories.beautyWellness') },
        { key: 'education', label: t('categories.education') },
        { key: 'other', label: t('categories.other') }
    ];

    const days = [
        'sunday', 'monday', 'tuesday', 'wednesday',
        'thursday', 'friday', 'saturday'
    ];

    const dayNames = [
        t('days.sunday'), t('days.monday'), t('days.tuesday'), t('days.wednesday'),
        t('days.thursday'), t('days.friday'), t('days.saturday')
    ];

    const steps = [
        { number: 1, title: t('publicRegistration.ownerInfo'), icon: UserIcon },
        { number: 2, title: t('publicRegistration.storeDetails'), icon: BuildingStorefrontIcon },
        { number: 3, title: t('publicRegistration.locationHours'), icon: MapPinIcon },
        { number: 4, title: t('publicRegistration.photosFinal'), icon: PhotoIcon }
    ];

    const handleInputChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
        
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const handleLocationChange = (location) => {
        setFormData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                ...location
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

    const validateStep = (step) => {
        const newErrors = {};
        
        if (step === 1) {
            if (!formData.owner_first_name) newErrors.owner_first_name = 'First name is required';
            if (!formData.owner_last_name) newErrors.owner_last_name = 'Last name is required';
            if (!formData.owner_email) newErrors.owner_email = 'Email is required';
            if (!formData.owner_phone) newErrors.owner_phone = 'Phone is required';
            if (!formData.password) newErrors.password = 'Password is required';
            if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
            if (formData.password !== formData.password_confirmation) {
                newErrors.password_confirmation = 'Passwords do not match';
            }
        } else if (step === 2) {
            if (!formData.trading_name) newErrors.trading_name = 'Store name is required';
            if (!formData.category) newErrors.category = 'Category is required';
            if (!formData.description) newErrors.description = 'Description is required';
            if (!formData.national_id) newErrors.national_id = 'National ID is required';
            if (!formData.trading_license_number) newErrors.trading_license_number = 'Trading license is required';
        } else if (step === 3) {
            if (!formData.location.street_address) newErrors['location.street_address'] = 'Street address is required';
            if (!formData.location.city) newErrors['location.city'] = 'City is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) {
            return;
        }

        setLoading(true);
        try {
            const submitData = new FormData();

            // Add all form data
            Object.keys(formData).forEach(key => {
                if (typeof formData[key] === 'object' && formData[key] !== null) {
                    submitData.append(key, JSON.stringify(formData[key]));
                } else {
                    submitData.append(key, formData[key] || '');
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

            const response = await api.post('/public/register-store', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Store registration submitted successfully! Please check your email for account details.');
            
            // Redirect to login with a success message
            navigate('/login?registered=true');
            
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                toast.error('Error submitting registration. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <UserIcon className="mx-auto h-12 w-12 text-indigo-600" />
                            <h2 className="text-2xl font-bold text-gray-900 mt-4">{t('publicRegistration.ownerInfo')}</h2>
                            <p className="text-gray-600 mt-2">{t('publicRegistration.ownerInfoDesc')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('auth.firstName')} *</label>
                                <input
                                    type="text"
                                    value={formData.owner_first_name}
                                    onChange={(e) => handleInputChange('owner_first_name', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.owner_first_name && <p className="text-red-500 text-xs mt-1">{errors.owner_first_name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('auth.lastName')} *</label>
                                <input
                                    type="text"
                                    value={formData.owner_last_name}
                                    onChange={(e) => handleInputChange('owner_last_name', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.owner_last_name && <p className="text-red-500 text-xs mt-1">{errors.owner_last_name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('auth.email')} *</label>
                                <input
                                    type="email"
                                    value={formData.owner_email}
                                    onChange={(e) => handleInputChange('owner_email', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.owner_email && <p className="text-red-500 text-xs mt-1">{errors.owner_email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('auth.phone')} *</label>
                                <input
                                    type="tel"
                                    value={formData.owner_phone}
                                    onChange={(e) => handleInputChange('owner_phone', e.target.value)}
                                    placeholder={t('publicRegistration.phonePlaceholder')}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.owner_phone && <p className="text-red-500 text-xs mt-1">{errors.owner_phone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('auth.password')} *</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('auth.confirmPassword')} *</label>
                                <input
                                    type="password"
                                    value={formData.password_confirmation}
                                    onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-indigo-600" />
                            <h2 className="text-2xl font-bold text-gray-900 mt-4">{t('publicRegistration.storeDetails')}</h2>
                            <p className="text-gray-600 mt-2">{t('publicRegistration.storeDetailsDesc')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">{t('storeForm.storeName')} *</label>
                                <input
                                    type="text"
                                    value={formData.trading_name}
                                    onChange={(e) => handleInputChange('trading_name', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.trading_name && <p className="text-red-500 text-xs mt-1">{errors.trading_name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('storeForm.category')} *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">{t('publicRegistration.selectCategory')}</option>
                                    {categories.map(cat => (
                                        <option key={cat.key} value={cat.label}>{cat.label}</option>
                                    ))}
                                </select>
                                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('storeForm.subcategory')}</label>
                                <input
                                    type="text"
                                    value={formData.subcategory}
                                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                                    placeholder="e.g., Fast Food, Coffee Shop"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Description *</label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Describe your business, what you offer, what makes you special..."
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">National ID *</label>
                                <input
                                    type="text"
                                    value={formData.national_id}
                                    onChange={(e) => handleInputChange('national_id', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.national_id && <p className="text-red-500 text-xs mt-1">{errors.national_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Trading License *</label>
                                <input
                                    type="text"
                                    value={formData.trading_license_number}
                                    onChange={(e) => handleInputChange('trading_license_number', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.trading_license_number && <p className="text-red-500 text-xs mt-1">{errors.trading_license_number}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Website</label>
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) => handleInputChange('website', e.target.value)}
                                    placeholder="https://yourwebsite.com"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Established Date</label>
                                <input
                                    type="date"
                                    value={formData.established_date}
                                    onChange={(e) => handleInputChange('established_date', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-medium text-gray-900">Social Media (Optional)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Facebook</label>
                                    <input
                                        type="url"
                                        value={formData.social_media.facebook}
                                        onChange={(e) => handleInputChange('social_media.facebook', e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Instagram</label>
                                    <input
                                        type="url"
                                        value={formData.social_media.instagram}
                                        onChange={(e) => handleInputChange('social_media.instagram', e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Twitter</label>
                                    <input
                                        type="url"
                                        value={formData.social_media.twitter}
                                        onChange={(e) => handleInputChange('social_media.twitter', e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <MapPinIcon className="mx-auto h-12 w-12 text-indigo-600" />
                            <h2 className="text-2xl font-bold text-gray-900 mt-4">Location & Hours</h2>
                            <p className="text-gray-600 mt-2">Help customers find you</p>
                        </div>

                        {/* Location Picker */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-medium text-gray-900">Store Location</h4>
                            <LocationPicker
                                location={formData.location}
                                onLocationChange={handleLocationChange}
                            />
                            {errors['location.street_address'] && <p className="text-red-500 text-xs">{errors['location.street_address']}</p>}
                        </div>

                        {/* Operating Hours */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-medium text-gray-900">Operating Hours</h4>
                            <div className="space-y-3">
                                {days.map((day, index) => (
                                    <div key={day} className="flex items-center space-x-4">
                                        <div className="w-24 text-sm font-medium text-gray-700">
                                            {dayNames[index]}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="time"
                                                value={formData.operating_hours[day].open}
                                                onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                                                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                            <span className="text-sm text-gray-500">to</span>
                                            <input
                                                type="time"
                                                value={formData.operating_hours[day].close}
                                                onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                                                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <PhotoIcon className="mx-auto h-12 w-12 text-indigo-600" />
                            <h2 className="text-2xl font-bold text-gray-900 mt-4">Photos & Final Step</h2>
                            <p className="text-gray-600 mt-2">Add photos to showcase your business</p>
                        </div>

                        {/* Image Uploads */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Exterior Photos</h4>
                                <ImageUpload
                                    images={externalImages}
                                    type="exterior"
                                    onImagesChange={setExternalImages}
                                    maxImages={5}
                                />
                            </div>
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Interior Photos</h4>
                                <ImageUpload
                                    images={internalImages}
                                    type="interior"
                                    onImagesChange={setInternalImages}
                                    maxImages={10}
                                />
                            </div>
                        </div>

                        {/* Final Notice */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-medium text-blue-900">Ready to Submit</h4>
                                    <p className="text-sm text-blue-700 mt-1">
                                        Your store registration will be reviewed by our team. We'll create your account and notify you via email once approved.
                                        You can then log in to manage your store listing.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8" dir={direction}>
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{t('publicRegistration.title')}</h1>
                    <p className="text-gray-600 mt-2">{t('publicRegistration.subtitle')}</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                    currentStep >= step.number
                                        ? 'bg-indigo-600 border-indigo-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-500'
                                }`}>
                                    {currentStep > step.number ? (
                                        <CheckCircleIcon className="w-6 h-6" />
                                    ) : (
                                        <step.icon className="w-5 h-5" />
                                    )}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-12 h-0.5 mx-2 ${
                                        currentStep > step.number ? 'bg-indigo-600' : 'bg-gray-300'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-2">
                        <span className="text-sm text-gray-600">
                            {t('publicRegistration.step')} {currentStep} {t('publicRegistration.of')} {steps.length}: {steps[currentStep - 1].title}
                        </span>
                    </div>
                </div>

                {/* Form Content */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                    {renderStepContent()}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-8 border-t mt-8">
                        <div>
                            {currentStep > 1 && (
                                <button
                                    onClick={prevStep}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    {t('publicRegistration.previous')}
                                </button>
                            )}
                        </div>
                        
                        <div className="flex space-x-3">
                            <button
                                onClick={() => navigate('/')}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                {t('common.cancel')}
                            </button>
                            
                            {currentStep < 4 ? (
                                <button
                                    onClick={nextStep}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                                >
                                    {t('publicRegistration.next')}
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {loading ? t('publicRegistration.submitting') : t('publicRegistration.submitRegistration')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicStoreRegistration;