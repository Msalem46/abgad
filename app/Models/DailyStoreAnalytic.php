<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyStoreAnalytic extends Model
{
    use HasFactory;

    protected $table = 'daily_store_analytics';
    protected $primaryKey = 'analytics_id';

    protected $fillable = [
        'store_id',
        'analytics_date',
        'total_visits',
        'unique_visitors',
        'total_duration_seconds',
        'average_duration_seconds',
        'bounce_rate',
        'page_views',
        'menu_views',
        'gallery_views',
        'desktop_visits',
        'mobile_visits',
        'tablet_visits'
    ];

    protected $casts = [
        'analytics_date' => 'date',
        'total_duration_seconds' => 'integer',
        'average_duration_seconds' => 'decimal:2',
        'bounce_rate' => 'decimal:2'
    ];

    /**
     * Store these analytics belong to
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class, 'store_id', 'store_id');
    }

    /**
     * Get bounce rate as percentage
     */
    public function getBounceRatePercentageAttribute(): string
    {
        return number_format($this->bounce_rate, 1) . '%';
    }

    /**
     * Get average duration formatted
     */
    public function getAverageDurationFormattedAttribute(): string
    {
        $seconds = $this->average_duration_seconds;
        $minutes = floor($seconds / 60);
        $remainingSeconds = $seconds % 60;

        if ($minutes > 0) {
            return $minutes . 'm ' . $remainingSeconds . 's';
        }
        return $remainingSeconds . 's';
    }

    /**
     * Get total device visits
     */
    public function getTotalDeviceVisitsAttribute(): int
    {
        return $this->desktop_visits + $this->mobile_visits + $this->tablet_visits;
    }

    /**
     * Get device breakdown as percentages
     */
    public function getDeviceBreakdownAttribute(): array
    {
        $total = $this->total_device_visits;
        if ($total === 0) return ['desktop' => 0, 'mobile' => 0, 'tablet' => 0];

        return [
            'desktop' => round(($this->desktop_visits / $total) * 100, 1),
            'mobile' => round(($this->mobile_visits / $total) * 100, 1),
            'tablet' => round(($this->tablet_visits / $total) * 100, 1)
        ];
    }
}
