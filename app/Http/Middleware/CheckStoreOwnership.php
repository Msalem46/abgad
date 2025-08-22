<?php
namespace App\Http\Middleware;

use App\Models\Store;
use Closure;
use Illuminate\Http\Request;

class CheckStoreOwnership
{
    /**
     * Handle an incoming request.
     * Checks if user owns the store or has admin privileges
     */
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $user = auth()->user();

        // Admin can access all stores
        if ($user->hasRole('admin')) {
            return $next($request);
        }

        // Get store ID from route parameter
        $storeId = $request->route('store') ?? $request->route('id') ?? $request->input('store_id');

        if ($storeId instanceof Store) {
            $storeId = $storeId->store_id;
        }

        if (!$storeId) {
            return response()->json([
                'message' => 'Store ID is required'
            ], 400);
        }

        // Check if user owns the store
        if (!$user->ownsStore($storeId)) {
            return response()->json([
                'message' => 'Access denied. You can only access your own stores.',
                'store_id' => $storeId
            ], 403);
        }

        return $next($request);
    }
}
