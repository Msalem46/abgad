<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    StoreController,
    DashboardController,
    AnalyticsController,
    StoreLocationController,
    StorePhotoController,
    MenuCategoryController,
    MenuItemController,
    SearchController,
    AuthController,
    FreelancerController,
    ServiceController
};

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Authentication routes (no middleware)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

// Public store registration
Route::post('/public/register-store', [App\Http\Controllers\PublicStoreRegistrationController::class, 'register']);

// Public routes (no authentication required)
Route::get('/stores', [StoreController::class, 'index']); // Public store listing
Route::get('/search/stores', [SearchController::class, 'stores']);
Route::get('/search/suggestions', [SearchController::class, 'suggestions']);

// Public freelancer and service routes
Route::get('/freelancers', [FreelancerController::class, 'index']); // Public freelancer listing
Route::get('/freelancers/{freelancer}', [FreelancerController::class, 'show']); // Public freelancer profile
Route::get('/services', [ServiceController::class, 'index']); // Public service listing
Route::get('/services/{service}', [ServiceController::class, 'show']); // Public service details
Route::get('/services/categories', [ServiceController::class, 'getCategories']); // Service categories
Route::get('/freelancers/{freelancer}/services', [ServiceController::class, 'getFreelancerServices']); // Services by freelancer

// Public store-specific routes (with verification for individual stores)
Route::middleware(['public-store'])->group(function () {
    Route::get('/stores/{store}', [StoreController::class, 'show']);
    Route::get('/stores/{store}/menu', [MenuItemController::class, 'publicMenu']);
    Route::get('/stores/{store}/gallery', [StorePhotoController::class, 'index']);
});

// Protected routes (require authentication)
Route::middleware(['auth:sanctum'])->group(function () {

    // User profile
    Route::get('/user', function (Request $request) {
        return $request->user()->load('roles');
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Store access for owners/admins (bypasses verification requirement)
    Route::middleware(['store.owner'])->group(function () {
        Route::get('/stores/{store}', [StoreController::class, 'show']);
    });

    // Dashboard routes
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats']);
        Route::get('/recent-stores', [DashboardController::class, 'recentStores']);
        Route::get('/activity-feed', [DashboardController::class, 'activityFeed']);
    });

    // Admin-only routes
    Route::middleware(['admin-only'])->group(function () {
        Route::prefix('admin')->group(function () {
            Route::get('/stores', [StoreController::class, 'adminIndex']);
            Route::get('/analytics', [AnalyticsController::class, 'adminDashboard']);
            Route::put('/stores/{store}/verify', [StoreController::class, 'verify']);
        });
    });

    // Store creation (requires permission)
    Route::middleware(['permission:stores,create'])->group(function () {
        Route::post('/stores', [StoreController::class, 'store']);
    });

    // Freelancer profile management
    Route::post('/freelancers', [FreelancerController::class, 'store']); // Create freelancer profile
    Route::get('/freelancers/my-profile', [FreelancerController::class, 'myProfile']); // Get current user's profile
    Route::put('/freelancers/{freelancer}', [FreelancerController::class, 'update']); // Update freelancer profile
    Route::delete('/freelancers/{freelancer}', [FreelancerController::class, 'destroy']); // Delete freelancer profile

    // Service management
    Route::post('/services', [ServiceController::class, 'store']); // Create service
    Route::get('/services/my-services', [ServiceController::class, 'myServices']); // Get current user's services
    Route::put('/services/{service}', [ServiceController::class, 'update']); // Update service
    Route::delete('/services/{service}', [ServiceController::class, 'destroy']); // Delete service

    // Store management (owner or admin)
    Route::middleware(['store-management'])->group(function () {
        Route::put('/stores/{store}', [StoreController::class, 'update']);
        Route::delete('/stores/{store}', [StoreController::class, 'destroy']);
        Route::get('/stores/{store}/statistics', [StoreController::class, 'statistics']);

        // Store locations
        Route::prefix('stores/{store}')->group(function () {
            Route::apiResource('locations', StoreLocationController::class)->except(['show']);
            Route::post('/photos', [StorePhotoController::class, 'store']);
            Route::put('/photos/{photo}', [StorePhotoController::class, 'update']);
            Route::delete('/photos/{photo}', [StorePhotoController::class, 'destroy']);
            Route::post('/photos/reorder', [StorePhotoController::class, 'reorder']);
        });
    });

    // Menu management (requires store access)
    Route::middleware(['store.access:update'])->group(function () {
        Route::prefix('stores/{store}')->group(function () {
            Route::apiResource('menu-categories', MenuCategoryController::class);
            Route::apiResource('menu-items', MenuItemController::class);
            Route::post('/menu-items/{item}/toggle', [MenuItemController::class, 'toggleAvailability']);
        });
    });

    // Analytics access
    Route::middleware(['store.access:read'])->group(function () {
        Route::get('/stores/{store}/analytics', [AnalyticsController::class, 'show']);
    });

});
