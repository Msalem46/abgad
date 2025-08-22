<?php

namespace App\Http\Controllers;

use App\Models\Freelancer;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class FreelancerController extends Controller
{
    /**
     * Display a listing of freelancers (public)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Freelancer::with('user')
            ->verified()
            ->active();

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('professional_title', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('bio', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('skills', 'LIKE', "%{$searchTerm}%")
                  ->orWhereHas('user', function ($userQuery) use ($searchTerm) {
                      $userQuery->where('first_name', 'LIKE', "%{$searchTerm}%")
                               ->orWhere('last_name', 'LIKE', "%{$searchTerm}%");
                  });
            });
        }

        // Category filter
        if ($request->has('category') && !empty($request->category)) {
            $query->whereJsonContains('categories', $request->category);
        }

        // Experience level filter
        if ($request->has('experience_level') && !empty($request->experience_level)) {
            $query->where('experience_level', $request->experience_level);
        }

        // Availability filter
        if ($request->has('availability') && !empty($request->availability)) {
            $query->where('availability_status', $request->availability);
        }

        // Location filter
        if ($request->has('location') && !empty($request->location)) {
            $query->whereJsonContains('location->city', $request->location);
        }

        // Rating filter
        if ($request->has('min_rating') && is_numeric($request->min_rating)) {
            $query->where('rating', '>=', $request->min_rating);
        }

        // Hourly rate filter
        if ($request->has('min_rate') && is_numeric($request->min_rate)) {
            $query->where('hourly_rate', '>=', $request->min_rate);
        }
        if ($request->has('max_rate') && is_numeric($request->max_rate)) {
            $query->where('hourly_rate', '<=', $request->max_rate);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        $allowedSortFields = ['created_at', 'rating', 'completed_projects', 'hourly_rate', 'professional_title'];
        if (in_array($sortBy, $allowedSortFields)) {
            if ($sortBy === 'professional_title') {
                $query->orderBy('professional_title', $sortOrder);
            } else {
                $query->orderBy($sortBy, $sortOrder);
            }
        }

        // Pagination
        $perPage = min($request->get('per_page', 12), 50);
        $freelancers = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $freelancers->items(),
            'pagination' => [
                'current_page' => $freelancers->currentPage(),
                'per_page' => $freelancers->perPage(),
                'total' => $freelancers->total(),
                'last_page' => $freelancers->lastPage(),
                'from' => $freelancers->firstItem(),
                'to' => $freelancers->lastItem()
            ]
        ]);
    }

    /**
     * Store a newly created freelancer profile
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'professional_title' => 'required|string|max:100',
            'bio' => 'nullable|string|max:1000',
            'skills' => 'required|array|min:1',
            'skills.*' => 'string|max:50',
            'categories' => 'required|array|min:1',
            'categories.*' => 'string|max:50',
            'hourly_rate' => 'nullable|numeric|min:0|max:9999.99',
            'languages' => 'nullable|array',
            'languages.*' => 'string|max:50',
            'experience_level' => 'required|in:beginner,intermediate,expert',
            'years_experience' => 'required|integer|min:0|max:50',
            'portfolio_description' => 'nullable|string|max:2000',
            'certifications' => 'nullable|array',
            'education' => 'nullable|array',
            'work_preferences' => 'nullable|array',
            'phone' => 'nullable|string|max:20',
            'website' => 'nullable|url|max:255',
            'social_media' => 'nullable|array',
            'location' => 'nullable|array',
            'location.city' => 'nullable|string|max:100',
            'location.governorate' => 'nullable|string|max:100',
            'location.country' => 'nullable|string|max:100',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
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
            DB::beginTransaction();

            $user = auth()->user();
            
            // Check if user already has a freelancer profile
            if ($user->freelancer) {
                return response()->json([
                    'success' => false,
                    'message' => 'You already have a freelancer profile'
                ], 400);
            }

            $data = $validator->validated();

            // Handle profile image upload
            if ($request->hasFile('profile_image')) {
                $path = $request->file('profile_image')->store('freelancers/profiles', 'public');
                $data['profile_image'] = $path;
            }

            // Handle portfolio images upload
            if ($request->hasFile('portfolio_images')) {
                $portfolioImages = [];
                foreach ($request->file('portfolio_images') as $image) {
                    $path = $image->store('freelancers/portfolios', 'public');
                    $portfolioImages[] = $path;
                }
                $data['portfolio_images'] = $portfolioImages;
            }

            // Create freelancer profile
            $data['user_id'] = $user->user_id;
            $freelancer = Freelancer::create($data);

            // Assign freelancer role to user
            $freelancerRole = \App\Models\Role::where('role_name', 'freelancer')->first();
            if ($freelancerRole) {
                $user->roles()->attach($freelancerRole->role_id, [
                    'assigned_at' => now(),
                    'assigned_by' => $user->user_id
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Freelancer profile created successfully',
                'data' => $freelancer->load('user')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            // Clean up uploaded files if there was an error
            if (isset($data['profile_image']) && Storage::disk('public')->exists($data['profile_image'])) {
                Storage::disk('public')->delete($data['profile_image']);
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
                'message' => 'Failed to create freelancer profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified freelancer profile
     */
    public function show(Freelancer $freelancer): JsonResponse
    {
        // Load related data
        $freelancer->load([
            'user',
            'verifiedServices' => function ($query) {
                $query->orderBy('featured', 'desc')
                      ->orderBy('rating', 'desc')
                      ->limit(6);
            }
        ]);

        // Increment profile views (if not the owner)
        if (!auth()->check() || auth()->id() !== $freelancer->user_id) {
            // You might want to implement a view tracking system here
        }

        return response()->json([
            'success' => true,
            'data' => $freelancer
        ]);
    }

    /**
     * Update the specified freelancer profile
     */
    public function update(Request $request, Freelancer $freelancer): JsonResponse
    {
        // Check if user owns this freelancer profile
        if (auth()->id() !== $freelancer->user_id && !auth()->user()->hasRole('admin')) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'professional_title' => 'sometimes|required|string|max:100',
            'bio' => 'nullable|string|max:1000',
            'skills' => 'sometimes|required|array|min:1',
            'skills.*' => 'string|max:50',
            'categories' => 'sometimes|required|array|min:1',
            'categories.*' => 'string|max:50',
            'hourly_rate' => 'nullable|numeric|min:0|max:9999.99',
            'languages' => 'nullable|array',
            'languages.*' => 'string|max:50',
            'experience_level' => 'sometimes|required|in:beginner,intermediate,expert',
            'years_experience' => 'sometimes|required|integer|min:0|max:50',
            'portfolio_description' => 'nullable|string|max:2000',
            'certifications' => 'nullable|array',
            'education' => 'nullable|array',
            'work_preferences' => 'nullable|array',
            'availability_status' => 'sometimes|required|in:available,busy,unavailable',
            'phone' => 'nullable|string|max:20',
            'website' => 'nullable|url|max:255',
            'social_media' => 'nullable|array',
            'location' => 'nullable|array',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
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

            // Handle profile image upload
            if ($request->hasFile('profile_image')) {
                // Delete old image
                if ($freelancer->profile_image && Storage::disk('public')->exists($freelancer->profile_image)) {
                    Storage::disk('public')->delete($freelancer->profile_image);
                }
                
                $path = $request->file('profile_image')->store('freelancers/profiles', 'public');
                $data['profile_image'] = $path;
            }

            // Handle portfolio images upload
            if ($request->hasFile('portfolio_images')) {
                // Delete old portfolio images
                if ($freelancer->portfolio_images) {
                    foreach ($freelancer->portfolio_images as $image) {
                        if (Storage::disk('public')->exists($image)) {
                            Storage::disk('public')->delete($image);
                        }
                    }
                }

                $portfolioImages = [];
                foreach ($request->file('portfolio_images') as $image) {
                    $path = $image->store('freelancers/portfolios', 'public');
                    $portfolioImages[] = $path;
                }
                $data['portfolio_images'] = $portfolioImages;
            }

            $freelancer->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Freelancer profile updated successfully',
                'data' => $freelancer->fresh()->load('user')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update freelancer profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified freelancer profile
     */
    public function destroy(Freelancer $freelancer): JsonResponse
    {
        // Check if user owns this freelancer profile
        if (auth()->id() !== $freelancer->user_id && !auth()->user()->hasRole('admin')) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            // Delete associated images
            if ($freelancer->profile_image && Storage::disk('public')->exists($freelancer->profile_image)) {
                Storage::disk('public')->delete($freelancer->profile_image);
            }

            if ($freelancer->portfolio_images) {
                foreach ($freelancer->portfolio_images as $image) {
                    if (Storage::disk('public')->exists($image)) {
                        Storage::disk('public')->delete($image);
                    }
                }
            }

            // Remove freelancer role from user
            $user = $freelancer->user;
            $freelancerRole = \App\Models\Role::where('role_name', 'freelancer')->first();
            if ($freelancerRole) {
                $user->roles()->detach($freelancerRole->role_id);
            }

            $freelancer->delete();

            return response()->json([
                'success' => true,
                'message' => 'Freelancer profile deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete freelancer profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get current user's freelancer profile
     */
    public function myProfile(): JsonResponse
    {
        $user = auth()->user();
        $freelancer = $user->freelancer;

        if (!$freelancer) {
            return response()->json([
                'success' => false,
                'message' => 'No freelancer profile found'
            ], 404);
        }

        $freelancer->load(['user', 'services' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }]);

        return response()->json([
            'success' => true,
            'data' => $freelancer
        ]);
    }
}