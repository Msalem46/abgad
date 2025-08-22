<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->hasPermission('stores', 'create');
    }

    protected function prepareForValidation()
    {
        // Handle JSON fields that come as strings from FormData
        if ($this->has('location') && is_string($this->location)) {
            $this->merge([
                'location' => json_decode($this->location, true)
            ]);
        }
        
        if ($this->has('social_media') && is_string($this->social_media)) {
            $this->merge([
                'social_media' => json_decode($this->social_media, true)
            ]);
        }
        
        if ($this->has('operating_hours') && is_string($this->operating_hours)) {
            $this->merge([
                'operating_hours' => json_decode($this->operating_hours, true)
            ]);
        }
    }

    public function rules(): array
    {
        $storeId = $this->route('store')?->store_id;

        return [
            'trading_name' => 'required|string|max:255',
            'national_id' => [
                'required',
                'string',
                'size:13',
                'regex:/^[0-9]{13}$/',
                Rule::unique('stores')->ignore($storeId, 'store_id')
            ],
            'trading_license_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique('stores')->ignore($storeId, 'store_id')
            ],
            'commercial_registration_number' => 'nullable|string|max:50',
            'tax_number' => 'nullable|string|max:20',
            'municipality_license' => 'nullable|string|max:50',
            'health_permit' => 'nullable|string|max:50',
            'fire_safety_certificate' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
            'subcategory' => 'nullable|string|max:100',
            'established_date' => 'nullable|date|before_or_equal:today',
            'website' => 'nullable|url|max:255',
            'social_media' => 'nullable|array',
            'social_media.facebook' => 'nullable|url',
            'social_media.instagram' => 'nullable|url',
            'social_media.twitter' => 'nullable|url',
            'operating_hours' => 'nullable|array',
            'operating_hours.*.open' => 'nullable|date_format:H:i',
            'operating_hours.*.close' => 'nullable|date_format:H:i|after:operating_hours.*.open',
            
            // Location data validation
            'location' => 'nullable|array',
            'location.latitude' => 'required_with:location|numeric|between:-90,90',
            'location.longitude' => 'required_with:location|numeric|between:-180,180',
            'location.street_address' => 'required_with:location|string|max:255',
            'location.building_number' => 'nullable|string|max:10',
            'location.floor_number' => 'nullable|string|max:10',
            'location.apartment_unit' => 'nullable|string|max:10',
            'location.neighborhood' => 'nullable|string|max:100',
            'location.city' => 'required_with:location|string|max:100',
            'location.governorate' => 'required_with:location|string|max:100',
            'location.postal_code' => 'nullable|string|max:10',
            'location.landmarks' => 'nullable|string',
            'location.parking_availability' => 'nullable|boolean',
            'location.public_transport_access' => 'nullable|string',
            
            // Image upload validation
            'external_images' => 'nullable|array|max:10',
            'external_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240', // 10MB max
            'internal_images' => 'nullable|array|max:10',
            'internal_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240', // 10MB max
        ];
    }

    public function messages(): array
    {
        return [
            'national_id.size' => 'National ID must be exactly 13 digits.',
            'national_id.regex' => 'National ID must contain only numbers.',
            'national_id.unique' => 'This National ID is already registered.',
            'trading_license_number.unique' => 'This trading license number is already registered.',
            'operating_hours.*.close.after' => 'Closing time must be after opening time.',
            
            // Location validation messages
            'location.latitude.required_with' => 'Latitude is required when location is provided.',
            'location.longitude.required_with' => 'Longitude is required when location is provided.',
            'location.latitude.between' => 'Latitude must be between -90 and 90 degrees.',
            'location.longitude.between' => 'Longitude must be between -180 and 180 degrees.',
            'location.street_address.required_with' => 'Street address is required when location is provided.',
            'location.city.required_with' => 'City is required when location is provided.',
            'location.governorate.required_with' => 'Governorate is required when location is provided.',
            
            // Image validation messages
            'external_images.max' => 'Maximum 10 external images allowed.',
            'external_images.*.image' => 'All external images must be valid image files.',
            'external_images.*.mimes' => 'External images must be in JPEG, PNG, JPG, or GIF format.',
            'external_images.*.max' => 'Each external image must be less than 10MB.',
            'internal_images.max' => 'Maximum 10 internal images allowed.',
            'internal_images.*.image' => 'All internal images must be valid image files.',
            'internal_images.*.mimes' => 'Internal images must be in JPEG, PNG, JPG, or GIF format.',
            'internal_images.*.max' => 'Each internal image must be less than 10MB.',
        ];
    }
}
