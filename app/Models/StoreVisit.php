<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StoreVisit extends Model
{
    use HasFactory;

    protected $table = 'store_visits';
    protected $primaryKey = 'visit_id';
    public $timestamps = false;

    protected $fillable = [
        'store_id',
        'visitor_ip',
        'user_agent',
        'user_id',
        'session_id',
        'visit_start',
        'visit_end',
        'duration_seconds',
        'referrer_url',
        'device_type',
        'browser_name',
        'operating_system',
        'visitor_country',
        'visitor_city'
    ];

    protected $casts = [
        'visit_start' => 'datetime',
        'visit_end' => 'datetime',
        'created_at' => 'datetime'
    ];

    /**
     * Store that was visited
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class, 'store_id', 'store_id');
    }

    /**
     * User who visited (if logged in)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * Interactions during this visit
     */
    public function interactions(): HasMany
    {
        return $this->hasMany(VisitInteraction::class, 'visit_id', 'visit_id');
    }

    /**
     * Get duration in human readable format
     */
    public function getDurationFormattedAttribute(): ?string
    {
        if (!$this->duration_seconds) return null;

        $minutes = floor($this->duration_seconds / 60);
        $seconds = $this->duration_seconds % 60;

        if ($minutes > 0) {
            return $minutes . 'm ' . $seconds . 's';
        }
        return $seconds . 's';
    }

    /**
     * Check if visit is still active
     */
    public function getIsActiveAttribute(): bool
    {
        return is_null($this->visit_end);
    }
}
