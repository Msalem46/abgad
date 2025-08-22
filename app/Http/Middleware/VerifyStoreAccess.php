<?php
namespace App\Http\Middleware;

use App\Models\Store;
use Closure;
use Illuminate\Http\Request;

class VerifyStoreAccess
{
    /**
     * Verify that the store exists and is accessible
     */
    public function handle(Request $request, Closure $next, bool $requireVerified = false)
    {
        $storeId = $request->route('store') ?? $request->route('id');

        if ($storeId instanceof Store) {
            $store = $storeId;
        } else {
            $store = Store::with(['owner', 'primaryLocation'])->find($storeId);
        }

        if (!$store) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        if (!$store->is_active) {
            return response()->json(['message' => 'Store is not active'], 403);
        }

        if ($requireVerified && !$store->is_verified) {
            return response()->json(['message' => 'Store is not verified'], 403);
        }

        // Add store to request
        $request->merge(['_store' => $store]);

        return $next($request);
    }
}
