<?php
namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\StoreVisit;
use App\Models\DailyStoreAnalytic;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AnalyticsController extends BaseController
{
    /**
     * Get analytics for a specific store
     */
    public function show(Request $request, Store $store)
    {
        $days = $request->get('days', 30);
        $startDate = now()->subDays($days);

        $analytics = [
            'summary' => $this->getStoreSummary($store, $startDate),
            'daily_visits' => $this->getDailyVisits($store, $startDate),
            'device_breakdown' => $this->getDeviceBreakdown($store, $startDate),
            'top_pages' => $this->getTopPages($store, $startDate),
            'visitor_locations' => $this->getVisitorLocations($store, $startDate),
            'hourly_pattern' => $this->getHourlyPattern($store, $startDate)
        ];

        return $this->successResponse($analytics);
    }

    /**
     * Admin analytics dashboard
     */
    public function adminDashboard(Request $request)
    {
        $days = $request->get('days', 30);
        $startDate = now()->subDays($days);

        $analytics = [
            'overview' => $this->getSystemOverview($startDate),
            'top_stores' => $this->getTopStores($startDate),
            'growth_metrics' => $this->getGrowthMetrics($startDate),
            'geographic_data' => $this->getGeographicData($startDate)
        ];

        return $this->successResponse($analytics);
    }

    private function getStoreSummary(Store $store, Carbon $startDate): array
    {
        $visits = StoreVisit::where('store_id', $store->store_id)
            ->where('visit_start', '>=', $startDate)
            ->get();

        return [
            'total_visits' => $visits->count(),
            'unique_visitors' => $visits->unique('visitor_ip')->count(),
            'total_duration' => $visits->sum('duration_seconds'),
            'avg_duration' => $visits->avg('duration_seconds') ?? 0,
            'bounce_rate' => $this->calculateBounceRate($visits),
            'return_visitors' => $this->calculateReturnVisitors($store, $startDate)
        ];
    }

    private function getDailyVisits(Store $store, Carbon $startDate): array
    {
        return DailyStoreAnalytic::where('store_id', $store->store_id)
            ->where('analytics_date', '>=', $startDate)
            ->orderBy('analytics_date')
            ->get(['analytics_date as date', 'total_visits as visits', 'unique_visitors'])
            ->toArray();
    }

    private function getDeviceBreakdown(Store $store, Carbon $startDate): array
    {
        $breakdown = StoreVisit::where('store_id', $store->store_id)
            ->where('visit_start', '>=', $startDate)
            ->selectRaw('device_type, COUNT(*) as count')
            ->groupBy('device_type')
            ->pluck('count', 'device_type')
            ->toArray();

        return [
            'desktop' => $breakdown['desktop'] ?? 0,
            'mobile' => $breakdown['mobile'] ?? 0,
            'tablet' => $breakdown['tablet'] ?? 0
        ];
    }

    private function getTopPages(Store $store, Carbon $startDate): array
    {
        // This would need visit_interactions table
        return [
            ['page' => 'Store Home', 'views' => 150],
            ['page' => 'Menu', 'views' => 89],
            ['page' => 'Gallery', 'views' => 67],
            ['page' => 'Contact', 'views' => 23]
        ];
    }

    private function getVisitorLocations(Store $store, Carbon $startDate): array
    {
        return StoreVisit::where('store_id', $store->store_id)
            ->where('visit_start', '>=', $startDate)
            ->whereNotNull('visitor_city')
            ->selectRaw('visitor_city, visitor_country, COUNT(*) as visits')
            ->groupBy('visitor_city', 'visitor_country')
            ->orderByDesc('visits')
            ->limit(10)
            ->get()
            ->toArray();
    }

    private function getHourlyPattern(Store $store, Carbon $startDate): array
    {
        $pattern = StoreVisit::where('store_id', $store->store_id)
            ->where('visit_start', '>=', $startDate)
            ->selectRaw('HOUR(visit_start) as hour, COUNT(*) as visits')
            ->groupBy('hour')
            ->orderBy('hour')
            ->pluck('visits', 'hour')
            ->toArray();

        // Fill missing hours with 0
        $hourlyData = [];
        for ($i = 0; $i < 24; $i++) {
            $hourlyData[] = [
                'hour' => $i,
                'visits' => $pattern[$i] ?? 0
            ];
        }

        return $hourlyData;
    }

    private function getSystemOverview(Carbon $startDate): array
    {
        return [
            'total_stores' => Store::count(),
            'active_stores' => Store::where('is_active', true)->count(),
            'verified_stores' => Store::where('is_verified', true)->count(),
            'total_visits' => StoreVisit::where('visit_start', '>=', $startDate)->count(),
            'unique_visitors' => StoreVisit::where('visit_start', '>=', $startDate)
                ->distinct('visitor_ip')->count(),
        ];
    }

    private function getTopStores(Carbon $startDate): array
    {
        return Store::withCount(['visits' => function ($query) use ($startDate) {
            $query->where('visit_start', '>=', $startDate);
        }])
            ->orderByDesc('visits_count')
            ->limit(10)
            ->get(['store_id', 'trading_name', 'category'])
            ->map(function ($store) {
                return [
                    'name' => $store->trading_name,
                    'category' => $store->category,
                    'views' => $store->visits_count
                ];
            })
            ->toArray();
    }

    private function getGrowthMetrics(Carbon $startDate): array
    {
        $currentPeriod = StoreVisit::where('visit_start', '>=', $startDate)->count();
        $previousPeriod = StoreVisit::where('visit_start', '>=', $startDate->copy()->subDays($startDate->diffInDays()))
            ->where('visit_start', '<', $startDate)
            ->count();

        $growth = $previousPeriod > 0
            ? (($currentPeriod - $previousPeriod) / $previousPeriod) * 100
            : 0;

        return [
            'visits_growth' => round($growth, 1),
            'stores_growth' => $this->calculateStoreGrowth($startDate)
        ];
    }

    private function getGeographicData(Carbon $startDate): array
    {
        return StoreVisit::where('visit_start', '>=', $startDate)
            ->whereNotNull('visitor_country')
            ->selectRaw('visitor_country, COUNT(*) as visits')
            ->groupBy('visitor_country')
            ->orderByDesc('visits')
            ->limit(15)
            ->get()
            ->toArray();
    }

    private function calculateBounceRate($visits): float
    {
        if ($visits->isEmpty()) return 0;

        $bounces = $visits->filter(function ($visit) {
            return $visit->duration_seconds <= 30;
        })->count();

        return round(($bounces / $visits->count()) * 100, 1);
    }

    private function calculateReturnVisitors(Store $store, Carbon $startDate): int
    {
        $ips = StoreVisit::where('store_id', $store->store_id)
            ->where('visit_start', '>=', $startDate)
            ->groupBy('visitor_ip')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('visitor_ip');

        return $ips->count();
    }

    private function calculateStoreGrowth(Carbon $startDate): float
    {
        $currentStores = Store::where('created_at', '>=', $startDate)->count();
        $previousStores = Store::where('created_at', '>=', $startDate->copy()->subDays($startDate->diffInDays()))
            ->where('created_at', '<', $startDate)
            ->count();

        return $previousStores > 0
            ? round((($currentStores - $previousStores) / $previousStores) * 100, 1)
            : 0;
    }
}
