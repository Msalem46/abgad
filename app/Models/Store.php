<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Store extends Model
{
    use HasFactory;

    protected $table = 'stores';
    protected $primaryKey = 'store_id';

    protected $fillable = [
        'owner_id',
        'trading_name',
        'national_id',
        'trading_license_number',
        'commercial_registration_number',
        'tax_number',
        'municipality_license',
        'health_permit',
        'fire_safety_certificate',
        'description',
        'category',
        'subcategory',
        'established_date',
        'website',
        'social_media',
        'operating_hours',
        'is_active',
        'is_verified',
        'verification_date',
        'verification_notes'
    ];

    protected $casts = [
        'social_media' => 'array',
        'operating_hours' => 'array',
        'is_active' => 'boolean',
        'is_verified' => 'boolean',
        'established_date' => 'date',
        'verification_date' => 'datetime'
    ];

    /**
     * Store owner
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id', 'user_id');
    }

    /**
     * Store locations
     */
    public function locations(): HasMany
    {
        return $this->hasMany(StoreLocation::class, 'store_id', 'store_id');
    }

    /**
     * Primary location
     */
    public function primaryLocation(): HasOne
    {
        return $this->hasOne(StoreLocation::class, 'store_id', 'store_id')
            ->where('is_primary', true);
    }

    /**
     * Store photos
     */
    public function photos(): HasMany
    {
        return $this->hasMany(StorePhoto::class, 'store_id', 'store_id');
    }

    /**
     * Active photos
     */
    public function activePhotos(): HasMany
    {
        return $this->hasMany(StorePhoto::class, 'store_id', 'store_id')
            ->where('is_active', true)
            ->orderBy('display_order');
    }

    /**
     * Featured photos
     */
    public function featuredPhotos(): HasMany
    {
        return $this->hasMany(StorePhoto::class, 'store_id', 'store_id')
            ->where('is_featured', true)
            ->where('is_active', true)
            ->orderBy('display_order');
    }

    /**
     * Menu categories
     */
    public function menuCategories(): HasMany
    {
        return $this->hasMany(MenuCategory::class, 'store_id', 'store_id')
            ->where('is_active', true)
            ->orderBy('display_order');
    }

    /**
     * Menu items
     */
    public function menuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class, 'store_id', 'store_id');
    }

    /**
     * Available menu items
     */
    public function availableMenuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class, 'store_id', 'store_id')
            ->where('is_available', true)
            ->orderBy('display_order');
    }

    /**
     * Store visits
     */
    public function visits(): HasMany
    {
        return $this->hasMany(StoreVisit::class, 'store_id', 'store_id');
    }

    /**
     * Daily analytics
     */
    public function dailyAnalytics(): HasMany
    {
        return $this->hasMany(DailyStoreAnalytic::class, 'store_id', 'store_id');
    }

    /**
     * Get today's operating hours
     */
    public function getTodayOperatingHoursAttribute(): ?array
    {
        $today = strtolower(now()->format('l'));
        return $this->operating_hours[$today] ?? null;
    }

    /**
     * Check if store is open now
     */
    public function getIsOpenNowAttribute(): bool
    {
        $todayHours = $this->today_operating_hours;
        if (!$todayHours || !isset($todayHours['open']) || !isset($todayHours['close'])) {
            return false;
        }

        $now = now()->format('H:i');
        return $now >= $todayHours['open'] && $now <= $todayHours['close'];
    }
}
