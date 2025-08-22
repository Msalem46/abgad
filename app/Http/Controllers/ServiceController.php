<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Freelancer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ServiceController extends Controller
{
    /**
     * Display a listing of services (public)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Service::with(['freelancer.user'])
            ->verified()
            ->active()
            ->available();

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $query->search($request->search);
        }

        // Category filter
        if ($request->has('category') && !empty($request->category)) {
            $query->byCategory($request->category);
        }

        // Price range filter
        if ($request->has('min_price') || $request->has('max_price')) {
            $query->byPriceRange(
                $request->get('min_price'),
                $request->get('max_price')
            );
        }

        // Service type filter
        if ($request->has('service_type') && !empty($request->service_type)) {
            $query->where('service_type', $request->service_type);
        }

        // Delivery days filter
        if ($request->has('max_delivery_days') && is_numeric($request->max_delivery_days)) {
            $query->where('delivery_days', '<=', $request->max_delivery_days);
        }

        // Freelancer location filter
        if ($request->has('location') && !empty($request->location)) {
            $query->whereHas('freelancer', function ($q) use ($request) {
                $q->whereJsonContains('location->city', $request->location);
            });
        }

        // Rating filter
        if ($request->has('min_rating') && is_numeric($request->min_rating)) {
            $query->where('rating', '>=', $request->min_rating);
        }

        // Featured filter
        if ($request->has('featured') && $request->featured == 'true') {
            $query->featured();
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        $allowedSortFields = ['created_at', 'rating', 'base_price', 'delivery_days', 'orders', 'views'];
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Default ordering by featured and rating
        $query->orderBy('featured', 'desc')
              ->orderBy('rating', 'desc');

        // Pagination
        $perPage = min($request->get('per_page', 12), 50);
        $services = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $services->items(),
            'pagination' => [
                'current_page' => $services->currentPage(),
                'per_page' => $services->perPage(),
                'total' => $services->total(),
                'last_page' => $services->lastPage(),
                'from' => $services->firstItem(),
                'to' => $services->lastItem()
            ]
        ]);
    }

    /**
     * Store a newly created service
     */
    public function store(Request $request): JsonResponse
    {
        $user = auth()->user();
        $freelancer = $user->freelancer;

        if (!$freelancer) {
            return response()->json([
                'success' => false,
                'message' => 'You need to create a freelancer profile first'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:150',
            'description' => 'required|string|max:5000',
            'category' => 'required|string|max:50',
            'subcategory' => 'nullable|string|max:50',
            'tags' => 'nullable|array|max:10',
            'tags.*' => 'string|max:30',
            'base_price' => 'required|numeric|min:1|max:99999.99',
            'price_type' => 'required|in:fixed,hourly,per_project',
            'delivery_days' => 'required|integer|min:1|max:365',
            'service_packages' => 'nullable|array|max:3',
            'service_packages.*.name' => 'required_with:service_packages|string|max:50',
            'service_packages.*.price' => 'required_with:service_packages|numeric|min:1',
            'service_packages.*.description' => 'nullable|string|max:500',
            'service_packages.*.delivery_days' => 'required_with:service_packages|integer|min:1',
            'requirements' => 'nullable|array|max:10',
            'requirements.*' => 'string|max:200',
            'deliverables' => 'nullable|array|max:10',
            'deliverables.*' => 'string|max:200',
            'add_ons' => 'nullable|array|max:5',
            'add_ons.*.name' => 'required_with:add_ons|string|max:100',
            'add_ons.*.price' => 'required_with:add_ons|numeric|min:1',
            'add_ons.*.description' => 'nullable|string|max:300',
            'service_type' => 'required|in:remote,onsite,hybrid',
            'location_restrictions' => 'nullable|array',
            'max_revisions' => 'required|integer|min:0|max:10',
            'faq' => 'nullable|string|max:2000',
            'skills_required' => 'nullable|array|max:10',
            'skills_required.*' => 'string|max:50',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'portfolio_images' => 'nullable|array|max:10',
            'portfolio_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();
            $data['freelancer_id'] = $freelancer->freelancer_id;

            // Handle featured image upload
            if ($request->hasFile('featured_image')) {
                $path = $request->file('featured_image')->store('services/featured', 'public');
                $data['featured_image'] = $path;
            }

            // Handle portfolio images upload
            if ($request->hasFile('portfolio_images')) {
                $portfolioImages = [];
                foreach ($request->file('portfolio_images') as $image) {
                    $path = $image->store('services/portfolio', 'public');
                    $portfolioImages[] = $path;
                }
                $data['portfolio_images'] = $portfolioImages;
            }

            $service = Service::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Service created successfully',
                'data' => $service->load('freelancer.user')
            ], 201);

        } catch (\Exception $e) {
            // Clean up uploaded files if there was an error
            if (isset($data['featured_image']) && Storage::disk('public')->exists($data['featured_image'])) {
                Storage::disk('public')->delete($data['featured_image']);
            }
            if (isset($data['portfolio_images'])) {
                foreach ($data['portfolio_images'] as $image) {
                    if (Storage::disk('public')->exists($image)) {
                        Storage::disk('public')->delete($image);
                    }
                }
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to create service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified service
     */
    public function show(Service $service): JsonResponse
    {
        // Load related data
        $service->load([
            'freelancer.user'
        ]);

        // Increment view count (if not the owner)
        if (!auth()->check() || auth()->id() !== $service->freelancer->user_id) {
            $service->incrementViews();
        }

        return response()->json([
            'success' => true,
            'data' => $service
        ]);
    }

    /**
     * Update the specified service
     */
    public function update(Request $request, Service $service): JsonResponse
    {
        // Check if user owns this service
        if (auth()->id() !== $service->freelancer->user_id && !auth()->user()->hasRole('admin')) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:150',
            'description' => 'sometimes|required|string|max:5000',
            'category' => 'sometimes|required|string|max:50',
            'subcategory' => 'nullable|string|max:50',
            'tags' => 'nullable|array|max:10',
            'tags.*' => 'string|max:30',
            'base_price' => 'sometimes|required|numeric|min:1|max:99999.99',
            'price_type' => 'sometimes|required|in:fixed,hourly,per_project',
            'delivery_days' => 'sometimes|required|integer|min:1|max:365',
            'service_packages' => 'nullable|array|max:3',
            'requirements' => 'nullable|array|max:10',
            'requirements.*' => 'string|max:200',
            'deliverables' => 'nullable|array|max:10',
            'deliverables.*' => 'string|max:200',
            'add_ons' => 'nullable|array|max:5',
            'service_type' => 'sometimes|required|in:remote,onsite,hybrid',
            'location_restrictions' => 'nullable|array',
            'max_revisions' => 'sometimes|required|integer|min:0|max:10',
            'faq' => 'nullable|string|max:2000',
            'skills_required' => 'nullable|array|max:10',
            'skills_required.*' => 'string|max:50',
            'is_active' => 'sometimes|boolean',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'portfolio_images' => 'nullable|array|max:10',
            'portfolio_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();

            // Handle featured image upload
            if ($request->hasFile('featured_image')) {
                // Delete old image
                if ($service->featured_image && Storage::disk('public')->exists($service->featured_image)) {
                    Storage::disk('public')->delete($service->featured_image);
                }
                
                $path = $request->file('featured_image')->store('services/featured', 'public');
                $data['featured_image'] = $path;
            }

            // Handle portfolio images upload
            if ($request->hasFile('portfolio_images')) {
                // Delete old portfolio images
                if ($service->portfolio_images) {
                    foreach ($service->portfolio_images as $image) {
                        if (Storage::disk('public')->exists($image)) {
                            Storage::disk('public')->delete($image);
                        }
                    }
                }

                $portfolioImages = [];
                foreach ($request->file('portfolio_images') as $image) {
                    $path = $image->store('services/portfolio', 'public');
                    $portfolioImages[] = $path;
                }
                $data['portfolio_images'] = $portfolioImages;
            }

            $service->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Service updated successfully',
                'data' => $service->fresh()->load('freelancer.user')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified service
     */
    public function destroy(Service $service): JsonResponse
    {
        // Check if user owns this service
        if (auth()->id() !== $service->freelancer->user_id && !auth()->user()->hasRole('admin')) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            // Delete associated images
            if ($service->featured_image && Storage::disk('public')->exists($service->featured_image)) {
                Storage::disk('public')->delete($service->featured_image);
            }

            if ($service->portfolio_images) {
                foreach ($service->portfolio_images as $image) {
                    if (Storage::disk('public')->exists($image)) {
                        Storage::disk('public')->delete($image);
                    }
                }
            }

            $service->delete();

            return response()->json([
                'success' => true,
                'message' => 'Service deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get services by freelancer
     */
    public function getFreelancerServices(Freelancer $freelancer, Request $request): JsonResponse
    {
        $query = $freelancer->services();

        // If not the owner or admin, only show verified active services
        if (!auth()->check() || 
            (auth()->id() !== $freelancer->user_id && !auth()->user()->hasRole('admin'))) {
            $query->verified()->active();
        }

        $services = $query->orderBy('featured', 'desc')
                          ->orderBy('rating', 'desc')
                          ->orderBy('created_at', 'desc')
                          ->paginate(12);

        return response()->json([
            'success' => true,
            'data' => $services->items(),
            'pagination' => [
                'current_page' => $services->currentPage(),
                'per_page' => $services->perPage(),
                'total' => $services->total(),
                'last_page' => $services->lastPage()
            ]
        ]);
    }

    /**
     * Get current user's services
     */
    public function myServices(Request $request): JsonResponse
    {
        $user = auth()->user();
        $freelancer = $user->freelancer;

        if (!$freelancer) {
            return response()->json([
                'success' => false,
                'message' => 'No freelancer profile found'
            ], 404);
        }

        $query = $freelancer->services();

        // Filter by status
        if ($request->has('status')) {
            switch ($request->status) {
                case 'active':
                    $query->active();
                    break;
                case 'inactive':
                    $query->where('is_active', false);
                    break;
                case 'verified':
                    $query->verified();
                    break;
                case 'pending':
                    $query->where('is_verified', false);
                    break;
            }
        }

        $services = $query->orderBy('created_at', 'desc')->paginate(12);

        return response()->json([
            'success' => true,
            'data' => $services->items(),
            'pagination' => [
                'current_page' => $services->currentPage(),
                'per_page' => $services->perPage(),
                'total' => $services->total(),
                'last_page' => $services->lastPage()
            ]
        ]);
    }

    /**
     * Get service categories
     */
    public function getCategories(): JsonResponse
    {
        $categories = [
            'web_development' => 'Web Development',
            'mobile_development' => 'Mobile Development',
            'graphic_design' => 'Graphic Design',
            'writing_translation' => 'Writing & Translation',
            'digital_marketing' => 'Digital Marketing',
            'video_animation' => 'Video & Animation',
            'music_audio' => 'Music & Audio',
            'programming_tech' => 'Programming & Tech',
            'business' => 'Business',
            'lifestyle' => 'Lifestyle',
            'photography' => 'Photography',
            'consulting' => 'Consulting',
            'education' => 'Education & Training',
            'other' => 'Other'
        ];

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }
}