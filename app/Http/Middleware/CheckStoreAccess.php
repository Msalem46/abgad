<?php
namespace App\Http\Middleware;

use App\Models\Store;
use Closure;
use Illuminate\Http\Request;

class CheckStoreAccess
{
    /**
     * More flexible store access check that considers different access levels
     */
    public function handle(Request $request, Closure $next, string $accessLevel = 'read')
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $user = auth()->user();
        $storeId = $request->route('store') ?? $request->route('id') ?? $request->input('store_id');

        if ($storeId instanceof Store) {
            $store = $storeId;
            $storeId = $store->store_id;
        } else {
            $store = Store::find($storeId);
        }

        if (!$store) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        // Check access based on level
        $hasAccess = $this->checkAccess($user, $store, $accessLevel);

        if (!$hasAccess) {
            return response()->json([
                'message' => "Access denied. Insufficient permissions for $accessLevel access.",
                'store_id' => $storeId,
                'required_access' => $accessLevel
            ], 403);
        }

        // Add store to request for controller use
        $request->merge(['_store' => $store]);

        return $next($request);
    }

    private function checkAccess($user, $store, $accessLevel): bool
    {
        // Admin has full access
        if ($user->hasRole('admin')) {
            return true;
        }

        // Store owner has full access to their stores
        if ($user->ownsStore($store->store_id)) {
            return true;
        }

        // Store manager access (if implemented)
        if ($user->hasRole('store_manager') && $this->isStoreManager($user, $store)) {
            return in_array($accessLevel, ['read', 'update']);
        }

        // Public read access for verified stores
        if ($accessLevel === 'read' && $store->is_verified && $store->is_active) {
            return true;
        }

        return false;
    }

    private function isStoreManager($user, $store): bool
    {
        // Implement store manager logic if needed
        // This could check a store_managers table or similar
        return false;
    }
}
