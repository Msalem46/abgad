import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/contexts/AuthContext';
import DashboardLayout from './components/Layout/DashboardLayout';
import DashboardHome from './components/Dashboard/DashboardHome';
import Login from './components/Auth/Login';
import StoreForm from './components/Stores/StoreForm';
import StoreList from './components/Stores/StoreList';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import PhotoGallery from './components/Gallery/PhotoGallery';
import MenuManagement from './components/Menu/MenuManagement';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />

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
                                </Routes>
                            </DashboardLayout>
                        </ProtectedRoute>
                    } />

                    {/* Redirect root to dashboard */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
            <ToastContainer position="top-right" autoClose={3000} />
        </AuthProvider>
    );
}

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
