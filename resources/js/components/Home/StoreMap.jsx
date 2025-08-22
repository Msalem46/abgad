import React, { useEffect, useRef, useState } from 'react';
import { 
    MapPinIcon, 
    BuildingStorefrontIcon,
    XMarkIcon,
    StarIcon,
    PhoneIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const StoreMap = ({ stores }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const [selectedStore, setSelectedStore] = useState(null);

    useEffect(() => {
        // Load Leaflet if not already loaded
        if (!window.L) {
            loadLeaflet();
        } else {
            initializeMap();
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (mapInstanceRef.current && stores.length > 0) {
            updateMarkers();
        }
    }, [stores]);

    const loadLeaflet = () => {
        // Add Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Add Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initializeMap;
        document.head.appendChild(script);
    };

    const initializeMap = () => {
        if (mapRef.current && !mapInstanceRef.current) {
            // Initialize map centered on Amman, Jordan
            mapInstanceRef.current = window.L.map(mapRef.current, {
                center: [31.9454, 35.9284],
                zoom: 11,
                zoomControl: true,
            });

            // Add OpenStreetMap tiles
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(mapInstanceRef.current);

            // Update markers if stores are available
            if (stores.length > 0) {
                updateMarkers();
            }
        }
    };

    const updateMarkers = () => {
        if (!mapInstanceRef.current) return;

        // Clear existing markers
        markersRef.current.forEach(marker => {
            mapInstanceRef.current.removeLayer(marker);
        });
        markersRef.current = [];

        // Create custom icon
        const createCustomIcon = (category, isOpen) => {
            const iconColor = isOpen ? '#10B981' : '#EF4444'; // green if open, red if closed
            const categoryEmoji = getCategoryEmoji(category);
            
            return window.L.divIcon({
                html: `
                    <div class="relative">
                        <div class="w-10 h-10 bg-white rounded-full shadow-lg border-2 flex items-center justify-center" style="border-color: ${iconColor}">
                            <span class="text-lg">${categoryEmoji}</span>
                        </div>
                        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent" style="border-top-color: ${iconColor}"></div>
                    </div>
                `,
                className: 'custom-marker',
                iconSize: [40, 50],
                iconAnchor: [20, 45],
                popupAnchor: [0, -45]
            });
        };

        const bounds = [];

        // Add markers for each store
        stores.forEach(store => {
            if (!store.primary_location?.latitude || !store.primary_location?.longitude) {
                return;
            }

            const lat = parseFloat(store.primary_location.latitude);
            const lng = parseFloat(store.primary_location.longitude);
            
            if (isNaN(lat) || isNaN(lng)) return;

            bounds.push([lat, lng]);

            const marker = window.L.marker([lat, lng], {
                icon: createCustomIcon(store.category, store.is_open_now)
            });

            // Create popup content
            const popupContent = createPopupContent(store);
            marker.bindPopup(popupContent, {
                maxWidth: 300,
                className: 'custom-popup'
            });

            // Handle marker click
            marker.on('click', () => {
                setSelectedStore(store);
            });

            marker.addTo(mapInstanceRef.current);
            markersRef.current.push(marker);
        });

        // Fit map to show all markers
        if (bounds.length > 0) {
            mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] });
        }
    };

    const getCategoryEmoji = (category) => {
        const categoryEmojis = {
            'Restaurant': '🍽️',
            'Cafe': '☕',
            'Shop': '🛍️',
            'Service': '🔧',
            'Healthcare': '🏥',
            'Automotive': '🚗',
            'Beauty & Wellness': '💆',
            'Education': '📚',
            'Other': '🏢'
        };
        return categoryEmojis[category] || '🏢';
    };

    const createPopupContent = (store) => {
        const featuredPhoto = store.featured_photos?.[0] || store.active_photos?.[0];
        const imageUrl = featuredPhoto 
            ? `/storage/${featuredPhoto.file_path}` 
            : '/images/store-placeholder.svg';

        return `
            <div class="store-popup">
                <div class="mb-3">
                    <img src="${imageUrl}" alt="${store.trading_name}" class="w-full h-24 object-cover rounded-lg" onerror="this.src='/images/store-placeholder.svg'" />
                </div>
                <div class="mb-2">
                    <h3 class="font-semibold text-gray-900 text-sm mb-1">${store.trading_name}</h3>
                    <div class="flex items-center mb-1">
                        <span class="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">${store.category}</span>
                        ${store.is_verified ? '<span class="ml-1 text-blue-500">✓</span>' : ''}
                    </div>
                </div>
                <div class="space-y-1 mb-3">
                    ${store.primary_location ? `
                        <div class="flex items-center text-xs text-gray-600">
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            ${store.primary_location.city}
                        </div>
                    ` : ''}
                    <div class="flex items-center text-xs text-gray-600">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="${store.is_open_now ? 'text-green-600' : 'text-red-600'}">${store.is_open_now ? 'Open' : 'Closed'}</span>
                    </div>
                </div>
                <button onclick="window.openStoreDetail('${store.store_id}')" class="w-full bg-indigo-600 text-white text-xs py-2 px-3 rounded-lg hover:bg-indigo-700 transition-colors">
                    View Details
                </button>
            </div>
        `;
    };

    // Make the openStoreDetail function globally available
    useEffect(() => {
        window.openStoreDetail = (storeId) => {
            const store = stores.find(s => s.store_id.toString() === storeId);
            if (store) {
                setSelectedStore(store);
            }
        };

        return () => {
            delete window.openStoreDetail;
        };
    }, [stores]);

    const renderStars = (rating = 4.5) => {
        const stars = [];
        const fullStars = Math.floor(rating);

        for (let i = 0; i < 5; i++) {
            stars.push(
                <StarSolidIcon 
                    key={i} 
                    className={`h-4 w-4 ${i < fullStars ? 'text-yellow-400' : 'text-gray-300'}`} 
                />
            );
        }
        return stars;
    };

    return (
        <div className="relative">
            {/* Map Container */}
            <div 
                ref={mapRef}
                className="w-full h-96 md:h-[500px] lg:h-[600px] rounded-lg shadow-lg"
            />

            {/* Store Detail Sidebar */}
            {selectedStore && (
                <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[calc(100%-2rem)] overflow-y-auto z-[1000]">
                    {/* Header */}
                    <div className="flex justify-between items-start p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {selectedStore.trading_name}
                        </h3>
                        <button
                            onClick={() => setSelectedStore(null)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        {/* Image */}
                        {selectedStore.featured_photos?.[0] && (
                            <div className="mb-4">
                                <img
                                    src={`/storage/${selectedStore.featured_photos[0].file_path}`}
                                    alt={selectedStore.trading_name}
                                    className="w-full h-32 object-cover rounded-lg"
                                    onError={(e) => {
                                        e.target.src = '/images/store-placeholder.jpg';
                                    }}
                                />
                            </div>
                        )}

                        {/* Basic Info */}
                        <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {selectedStore.category}
                                </span>
                                <div className="flex items-center">
                                    {renderStars(4.5)}
                                    <span className="ml-1 text-sm text-gray-600">4.5</span>
                                </div>
                            </div>

                            {selectedStore.description && (
                                <p className="text-sm text-gray-600">
                                    {selectedStore.description}
                                </p>
                            )}

                            {/* Location */}
                            {selectedStore.primary_location && (
                                <div className="flex items-start">
                                    <MapPinIcon className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-600">
                                        {selectedStore.primary_location.street_address && `${selectedStore.primary_location.street_address}, `}
                                        {selectedStore.primary_location.neighborhood && `${selectedStore.primary_location.neighborhood}, `}
                                        {selectedStore.primary_location.city}
                                    </span>
                                </div>
                            )}

                            {/* Hours */}
                            <div className="flex items-center">
                                <ClockIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                                <span className={`text-sm font-medium ${selectedStore.is_open_now ? 'text-green-600' : 'text-red-600'}`}>
                                    {selectedStore.is_open_now ? 'Open Now' : 'Closed'}
                                </span>
                            </div>

                            {/* Contact */}
                            {selectedStore.phone && (
                                <div className="flex items-center">
                                    <PhoneIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                                    <a 
                                        href={`tel:${selectedStore.phone}`}
                                        className="text-sm text-indigo-600 hover:text-indigo-700"
                                    >
                                        {selectedStore.phone}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                                Get Directions
                            </button>
                            <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                                View Full Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Map Controls/Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
                <div className="text-xs font-medium text-gray-900 mb-2">Legend</div>
                <div className="space-y-1">
                    <div className="flex items-center text-xs">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span>Open</span>
                    </div>
                    <div className="flex items-center text-xs">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span>Closed</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreMap;