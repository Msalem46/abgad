import React, { useEffect, useRef, useState } from 'react';

const LocationPicker = ({ onLocationSelect, initialPosition = { lat: 31.9454, lng: 35.9284 } }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const [selectedLocation, setSelectedLocation] = useState(initialPosition);

    useEffect(() => {
        // Load Leaflet CSS and JS if not already loaded
        if (!window.L) {
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

    const initializeMap = () => {
        if (mapRef.current && !mapInstanceRef.current) {
            // Initialize map centered on Amman, Jordan
            mapInstanceRef.current = window.L.map(mapRef.current, {
                center: [selectedLocation.lat, selectedLocation.lng],
                zoom: 13,
                zoomControl: true,
                scrollWheelZoom: true,
            });

            // Add OpenStreetMap tiles
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(mapInstanceRef.current);

            // Add initial marker
            markerRef.current = window.L.marker([selectedLocation.lat, selectedLocation.lng], {
                draggable: true
            }).addTo(mapInstanceRef.current);

            // Handle marker drag
            markerRef.current.on('dragend', (e) => {
                const { lat, lng } = e.target.getLatLng();
                const newLocation = { lat, lng };
                setSelectedLocation(newLocation);
                onLocationSelect(newLocation);
            });

            // Handle map click
            mapInstanceRef.current.on('click', (e) => {
                const { lat, lng } = e.latlng;
                const newLocation = { lat, lng };
                
                // Update marker position
                markerRef.current.setLatLng([lat, lng]);
                setSelectedLocation(newLocation);
                onLocationSelect(newLocation);
            });
        }
    };

    const handleAddressSearch = async (address) => {
        if (!address.trim()) return;

        try {
            // Use Nominatim for geocoding
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', Jordan')}&limit=1`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const newLocation = { lat: parseFloat(lat), lng: parseFloat(lon) };
                
                // Update map view and marker
                if (mapInstanceRef.current && markerRef.current) {
                    mapInstanceRef.current.setView([newLocation.lat, newLocation.lng], 15);
                    markerRef.current.setLatLng([newLocation.lat, newLocation.lng]);
                    setSelectedLocation(newLocation);
                    onLocationSelect(newLocation);
                }
            }
        } catch (error) {
            console.error('Address search failed:', error);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Location *
                </label>
                <p className="text-xs text-gray-500 mb-3">
                    Click on the map or drag the marker to select your store location
                </p>
                
                {/* Address Search */}
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Search for address (e.g., Downtown Amman, Jordan)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddressSearch(e.target.value);
                            }
                        }}
                    />
                </div>
            </div>

            {/* Map Container */}
            <div 
                ref={mapRef} 
                className="w-full h-80 border border-gray-300 rounded-md"
                style={{ minHeight: '320px' }}
            />

            {/* Selected Coordinates Display */}
            <div className="text-sm text-gray-600">
                <p><strong>Selected Location:</strong></p>
                <p>Latitude: {selectedLocation.lat.toFixed(6)}</p>
                <p>Longitude: {selectedLocation.lng.toFixed(6)}</p>
            </div>
        </div>
    );
};

export default LocationPicker;