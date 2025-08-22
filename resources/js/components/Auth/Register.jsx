import React, { useState, useContext, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'react-toastify';
import { 
    UserIcon,
    EyeIcon,
    EyeSlashIcon,
    EnvelopeIcon,
    PhoneIcon,
    AtSymbolIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const { user } = useContext(AuthContext);
    const { t, direction, language } = useLanguage();
    const navigate = useNavigate();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await api.post('/register', formData);
            
            if (response.data.success) {
                toast.success(language === 'ar' 
                    ? 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.'
                    : 'Account created successfully! You can now log in.'
                );
                navigate('/login');
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                toast.error(error.response?.data?.message || 
                    (language === 'ar' ? 'حدث خطأ أثناء إنشاء الحساب' : 'An error occurred while creating account')
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        let value = e.target.value;
        
        // For username, allow only letters, numbers, and underscores
        if (e.target.name === 'username') {
            value = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
        }
        
        setFormData(prev => ({
            ...prev,
            [e.target.name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors(prev => ({
                ...prev,
                [e.target.name]: undefined
            }));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50" dir={direction}>
            <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-6">
                            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
                                <UserIcon className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            {language === 'ar' ? 'إنشاء حساب جديد' : 'Create New Account'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {language === 'ar' 
                                ? 'انضم إلى منصة أبجد أماكن وابدأ رحلتك'
                                : 'Join Abjad Amaken platform and start your journey'
                            }
                        </p>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Name Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {language === 'ar' ? 'الاسم الأول' : 'First Name'} *
                                    </label>
                                    <input
                                        name="first_name"
                                        type="text"
                                        required
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                                            errors.first_name ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder={language === 'ar' ? 'أحمد' : 'John'}
                                    />
                                    {errors.first_name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.first_name[0]}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {language === 'ar' ? 'اسم العائلة' : 'Last Name'} *
                                    </label>
                                    <input
                                        name="last_name"
                                        type="text"
                                        required
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                                            errors.last_name ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder={language === 'ar' ? 'محمد' : 'Doe'}
                                    />
                                    {errors.last_name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.last_name[0]}</p>
                                    )}
                                </div>
                            </div>

                            {/* Username Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {language === 'ar' ? 'اسم المستخدم' : 'Username'} *
                                </label>
                                <div className="relative">
                                    <AtSymbolIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        name="username"
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                                            errors.username ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder={language === 'ar' ? 'اسم_المستخدم' : 'username123'}
                                    />
                                </div>
                                {errors.username && (
                                    <p className="mt-1 text-sm text-red-600">{errors.username[0]}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    {language === 'ar' 
                                        ? 'سيتم استخدامه لتسجيل الدخول (أحرف إنجليزية وأرقام فقط)'
                                        : 'Will be used for login (letters, numbers, and underscores only)'
                                    }
                                </p>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} *
                                </label>
                                <div className="relative">
                                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                                            errors.email ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder={language === 'ar' ? 'user@example.com' : 'user@example.com'}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
                                )}
                            </div>

                            {/* Phone Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                                </label>
                                <div className="relative">
                                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                                            errors.phone ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="+962 7X XXX XXXX"
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phone[0]}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {language === 'ar' ? 'كلمة المرور' : 'Password'} *
                                </label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors pr-10 ${
                                            errors.password ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter password'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
                                )}
                            </div>

                            {/* Password Confirmation Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'} *
                                </label>
                                <div className="relative">
                                    <input
                                        name="password_confirmation"
                                        type={showPasswordConfirm ? 'text' : 'password'}
                                        required
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors pr-10 ${
                                            errors.password_confirmation ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder={language === 'ar' ? 'أعد كتابة كلمة المرور' : 'Confirm password'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswordConfirm ? (
                                            <EyeSlashIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password_confirmation[0]}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            {language === 'ar' ? 'جاري الإنشاء...' : 'Creating...'}
                                        </div>
                                    ) : (
                                        language === 'ar' ? 'إنشاء الحساب' : 'Create Account'
                                    )}
                                </button>
                            </div>

                            {/* Login Link */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    {language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
                                    <Link
                                        to="/login"
                                        className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                                    >
                                        {language === 'ar' ? 'تسجيل الدخول' : 'Sign in'}
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Additional Info */}
                    <div className="text-center">
                        <div className="bg-white rounded-lg p-4 shadow-md">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">
                                {language === 'ar' ? 'بعد إنشاء الحساب يمكنك:' : 'After creating your account you can:'}
                            </h3>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li>{language === 'ar' ? '• التسجيل كمستقل وعرض خدماتك' : '• Register as a freelancer and offer services'}</li>
                                <li>{language === 'ar' ? '• تسجيل متجرك أو عملك التجاري' : '• Register your store or business'}</li>
                                <li>{language === 'ar' ? '• الوصول للوحة التحكم الخاصة بك' : '• Access your personal dashboard'}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;