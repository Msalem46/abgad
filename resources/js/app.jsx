import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import DashboardLayout from './components/Layout/DashboardLayout';
import PublicLayout from './components/Layout/PublicLayout';
import DashboardHome from './components/Dashboard/DashboardHome';
import HomePage from './components/Home/NewHomePage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PublicStoreRegistration from './components/Public/PublicStoreRegistration';
import FreelancersPage from './components/Freelancers/FreelancersPage';
import FreelancerRegistration from './components/Freelancers/FreelancerRegistration';
import TourismProviderRegistration from './components/Tourism/TourismProviderRegistration';
import TourismPage from './components/Tourism/TourismPage';
import TourDetailsPage from './components/Tourism/TourDetailsPage';
import ServicesPage from './components/Services/ServicesPage';
import ServiceDetailsPage from './components/Services/ServiceDetailsPage';
import StoreDetailsPage from './components/Stores/StoreDetailsPage';
import FreelancerProfilePage from './components/Freelancers/FreelancerProfilePage';
import StoresPage from './components/Stores/StoresPage';
import StoreForm from './components/Stores/StoreForm';
import StoreList from './components/Stores/StoreList';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import PhotoGallery from './components/Gallery/PhotoGallery';
import MenuManagement from './components/Menu/MenuManagement';
import AdminStoreList from './components/Admin/AdminStoreList';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <LanguageProvider>
            <AuthProvider>
                <BrowserRouter>
                <Routes>
                    {/* Public home page */}
                    <Route path="/" element={
                        <PublicLayout>
                            <HomePage />
                        </PublicLayout>
                    } />

                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/register-store" element={<PublicStoreRegistration />} />
                    <Route path="/register-freelancer" element={<FreelancerRegistration />} />
                    <Route path="/register-tourism" element={<TourismProviderRegistration />} />
                    <Route path="/stores" element={
                        <PublicLayout>
                            <StoresPage />
                        </PublicLayout>
                    } />
                    <Route path="/freelancers" element={
                        <PublicLayout>
                            <FreelancersPage />
                        </PublicLayout>
                    } />
                    <Route path="/services" element={
                        <PublicLayout>
                            <ServicesPage />
                        </PublicLayout>
                    } />
                    <Route path="/service/:id" element={
                        <PublicLayout>
                            <ServiceDetailsPage />
                        </PublicLayout>
                    } />
                    <Route path="/tourism" element={
                        <PublicLayout>
                            <TourismPage />
                        </PublicLayout>
                    } />
                    <Route path="/tour/:id" element={
                        <PublicLayout>
                            <TourDetailsPage />
                        </PublicLayout>
                    } />
                    <Route path="/store/:id" element={
                        <PublicLayout>
                            <StoreDetailsPage />
                        </PublicLayout>
                    } />
                    <Route path="/freelancer/:id" element={
                        <PublicLayout>
                            <FreelancerProfilePage />
                        </PublicLayout>
                    } />

                    {/* Protected dashboard routes */}
                    <Route path="/dashboard/*" element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <Routes>
                                    <Route index element={<DashboardHome />} />
                                    <Route path="stores" element={<StoreList />} />
                                    <Route path="stores/create" element={<StoreForm />} />
                                    <Route path="stores/:id/edit" element={<StoreForm />} />
                                    <Route path="stores/:id/gallery" element={<PhotoGallery />} />
                                    <Route path="stores/:id/menu" element={<MenuManagement />} />
                                    <Route path="analytics" element={<AnalyticsDashboard />} />
                                    <Route path="admin/stores" element={<AdminStoreList />} />
                                </Routes>
                            </DashboardLayout>
                        </ProtectedRoute>
                    } />

                </Routes>
                </BrowserRouter>
                <ToastContainer position="top-right" autoClose={3000} />
            </AuthProvider>
        </LanguageProvider>
    );
}

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
