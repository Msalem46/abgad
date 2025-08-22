<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        $store = $this->route('store');
        return auth()->user()->can('update', $store) || auth()->user()->can('create', 'menu');
    }

    public function rules(): array
    {
        return [
            'category_id' => 'nullable|exists:menu_categories,category_id',
            'item_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0|max:999999.999',
            'currency' => 'string|size:3|in:JOD,USD,EUR',
            'is_available' => 'boolean',
            'is_featured' => 'boolean',
            'preparation_time' => 'nullable|integer|min:1|max:999',
            'is_vegetarian' => 'boolean',
            'is_vegan' => 'boolean',
            'is_halal' => 'boolean',
            'allergens' => 'nullable|array',
            'allergens.*' => 'string|max:100',
            'display_order' => 'integer|min:0',
            'image_url' => 'nullable|url|max:500'
        ];
    }

    public function messages(): array
    {
        return [
            'currency.in' => 'Currency must be one of: JOD, USD, EUR',
            'preparation_time.max' => 'Preparation time cannot exceed 999 minutes.',
        ];
    }
}
