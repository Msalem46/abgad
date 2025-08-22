<?php
namespace App\Services;

use App\Models\Store;
use App\Models\StoreVisit;
use App\Models\DailyStoreAnalytic;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StoreAnalyticsService
{
    /**
     * Track a store visit
     */
    public function trackVisit(Store $store, array $data = []): StoreVisit
    {
        return StoreVisit::create([
            'store_id' => $store->store_id,
            'visitor_ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'user_id' => auth()->id(),
            'session_id' => session()->getId(),
            'visit_start' => now(),
            'referrer_url' => request()->headers->get('referer'),
            'device_type' => $this->detectDeviceType(request()->userAgent()),
            'browser_name' => $this->detectBrowser(request()->userAgent()),
            'operating_system' => $this->detectOS(request()->userAgent()),
            ...$data
        ]);
    }

    /**
     * End a visit session
     */
    public function endVisit(StoreVisit $visit): void
    {
        $visit->update([
            'visit_end' => now(),
            'duration_seconds' => now()->diffInSeconds($visit->visit_start)
        ]);
    }

    /**
     * Generate daily analytics for a store
     */
    public function generateDailyAnalytics(Store $store, Carbon $date): DailyStoreAnalytic
    {
        $visits = StoreVisit::where('store_id', $store->store_id)
            ->whereDate('visit_start', $date)
            ->get();

        $analytics = [
            'store_id' => $store->store_id,
            'analytics_date' => $date->toDateString(),
            'total_visits' => $visits->count(),
            'unique_visitors' => $visits->unique('visitor_ip')->count(),
            'total_duration_seconds' => $visits->sum('duration_seconds'),
            'average_duration_seconds' => $visits->avg('duration_seconds') ?? 0,
            'bounce_rate' => $this->calculateBounceRate($visits),
            'page_views' => $this->calculatePageViews($visits),
            'menu_views' => $this->calculateMenuViews($visits),
            'gallery_views' => $this->calculateGalleryViews($visits),
            'desktop_visits' => $visits->where('device_type', 'desktop')->count(),
            'mobile_visits' => $visits->where('device_type', 'mobile')->count(),
            'tablet_visits' => $visits->where('device_type', 'tablet')->count(),
        ];

        return DailyStoreAnalytic::updateOrCreate(
            ['store_id' => $store->store_id, 'analytics_date' => $date->toDateString()],
            $analytics
        );
    }

    private function detectDeviceType(string $userAgent): string
    {
        if (preg_match('/tablet|ipad/i', $userAgent)) {
            return 'tablet';
        }
        if (preg_match('/mobile|android|iphone/i', $userAgent)) {
            return 'mobile';
        }
        return 'desktop';
    }

    private function detectBrowser(string $userAgent): string
    {
        if (strpos($userAgent, 'Chrome') !== false) return 'Chrome';
        if (strpos($userAgent, 'Firefox') !== false) return 'Firefox';
        if (strpos($userAgent, 'Safari') !== false) return 'Safari';
        if (strpos($userAgent, 'Edge') !== false) return 'Edge';
        return 'Other';
    }

    private function detectOS(string $userAgent): string
    {
        if (strpos($userAgent, 'Windows') !== false) return 'Windows';
        if (strpos($userAgent, 'Mac') !== false) return 'macOS';
        if (strpos($userAgent, 'Linux') !== false) return 'Linux';
        if (strpos($userAgent, 'Android') !== false) return 'Android';
        if (strpos($userAgent, 'iOS') !== false) return 'iOS';
        return 'Other';
    }

    private function calculateBounceRate($visits): float
    {
        if ($visits->isEmpty()) return 0;

        $bounces = $visits->filter(function ($visit) {
            return $visit->duration_seconds <= 30; // Less than 30 seconds = bounce
        })->count();

        return ($bounces / $visits->count()) * 100;
    }

    private function calculatePageViews($visits): int
    {
        return $visits->sum(function ($visit) {
            return $visit->interactions()->count();
        });
    }

    private function calculateMenuViews($visits): int
    {
        return $visits->sum(function ($visit) {
            return $visit->interactions()->where('page_section', 'menu')->count();
        });
    }

    private function calculateGalleryViews($visits): int
    {
        return $visits->sum(function ($visit) {
            return $visit->interactions()->where('page_section', 'gallery')->count();
        });
    }
}
