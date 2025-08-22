import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    UserIcon,
    BriefcaseIcon,
    MapPinIcon,
    CurrencyDollarIcon,
    PhotoIcon,
    InformationCircleIcon,
    CheckCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../../services/api';

const FreelancerRegistration = () => {
    const { t, direction, language } = useLanguage();
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        professional_title: '',
        bio: '',
        skills: [],
        hourly_rate: '',
        experience_level: '',
        location: {
            city: '',
            country: 'Jordan'
        },
        languages: [],
        availability_status: 'available',
        profile_image: null,
        portfolio_images: []
    });

    // Available options
    const experienceLevels = [
        { key: 'beginner', label: 'Beginner (0-2 years)' },
        { key: 'intermediate', label: 'Intermediate (2-5 years)' },
        { key: 'expert', label: 'Expert (5+ years)' }
    ];

    const jordanianCities = [
        'Amman', 'Irbid', 'Zarqa', 'Aqaba', 'Salt', 
        'Madaba', 'Jerash', 'Ajloun', 'Karak', 'Tafilah', 'Maan', 'Mafraq'
    ];

    const availableLanguages = [
        'Arabic', 'English', 'French', 'German', 'Spanish', 'Turkish', 'Other'
    ];

    const commonSkills = [
        'Web Development', 'Mobile Development', 'Graphic Design', 'UI/UX Design',
        'Content Writing', 'Digital Marketing', 'SEO', 'Social Media Management',
        'Photography', 'Video Editing', 'Translation', 'Data Entry',
        'WordPress', 'React', 'Laravel', 'Python', 'JavaScript', 'PHP'
    ];

    // Show loading while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        {t('freelancerRegistration.checkingAuth')}
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
                    <UserIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {t('freelancerRegistration.loginRequired')}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {t('freelancerRegistration.loginRequiredMessage')}
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
        if (field === 'profile_image') {
            setFormData(prev => ({
                ...prev,
                [field]: files[0] || null
            }));
        } else if (field === 'portfolio_images') {
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
                if (!formData.professional_title.trim()) {
                    newErrors.professional_title = 'Professional title is required';
                }
                if (!formData.bio.trim()) {
                    newErrors.bio = 'Bio is required';
                }
                if (formData.bio.length < 50) {
                    newErrors.bio = 'Bio must be at least 50 characters long';
                }
                break;
            
            case 2:
                if (formData.skills.length === 0) {
                    newErrors.skills = 'At least one skill is required';
                }
                if (!formData.experience_level) {
                    newErrors.experience_level = 'Experience level is required';
                }
                break;
            
            case 3:
                if (!formData.location.city) {
                    newErrors['location.city'] = 'City is required';
                }
                if (!formData.hourly_rate || formData.hourly_rate < 1) {
                    newErrors.hourly_rate = 'Valid hourly rate is required';
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
            submitData.append('professional_title', formData.professional_title);
            submitData.append('bio', formData.bio);
            submitData.append('hourly_rate', formData.hourly_rate);
            submitData.append('experience_level', formData.experience_level);
            submitData.append('availability_status', formData.availability_status);
            
            // Add JSON fields
            submitData.append('skills', JSON.stringify(formData.skills));
            submitData.append('location', JSON.stringify(formData.location));
            submitData.append('languages', JSON.stringify(formData.languages));
            
            // Add files
            if (formData.profile_image) {
                submitData.append('profile_image', formData.profile_image);
            }
            
            formData.portfolio_images.forEach((file, index) => {
                submitData.append(`portfolio_images[${index}]`, file);
            });

            const response = await api.post('/freelancers', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                navigate('/dashboard', { 
                    state: { message: 'Freelancer profile created successfully!' }
                });
            }

        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ 
                    general: error.response?.data?.message || 'Failed to create freelancer profile' 
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
                    <UserIcon className="h-5 w-5 mr-2" />
                    Basic Information
                </h3>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Title *
                </label>
                <input
                    type="text"
                    value={formData.professional_title}
                    onChange={(e) => handleInputChange('professional_title', e.target.value)}
                    placeholder="e.g., Full Stack Developer, Graphic Designer"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                        errors.professional_title ? 'border-red-300' : 'border-gray-300'
                    }`}
                />
                {errors.professional_title && (
                    <p className="mt-1 text-sm text-red-600">{errors.professional_title}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio *
                </label>
                <textarea
                    rows={5}
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell potential clients about yourself, your experience, and what makes you unique..."
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                        errors.bio ? 'border-red-300' : 'border-gray-300'
                    }`}
                />
                <div className="flex justify-between mt-1">
                    <div>
                        {errors.bio && (
                            <p className="text-sm text-red-600">{errors.bio}</p>
                        )}
                    </div>
                    <p className="text-sm text-gray-500">{formData.bio.length} characters</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('profile_image', e.target.files)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
                <p className="mt-1 text-sm text-gray-500">Upload a professional profile photo</p>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BriefcaseIcon className="h-5 w-5 mr-2" />
                    Skills & Experience
                </h3>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level *
                </label>
                <select
                    value={formData.experience_level}
                    onChange={(e) => handleInputChange('experience_level', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                        errors.experience_level ? 'border-red-300' : 'border-gray-300'
                    }`}
                >
                    <option value="">Select Experience Level</option>
                    {experienceLevels.map(level => (
                        <option key={level.key} value={level.key}>{level.label}</option>
                    ))}
                </select>
                {errors.experience_level && (
                    <p className="mt-1 text-sm text-red-600">{errors.experience_level}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills * {formData.skills.length > 0 && `(${formData.skills.length} selected)`}
                </label>
                <div className="space-y-3">
                    <select
                        onChange={(e) => {
                            if (e.target.value) {
                                handleArrayAdd('skills', e.target.value);
                                e.target.value = '';
                            }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Select from common skills</option>
                        {commonSkills.map(skill => (
                            <option key={skill} value={skill}>{skill}</option>
                        ))}
                    </select>

                    {formData.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                                >
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => handleArrayRemove('skills', index)}
                                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                {errors.skills && (
                    <p className="mt-1 text-sm text-red-600">{errors.skills}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages
                </label>
                <select
                    onChange={(e) => {
                        if (e.target.value) {
                            handleArrayAdd('languages', e.target.value);
                            e.target.value = '';
                        }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Add a language</option>
                    {availableLanguages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                    ))}
                </select>

                {formData.languages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {formData.languages.map((lang, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                            >
                                {lang}
                                <button
                                    type="button"
                                    onClick={() => handleArrayRemove('languages', index)}
                                    className="ml-2 text-green-600 hover:text-green-800"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio Images
                </label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange('portfolio_images', e.target.files)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                    Upload up to 10 images showcasing your work
                </p>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    Location & Pricing
                </h3>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                </label>
                <select
                    value={formData.location.city}
                    onChange={(e) => handleInputChange('location.city', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                        errors['location.city'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                >
                    <option value="">Select City</option>
                    {jordanianCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
                {errors['location.city'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['location.city']}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate (JOD) *
                </label>
                <div className="relative">
                    <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={formData.hourly_rate}
                        onChange={(e) => handleInputChange('hourly_rate', e.target.value)}
                        placeholder="25.00"
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                            errors.hourly_rate ? 'border-red-300' : 'border-gray-300'
                        }`}
                    />
                    <CurrencyDollarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {errors.hourly_rate && (
                    <p className="mt-1 text-sm text-red-600">{errors.hourly_rate}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability Status
                </label>
                <select
                    value={formData.availability_status}
                    onChange={(e) => handleInputChange('availability_status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="unavailable">Unavailable</option>
                </select>
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
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-md">
                    <div className="px-6 py-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {t('freelancerRegistration.title')}
                            </h1>
                            <p className="mt-2 text-lg text-gray-600">
                                {t('freelancerRegistration.subtitle')}
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
                                            Previous
                                        </button>
                                    )}
                                </div>
                                
                                <div className="flex space-x-3">
                                    <Link
                                        to="/"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                    
                                    {step < 3 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                                        >
                                            Next
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            {loading ? 'Creating...' : 'Create Profile'}
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

export default FreelancerRegistration;