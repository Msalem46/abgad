<?php
namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\StoreLocation;
use App\Models\StorePhoto;
use App\Http\Requests\StoreRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StoreController extends BaseController
{
    /**
     * Display a listing of stores accessible to the user
     */
    public function index(Request $request)
    {
        // For public access, show all active stores. For authenticated users, show accessible stores.
        if (auth()->check()) {
            $query = $this->getAccessibleStores();
        } else {
            // Public access - show all active stores
            $query = Store::where('is_active', true);
        }

        // Apply filters
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('city')) {
            $query->whereHas('primaryLocation', function ($q) use ($request) {
                $q->where('city', 'like', '%' . $request->city . '%');
            });
        }

        if ($request->filled('verified')) {
            $query->where('is_verified', $request->boolean('verified'));
        }

        if ($request->filled('search')) {
            $query->where('trading_name', 'like', '%' . $request->search . '%');
        }

        $stores = $query->with(['owner', 'primaryLocation', 'featuredPhotos'])
            ->latest()
            ->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($stores);
    }

    /**
     * Admin view of all stores
     */
    public function adminIndex(Request $request)
    {
        $query = Store::query();

        // Admin filters
        if ($request->filled('status')) {
            if ($request->status === 'pending') {
                $query->where('is_verified', false);
            } elseif ($request->status === 'verified') {
                $query->where('is_verified', true);
            }
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('trading_name', 'like', '%' . $request->search . '%')
                    ->orWhere('trading_license_number', 'like', '%' . $request->search . '%')
                    ->orWhere('national_id', 'like', '%' . $request->search . '%');
            });
        }

        $stores = $query->with(['owner', 'primaryLocation'])
            ->latest()
            ->paginate($request->get('per_page', 20));

        return $this->paginatedResponse($stores);
    }

    /**
     * Store a newly created store
     */
    public function store(StoreRequest $request)
    {
        $data = $request->validated();
        $data['owner_id'] = auth()->id();

        // Extract location and image data
        $locationData = $data['location'] ?? null;
        $externalImages = $request->file('external_images') ?? [];
        $internalImages = $request->file('internal_images') ?? [];
        
        // Remove location and images from main store data
        unset($data['location'], $data['external_images'], $data['internal_images']);

        // Create the store
        $store = Store::create($data);

        // Create store location if provided
        if ($locationData) {
            $locationData['store_id'] = $store->store_id;
            $locationData['is_primary'] = true;
            StoreLocation::create($locationData);
        }

        // Handle image uploads
        $this->handleImageUploads($store, $externalImages, 'exterior');
        $this->handleImageUploads($store, $internalImages, 'interior');

        // Load relationships for response
        $store->load(['owner', 'primaryLocation', 'activePhotos']);

        return $this->successResponse($store, 'Store created successfully!', 201);
    }

    /**
     * Display the specified store
     */
    public function show(Store $store)
    {
        // Load all necessary relationships
        $store->load([
            'owner:user_id,first_name,last_name,email',
            'primaryLocation',
            'activePhotos' => function ($query) {
                $query->orderBy('display_order')->limit(10);
            },
            'menuCategories.availableMenuItems' => function ($query) {
                $query->orderBy('display_order')->limit(20);
            }
        ]);

        // Add computed attributes
        $store->append(['is_open_now', 'today_operating_hours']);

        return $this->successResponse($store);
    }

    /**
     * Update the specified store
     */
    public function update(StoreRequest $request, Store $store)
    {
        $data = $request->validated();
        
        // Extract location and image data
        $locationData = $data['location'] ?? null;
        $externalImages = $request->file('external_images') ?? [];
        $internalImages = $request->file('internal_images') ?? [];
        
        // Remove location and images from main store data
        unset($data['location'], $data['external_images'], $data['internal_images']);
        
        // Update the store
        $store->update($data);

        // Update store location
        if ($locationData) {
            $location = $store->primaryLocation;
            if ($location) {
                $location->update($locationData);
            } else {
                $locationData['store_id'] = $store->store_id;
                $locationData['is_primary'] = true;
                StoreLocation::create($locationData);
            }
        }

        // Handle new image uploads
        if (!empty($externalImages)) {
            $this->handleImageUploads($store, $externalImages, 'exterior');
        }
        if (!empty($internalImages)) {
            $this->handleImageUploads($store, $internalImages, 'interior');
        }

        $store->load(['owner', 'primaryLocation', 'activePhotos']);

        return $this->successResponse($store, 'Store updated successfully!');
    }

    /**
     * Remove the specified store
     */
    public function destroy(Store $store)
    {
        $store->delete();
        return $this->successResponse(null, 'Store deleted successfully!');
    }

    /**
     * Verify a store (Admin only)
     */
    public function verify(Request $request, Store $store)
    {
        $request->validate([
            'is_verified' => 'required|boolean',
            'verification_notes' => 'nullable|string|max:1000'
        ]);

        $store->update([
            'is_verified' => $request->is_verified,
            'verification_date' => $request->is_verified ? now() : null,
            'verification_notes' => $request->verification_notes
        ]);

        $message = $request->is_verified ? 'Store verified successfully!' : 'Store verification revoked.';
        return $this->successResponse($store, $message);
    }

    /**
     * Get store statistics
     */
    public function statistics(Store $store)
    {
        $stats = [
            'total_visits' => $store->visits()->count(),
            'total_photos' => $store->activePhotos()->count(),
            'total_menu_items' => $store->availableMenuItems()->count(),
            'verification_status' => $store->is_verified,
            'monthly_visits' => $store->visits()
                ->where('visit_start', '>=', now()->subMonth())
                ->count(),
            'avg_duration' => $store->visits()
                ->whereNotNull('duration_seconds')
                ->avg('duration_seconds')
        ];

        return $this->successResponse($stats);
    }

    /**
     * Handle image uploads for a store
     */
    private function handleImageUploads(Store $store, array $images, string $type)
    {
        foreach ($images as $index => $image) {
            if ($image && $image->isValid()) {
                // Generate unique filename
                $filename = Str::random(40) . '.' . $image->getClientOriginalExtension();
                
                // Store the file
                $path = $image->storeAs('stores/' . $store->store_id . '/' . $type, $filename, 'public');
                
                // Create photo record
                StorePhoto::create([
                    'store_id' => $store->store_id,
                    'file_name' => $filename,
                    'file_path' => $path,
                    'file_size' => $image->getSize(),
                    'mime_type' => $image->getMimeType(),
                    'photo_type' => $type,
                    'title' => $image->getClientOriginalName(),
                    'alt_text' => ucfirst($type) . ' photo of ' . $store->trading_name,
                    'display_order' => $index,
                    'uploaded_by' => auth()->id(),
                    'is_active' => true,
                    'is_featured' => $index === 0, // First image is featured
                ]);
            }
        }
    }
}
