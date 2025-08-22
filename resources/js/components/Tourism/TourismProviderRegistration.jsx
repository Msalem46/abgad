import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    BuildingOfficeIcon,
    DocumentTextIcon,
    MapPinIcon,
    CameraIcon,
    CheckCircleIcon,
    XMarkIcon,
    InformationCircleIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../../services/api';

const TourismProviderRegistration = () => {
    const { t, direction, language } = useLanguage();
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        // Company Information
        company_name: '',
        company_description: '',
        license_number: '',
        representative_name: '',
        representative_title: '',
        
        // Contact Information
        phone: '',
        email: '',
        website: '',
        whatsapp: '',
        
        // Location Information
        operating_areas: [],
        main_office_city: '',
        main_office_address: '',
        
        // Business Details
        service_types: [],
        specialties: [],
        spoken_languages: [],
        years_experience: '',
        certifications: [],
        
        // Media
        logo: null,
        portfolio_images: [],
        certificates: []
    });

    // Available options
    const jordanianCities = [
        'Amman', 'Irbid', 'Zarqa', 'Aqaba', 'Salt', 
        'Madaba', 'Jerash', 'Ajloun', 'Karak', 'Tafilah', 'Maan', 'Mafraq',
        'Wadi Rum', 'Dead Sea', 'Dana', 'Azraq'
    ];

    const serviceTypes = [
        'Cultural Tours', 'Adventure Tours', 'Historical Sites', 'Nature & Wildlife',
        'Religious Tours', 'City Tours', 'Desert Tours', 'Diving & Snorkeling',
        'Hiking & Trekking', 'Photography Tours', 'Food Tours', 'Wellness Tours'
    ];

    const availableLanguages = [
        'Arabic', 'English', 'French', 'German', 'Spanish', 'Italian', 'Russian', 'Chinese'
    ];

    const specialtyOptions = [
        'Petra Tours', 'Wadi Rum Desert', 'Dead Sea', 'Jerash', 'Amman City',
        'Aqaba & Red Sea', 'Jordan Trail', 'Biblical Sites', 'Eco Tourism',
        'Adventure Sports', 'Cultural Heritage', 'Food & Cuisine'
    ];

    // Show loading while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        {t('tourismRegistration.checkingAuth')}
                    </p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
                    <GlobeAltIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {t('tourismRegistration.loginRequired')}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {t('tourismRegistration.loginRequiredMessage')}
                    </p>
                    <div className="space-y-3">
                        <Link
                            to="/login"
                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            {t('freelancerRegistration.goToLogin')}
                        </Link>
                        
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">
                                {language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}
                            </p>
                            <Link
                                to="/register"
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-indigo-600 rounded-md text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                            >
                                {language === 'ar' ? 'إنشاء حساب جديد' : 'Create New Account'}
                            </Link>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-md">
                            <p className="text-xs text-blue-800 text-center font-medium mb-1">
                                {language === 'ar' ? 'للتجربة السريعة:' : 'For Quick Demo:'}
                            </p>
                            <p className="text-xs text-blue-700 text-center">
                                owner@storeview.jo / password
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleArrayAdd = (field, value) => {
        if (value.trim() && !formData[field].includes(value.trim())) {
            setFormData(prev => ({
                ...prev,
                [field]: [...prev[field], value.trim()]
            }));
        }
    };

    const handleArrayRemove = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleFileChange = (field, files) => {
        if (field === 'logo') {
            setFormData(prev => ({
                ...prev,
                [field]: files[0] || null
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: Array.from(files).slice(0, 10) // Max 10 images
            }));
        }
    };

    const validateStep = (stepNumber) => {
        const newErrors = {};

        switch (stepNumber) {
            case 1:
                if (!formData.company_name.trim()) {
                    newErrors.company_name = 'Company name is required';
                }
                if (!formData.company_description.trim()) {
                    newErrors.company_description = 'Company description is required';
                }
                if (formData.company_description.length < 100) {
                    newErrors.company_description = 'Description must be at least 100 characters long';
                }
                if (!formData.license_number.trim()) {
                    newErrors.license_number = 'Tourism license number is required';
                }
                if (!formData.representative_name.trim()) {
                    newErrors.representative_name = 'Representative name is required';
                }
                if (!formData.representative_title.trim()) {
                    newErrors.representative_title = 'Representative title is required';
                }
                break;
            
            case 2:
                if (!formData.phone.trim()) {
                    newErrors.phone = 'Phone number is required';
                }
                if (!formData.email.trim()) {
                    newErrors.email = 'Email address is required';
                }
                if (!formData.main_office_city) {
                    newErrors.main_office_city = 'Main office city is required';
                }
                if (!formData.main_office_address.trim()) {
                    newErrors.main_office_address = 'Office address is required';
                }
                if (formData.operating_areas.length === 0) {
                    newErrors.operating_areas = 'At least one operating area is required';
                }
                break;
            
            case 3:
                if (formData.service_types.length === 0) {
                    newErrors.service_types = 'At least one service type is required';
                }
                if (formData.specialties.length === 0) {
                    newErrors.specialties = 'At least one specialty is required';
                }
                if (!formData.years_experience || formData.years_experience < 1) {
                    newErrors.years_experience = 'Years of experience is required';
                }
                if (formData.spoken_languages.length === 0) {
                    newErrors.spoken_languages = 'At least one language is required';
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateStep(3)) {
            return;
        }

        setLoading(true);
        
        try {
            const submitData = new FormData();
            
            // Add basic fields
            Object.keys(formData).forEach(key => {
                if (Array.isArray(formData[key]) && !['portfolio_images', 'certificates'].includes(key)) {
                    submitData.append(key, JSON.stringify(formData[key]));
                } else if (formData[key] !== null && !['logo', 'portfolio_images', 'certificates'].includes(key)) {
                    submitData.append(key, formData[key]);
                }
            });
            
            // Add files
            if (formData.logo) {
                submitData.append('logo', formData.logo);
            }
            
            formData.portfolio_images.forEach((file, index) => {
                submitData.append(`portfolio_images[${index}]`, file);
            });

            formData.certificates.forEach((file, index) => {
                submitData.append(`certificates[${index}]`, file);
            });

            const response = await api.post('/tourism-providers', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                navigate('/dashboard', { 
                    state: { message: 'Tourism provider registration submitted successfully!' }
                });
            }

        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ 
                    general: error.response?.data?.message || 'Failed to register tourism provider' 
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                    {t('tourismRegistration.companyInfo')}
                </h3>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('tourismRegistration.companyName')} *
                </label>
                <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    placeholder={language === 'ar' ? 'شركة الأردن للسياحة' : 'Jordan Tourism Company'}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                        errors.company_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                />
                {errors.company_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('tourismRegistration.companyDescription')} *
                </label>
                <textarea
                    rows={5}
                    value={formData.company_description}
                    onChange={(e) => handleInputChange('company_description', e.target.value)}
                    placeholder={language === 'ar' ? 'اكتب وصفاً مفصلاً عن شركتك السياحية وخدماتك...' : 'Describe your tourism business and services in detail...'}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                        errors.company_description ? 'border-red-300' : 'border-gray-300'
                    }`}
                />
                <div className="flex justify-between mt-1">
                    <div>
                        {errors.company_description && (
                            <p className="text-sm text-red-600">{errors.company_description}</p>
                        )}
                    </div>
                    <p className="text-sm text-gray-500">{formData.company_description.length} characters</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('tourismRegistration.licenseNumber')} *
                </label>
                <input
                    type="text"
                    value={formData.license_number}
                    onChange={(e) => handleInputChange('license_number', e.target.value)}
                    placeholder="TL-2024-001"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                        errors.license_number ? 'border-red-300' : 'border-gray-300'
                    }`}
                />
                {errors.license_number && (
                    <p className="mt-1 text-sm text-red-600">{errors.license_number}</p>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('tourismRegistration.representative')} *
                    </label>
                    <input
                        type="text"
                        value={formData.representative_name}
                        onChange={(e) => handleInputChange('representative_name', e.target.value)}
                        placeholder={language === 'ar' ? 'أحمد محمد' : 'Ahmad Mohammad'}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                            errors.representative_name ? 'border-red-300' : 'border-gray-300'
                        }`}
                    />
                    {errors.representative_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.representative_name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'المسمى الوظيفي' : 'Title'} *
                    </label>
                    <input
                        type="text"
                        value={formData.representative_title}
                        onChange={(e) => handleInputChange('representative_title', e.target.value)}
                        placeholder={language === 'ar' ? 'مدير عام' : 'General Manager'}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                            errors.representative_title ? 'border-red-300' : 'border-gray-300'
                        }`}
                    />
                    {errors.representative_title && (
                        <p className="mt-1 text-sm text-red-600">{errors.representative_title}</p>
                    )}
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    {t('tourismRegistration.contactInfo')}
                </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
                    </label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+962 7X XXX XXXX"
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                            errors.phone ? 'border-red-300' : 'border-gray-300'
                        }`}
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} *
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="info@company.com"
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                            errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الموقع الإلكتروني' : 'Website'}
                    </label>
                    <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://www.company.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'واتساب' : 'WhatsApp'}
                    </label>
                    <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                        placeholder="+962 7X XXX XXXX"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'المدينة الرئيسية' : 'Main Office City'} *
                </label>
                <select
                    value={formData.main_office_city}
                    onChange={(e) => handleInputChange('main_office_city', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                        errors.main_office_city ? 'border-red-300' : 'border-gray-300'
                    }`}
                >
                    <option value="">{language === 'ar' ? 'اختر المدينة' : 'Select City'}</option>
                    {jordanianCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
                {errors.main_office_city && (
                    <p className="mt-1 text-sm text-red-600">{errors.main_office_city}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'عنوان المكتب الرئيسي' : 'Main Office Address'} *
                </label>
                <textarea
                    rows={3}
                    value={formData.main_office_address}
                    onChange={(e) => handleInputChange('main_office_address', e.target.value)}
                    placeholder={language === 'ar' ? 'العنوان الكامل للمكتب الرئيسي...' : 'Full address of main office...'}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                        errors.main_office_address ? 'border-red-300' : 'border-gray-300'
                    }`}
                />
                {errors.main_office_address && (
                    <p className="mt-1 text-sm text-red-600">{errors.main_office_address}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('tourismRegistration.operatingAreas')} * {formData.operating_areas.length > 0 && `(${formData.operating_areas.length} selected)`}
                </label>
                <select
                    onChange={(e) => {
                        if (e.target.value) {
                            handleArrayAdd('operating_areas', e.target.value);
                            e.target.value = '';
                        }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 mb-3"
                >
                    <option value="">{language === 'ar' ? 'أضف منطقة تشغيل' : 'Add operating area'}</option>
                    {jordanianCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>

                {formData.operating_areas.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {formData.operating_areas.map((area, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                            >
                                {area}
                                <button
                                    type="button"
                                    onClick={() => handleArrayRemove('operating_areas', index)}
                                    className="ml-2 text-green-600 hover:text-green-800"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
                {errors.operating_areas && (
                    <p className="mt-1 text-sm text-red-600">{errors.operating_areas}</p>
                )}
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    {language === 'ar' ? 'تفاصيل النشاط' : 'Business Details'}
                </h3>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('tourismRegistration.serviceTypes')} * {formData.service_types.length > 0 && `(${formData.service_types.length} selected)`}
                </label>
                <select
                    onChange={(e) => {
                        if (e.target.value) {
                            handleArrayAdd('service_types', e.target.value);
                            e.target.value = '';
                        }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 mb-3"
                >
                    <option value="">{language === 'ar' ? 'أضف نوع خدمة' : 'Add service type'}</option>
                    {serviceTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>

                {formData.service_types.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {formData.service_types.map((type, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                            >
                                {type}
                                <button
                                    type="button"
                                    onClick={() => handleArrayRemove('service_types', index)}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
                {errors.service_types && (
                    <p className="mt-1 text-sm text-red-600">{errors.service_types}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('tourismRegistration.specialties')} * {formData.specialties.length > 0 && `(${formData.specialties.length} selected)`}
                </label>
                <select
                    onChange={(e) => {
                        if (e.target.value) {
                            handleArrayAdd('specialties', e.target.value);
                            e.target.value = '';
                        }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 mb-3"
                >
                    <option value="">{language === 'ar' ? 'أضف تخصص' : 'Add specialty'}</option>
                    {specialtyOptions.map(specialty => (
                        <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                </select>

                {formData.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {formData.specialties.map((specialty, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                            >
                                {specialty}
                                <button
                                    type="button"
                                    onClick={() => handleArrayRemove('specialties', index)}
                                    className="ml-2 text-purple-600 hover:text-purple-800"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
                {errors.specialties && (
                    <p className="mt-1 text-sm text-red-600">{errors.specialties}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('tourismRegistration.languages')} * {formData.spoken_languages.length > 0 && `(${formData.spoken_languages.length} selected)`}
                </label>
                <select
                    onChange={(e) => {
                        if (e.target.value) {
                            handleArrayAdd('spoken_languages', e.target.value);
                            e.target.value = '';
                        }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 mb-3"
                >
                    <option value="">{language === 'ar' ? 'أضف لغة' : 'Add language'}</option>
                    {availableLanguages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                    ))}
                </select>

                {formData.spoken_languages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {formData.spoken_languages.map((lang, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                            >
                                {lang}
                                <button
                                    type="button"
                                    onClick={() => handleArrayRemove('spoken_languages', index)}
                                    className="ml-2 text-green-600 hover:text-green-800"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
                {errors.spoken_languages && (
                    <p className="mt-1 text-sm text-red-600">{errors.spoken_languages}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('tourismRegistration.experience')} *
                </label>
                <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.years_experience}
                    onChange={(e) => handleInputChange('years_experience', e.target.value)}
                    placeholder="5"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                        errors.years_experience ? 'border-red-300' : 'border-gray-300'
                    }`}
                />
                {errors.years_experience && (
                    <p className="mt-1 text-sm text-red-600">{errors.years_experience}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الشعار' : 'Company Logo'}
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('logo', e.target.files)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('tourismRegistration.portfolio')}
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileChange('portfolio_images', e.target.files)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        {language === 'ar' ? 'حتى 10 صور' : 'Up to 10 images'}
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('tourismRegistration.certifications')}
                    </label>
                    <input
                        type="file"
                        accept="image/*,application/pdf"
                        multiple
                        onChange={(e) => handleFileChange('certificates', e.target.files)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        {language === 'ar' ? 'شهادات وتراخيص' : 'Certificates & licenses'}
                    </p>
                </div>
            </div>
        </div>
    );

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        stepNumber === step
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : stepNumber < step
                            ? 'bg-green-600 border-green-600 text-white'
                            : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                        {stepNumber < step ? (
                            <CheckCircleIcon className="h-5 w-5" />
                        ) : (
                            stepNumber
                        )}
                    </div>
                    {stepNumber < 3 && (
                        <div className={`w-12 h-1 ${
                            stepNumber < step ? 'bg-green-600' : 'bg-gray-300'
                        }`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50" dir={direction}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-md">
                    <div className="px-6 py-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {t('tourismRegistration.title')}
                            </h1>
                            <p className="mt-2 text-lg text-gray-600">
                                {t('tourismRegistration.subtitle')}
                            </p>
                        </div>

                        {renderStepIndicator()}

                        <form onSubmit={handleSubmit}>
                            {step === 1 && renderStep1()}
                            {step === 2 && renderStep2()}
                            {step === 3 && renderStep3()}

                            {errors.general && (
                                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                                    <div className="flex">
                                        <InformationCircleIcon className="h-5 w-5 text-red-400" />
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700">{errors.general}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between mt-8">
                                <div>
                                    {step > 1 && (
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                            {language === 'ar' ? 'السابق' : 'Previous'}
                                        </button>
                                    )}
                                </div>
                                
                                <div className="flex space-x-3">
                                    <Link
                                        to="/"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        {language === 'ar' ? 'إلغاء' : 'Cancel'}
                                    </Link>
                                    
                                    {step < 3 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                                        >
                                            {language === 'ar' ? 'التالي' : 'Next'}
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            {loading ? (language === 'ar' ? 'جاري الإرسال...' : 'Submitting...') : t('tourismRegistration.createAccount')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourismProviderRegistration;