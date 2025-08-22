import React, { useState, useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'react-toastify';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { user, login } = useContext(AuthContext);
    const { t, direction } = useLanguage();
    const location = useLocation();

    useEffect(() => {
        // Show success message if coming from registration
        const params = new URLSearchParams(location.search);
        if (params.get('registered') === 'true') {
            toast.success(t('auth.registrationSuccess'));
        }
    }, [location]);

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(formData);
            toast.success(t('auth.loginSuccess'));
        } catch (error) {
            toast.error(error.response?.data?.message || t('auth.loginFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50" dir={direction}>
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        🏪 Store Viewer Jordan
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {t('auth.login')}
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder={t('auth.email')}
                            />
                        </div>
                        <div>
                            <input
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder={t('auth.password')}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? t('common.loading') : t('auth.loginButton')}
                        </button>
                    </div>

                    <div className="text-sm text-center space-y-2">
                        <p className="text-gray-600 font-medium">Demo Credentials:</p>
                        <div className="bg-blue-50 p-3 rounded">
                            <p className="text-blue-800">Admin: admin@storeview.jo / password</p>
                            <p className="text-blue-800">Store Owner: owner@storeview.jo / password</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
