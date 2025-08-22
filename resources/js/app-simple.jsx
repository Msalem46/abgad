import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Simple HomePage component without dependencies
const SimpleHomePage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Simple Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold text-gray-900">
                                🏪 Abjad Amaken
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                                Sign In
                            </button>
                            <button className="bg-indigo-600 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-indigo-700">
                                List Your Business
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Discover Amazing
                            <span className="text-yellow-400"> Local Businesses</span>
                            <br />
                            in Jordan
                        </h1>
                        <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
                            Find the best restaurants, cafes, shops, and services near you. 
                            Explore verified businesses with real customer reviews and detailed information.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <button className="px-8 py-4 bg-yellow-400 text-indigo-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors text-lg">
                                🔍 Start Exploring
                            </button>
                            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-indigo-900 transition-colors text-lg">
                                List Your Business
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">
                        Coming Soon: Full Store Directory
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="text-4xl mb-4">🍽️</div>
                            <h3 className="text-lg font-semibold mb-2">Restaurants</h3>
                            <p className="text-gray-600">Discover amazing local restaurants and cafes</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="text-4xl mb-4">🛍️</div>
                            <h3 className="text-lg font-semibold mb-2">Shopping</h3>
                            <p className="text-gray-600">Find the best shops and retail stores</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="text-4xl mb-4">🔧</div>
                            <h3 className="text-lg font-semibold mb-2">Services</h3>
                            <p className="text-gray-600">Connect with local service providers</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SimpleHomePage />} />
                <Route path="*" element={<SimpleHomePage />} />
            </Routes>
        </BrowserRouter>
    );
}

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
} else {
    console.error('Could not find app container');
}