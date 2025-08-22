<?php
namespace App\Traits;

trait HasMiddlewareHelpers
{
    /**
     * Check if current request has specific middleware applied
     */
    protected function hasMiddleware(string $middleware): bool
    {
        $route = request()->route();
        if (!$route) return false;

        $middlewares = $route->gatherMiddleware();

        foreach ($middlewares as $mid) {
            if (is_string($mid) && str_contains($mid, $middleware)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get the store from request (set by middleware)
     */
    protected function getStoreFromRequest()
    {
        return request()->get('_store');
    }

    /**
     * Check if request is from store owner
     */
    protected function isStoreOwnerRequest(): bool
    {
        $store = $this->getStoreFromRequest();
        return $store && auth()->user()->ownsStore($store->store_id);
    }

    /**
     * Get accessible stores for current user
     */
    protected function getAccessibleStores()
    {
        if (!auth()->check()) {
            return collect();
        }

        return auth()->user()->getAccessibleStores();
    }
}
