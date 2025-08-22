<?php
namespace App\Http\Middleware;

use App\Models\Store;
use App\Services\StoreAnalyticsService;
use Closure;
use Illuminate\Http\Request;

class TrackStoreVisit
{
    protected $analyticsService;

    public function __construct(StoreAnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Handle an incoming request and track the visit
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Only track GET requests to store pages
        if ($request->isMethod('GET') && $request->route('store')) {
            $storeId = $request->route('store');

            if ($storeId instanceof Store) {
                $store = $storeId;
            } else {
                $store = Store::find($storeId);
            }

            if ($store && $store->is_active) {
                try {
                    $this->analyticsService->trackVisit($store, [
                        'visitor_country' => $this->getCountryFromIP($request->ip()),
                        'visitor_city' => $this->getCityFromIP($request->ip()),
                    ]);
                } catch (\Exception $e) {
                    // Log error but don't fail the request
                    \Log::error('Failed to track store visit: ' . $e->getMessage());
                }
            }
        }

        return $response;
    }

    private function getCountryFromIP(string $ip): ?string
    {
        // Implement IP geolocation service integration
        // For example: MaxMind GeoIP2, ipapi.co, etc.
        return null;
    }

    private function getCityFromIP(string $ip): ?string
    {
        // Implement IP geolocation service integration
        return null;
    }
}
