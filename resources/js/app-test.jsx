import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Welcome to Abjad Amaken
                </h1>
                <p className="text-lg text-gray-600">
                    Your local business directory is loading...
                </p>
                <div className="mt-8">
                    <div className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg">
                        ✅ React App is Working!
                    </div>
                </div>
            </div>
        </div>
    );
}

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
} else {
    console.error('Could not find app container');
}