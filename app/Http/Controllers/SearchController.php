<?php
namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;

class SearchController extends BaseController
{
    /**
     * Search stores with various filters
     */
    public function stores(Request $request)
    {
        $request->validate([
            'q' => 'nullable|string|max:255',
            'category' => 'nullable|string',
            'city' => 'nullable|string',
            'governorate' => 'nullable|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'radius' => 'nullable|numeric|min:0.1|max:50', // km
            'sort' => 'nullable|in:name,distance,rating,newest',
            'per_page' => 'nullable|integer|min:1|max:50'
        ]);

        $query = Store::query()
            ->where('is_active', true)
            ->where('is_verified', true)
            ->with(['primaryLocation', 'featuredPhotos']);

        // Text search
        if ($request->filled('q')) {
            $searchTerm = $request->q;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('trading_name', 'like', "%$searchTerm%")
                    ->orWhere('description', 'like', "%$searchTerm%")
                    ->orWhere('category', 'like', "%$searchTerm%");
            });
        }

        // Category filter
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Location filters
        if ($request->filled('city')) {
            $query->whereHas('primaryLocation', function ($q) use ($request) {
                $q->where('city', 'like', '%' . $request->city . '%');
            });
        }

        if ($request->filled('governorate')) {
            $query->whereHas('primaryLocation', function ($q) use ($request) {
                $q->where('governorate', 'like', '%' . $request->governorate . '%');
            });
        }

        // Distance-based search
        if ($request->filled(['latitude', 'longitude'])) {
            $lat = $request->latitude;
            $lng = $request->longitude;
            $radius = $request->get('radius', 10); // Default 10km

            $query->whereHas('primaryLocation', function ($q) use ($lat, $lng, $radius) {
                $q->selectRaw("
                    *, (
                        6371 * acos(
                            cos(radians(?)) * cos(radians(latitude)) *
                            cos(radians(longitude) - radians(?)) +
                            sin(radians(?)) * sin(radians(latitude))
                        )
                    ) AS distance
                ", [$lat, $lng, $lat])
                    ->havingRaw('distance < ?', [$radius]);
            });
        }

        // Sorting
        switch ($request->get('sort', 'name')) {
            case 'newest':
                $query->latest('created_at');
                break;
            case 'name':
            default:
                $query->orderBy('trading_name');
                break;
        }

        $stores = $query->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($stores);
    }

    /**
     * Get search suggestions
     */
    public function suggestions(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:2|max:100'
        ]);

        $term = $request->q;

        $suggestions = [
            'stores' => Store::where('is_active', true)
                ->where('is_verified', true)
                ->where('trading_name', 'like', "%$term%")
                ->limit(5)
                ->get(['store_id', 'trading_name', 'category']),

            'categories' => Store::where('is_active', true)
                ->where('is_verified', true)
                ->where('category', 'like', "%$term%")
                ->distinct()
                ->limit(5)
                ->pluck('category'),

            'cities' => Store::whereHas('primaryLocation', function ($q) use ($term) {
                $q->where('city', 'like', "%$term%");
            })
                ->where('is_active', true)
                ->where('is_verified', true)
                ->with('primaryLocation:store_id,city')
                ->limit(5)
                ->get()
                ->pluck('primaryLocation.city')
                ->unique()
                ->values()
        ];

        return $this->successResponse($suggestions);
    }
}
