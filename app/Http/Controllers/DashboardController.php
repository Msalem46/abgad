<?php
namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\StoreVisit;
use App\Models\DailyStoreAnalytic;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends BaseController
{
    /**
     * Get dashboard statistics
     */
    public function stats(Request $request)
    {
        $user = auth()->user();
        $isAdmin = $user->hasRole('admin');

        // Get accessible stores
        $storesQuery = $isAdmin ? Store::query() : $user->ownedStores();

        $stats = [
            'total_stores' => $storesQuery->count(),
            'verified_stores' => $storesQuery->where('is_verified', true)->count(),
            'pending_stores' => $storesQuery->where('is_verified', false)->count(),
            'active_stores' => $storesQuery->where('is_active', true)->count(),
        ];

        // Visit statistics
        $visitsQuery = StoreVisit::query();
        if (!$isAdmin) {
            $visitsQuery->whereIn('store_id', $user->ownedStores()->pluck('store_id'));
        }

        $last30Days = $visitsQuery->where('visit_start', '>=', now()->subDays(30));
        $last60Days = $visitsQuery->where('visit_start', '>=', now()->subDays(60))
            ->where('visit_start', '<', now()->subDays(30));

        $currentViews = $last30Days->count();
        $previousViews = $last60Days->count();

        $stats['total_views'] = $currentViews;
        $stats['monthly_growth'] = $previousViews > 0
            ? round((($currentViews - $previousViews) / $previousViews) * 100, 1)
            : 0;

        // Average duration
        $avgDuration = $last30Days->whereNotNull('duration_seconds')->avg('duration_seconds');
        $stats['avg_duration'] = $avgDuration
            ? $this->formatDuration($avgDuration)
            : '0m 0s';

        return $this->successResponse($stats);
    }

    /**
     * Get recent stores
     */
    public function recentStores(Request $request)
    {
        $limit = $request->get('limit', 10);

        $stores = $this->getAccessibleStores()
            ->with(['primaryLocation'])
            ->latest()
            ->limit($limit)
            ->get();

        return $this->successResponse($stores);
    }

    /**
     * Get dashboard activity feed
     */
    public function activityFeed(Request $request)
    {
        $user = auth()->user();
        $activities = [];

        // Recent store visits (last 24 hours)
        $recentVisits = StoreVisit::with('store:store_id,trading_name')
            ->whereIn('store_id', $this->getAccessibleStores()->pluck('store_id'))
            ->where('visit_start', '>=', now()->subDay())
            ->latest('visit_start')
            ->limit(20)
            ->get();

        foreach ($recentVisits as $visit) {
            $activities[] = [
                'type' => 'visit',
                'message' => "New visit to {$visit->store->trading_name}",
                'timestamp' => $visit->visit_start,
                'data' => [
                    'store_id' => $visit->store_id,
                    'duration' => $visit->duration_seconds ? $this->formatDuration($visit->duration_seconds) : 'Ongoing',
                    'device' => $visit->device_type
                ]
            ];
        }

        // Sort by timestamp
        usort($activities, function ($a, $b) {
            return $b['timestamp'] <=> $a['timestamp'];
        });

        return $this->successResponse(array_slice($activities, 0, $request->get('limit', 15)));
    }

    private function formatDuration($seconds): string
    {
        $minutes = floor($seconds / 60);
        $remainingSeconds = $seconds % 60;
        return $minutes > 0 ? "{$minutes}m {$remainingSeconds}s" : "{$remainingSeconds}s";
    }
}
