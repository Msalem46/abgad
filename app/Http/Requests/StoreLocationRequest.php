<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLocationRequest extends FormRequest
{
    public function authorize(): bool
    {
        $store = $this->route('store');
        return auth()->user()->can('update', $store);
    }

    public function rules(): array
    {
        return [
            'street_address' => 'required|string|max:255',
            'building_number' => 'nullable|string|max:10',
            'floor_number' => 'nullable|string|max:10',
            'apartment_unit' => 'nullable|string|max:10',
            'neighborhood' => 'nullable|string|max:100',
            'city' => 'required|string|max:100',
            'governorate' => 'required|string|max:100',
            'postal_code' => 'nullable|string|max:10',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'landmarks' => 'nullable|string',
            'parking_availability' => 'boolean',
            'public_transport_access' => 'nullable|string',
            'is_primary' => 'boolean'
        ];
    }
}
