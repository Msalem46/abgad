<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Freelancer extends Model
{
    use HasFactory;

    protected $table = 'freelancers';
    protected $primaryKey = 'freelancer_id';

    protected $fillable = [
        'user_id',
        'professional_title',
        'bio',
        'skills',
        'categories',
        'hourly_rate',
        'languages',
        'experience_level',
        'years_experience',
        'portfolio_description',
        'certifications',
        'education',
        'availability_status',
        'work_preferences',
        'phone',
        'website',
        'social_media',
        'profile_image',
        'portfolio_images',
        'rating',
        'total_reviews',
        'completed_projects',
        'location',
        'is_verified',
        'is_active',
        'featured',
        'verified_at',
        'admin_notes'
    ];

    protected $casts = [
        'skills' => 'array',
        'categories' => 'array',
        'languages' => 'array',
        'certifications' => 'array',
        'education' => 'array',
        'work_preferences' => 'array',
        'social_media' => 'array',
        'portfolio_images' => 'array',
        'location' => 'array',
        'hourly_rate' => 'decimal:2',
        'rating' => 'decimal:2',
        'is_verified' => 'boolean',
        'is_active' => 'boolean',
        'featured' => 'boolean',
        'verified_at' => 'datetime'
    ];

    /**
     * The user associated with this freelancer profile
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * Services offered by this freelancer
     */
    public function services(): HasMany
    {
        return $this->hasMany(Service::class, 'freelancer_id', 'freelancer_id');
    }

    /**
     * Active services only
     */
    public function activeServices(): HasMany
    {
        return $this->services()->where('is_active', true);
    }

    /**
     * Verified services only
     */
    public function verifiedServices(): HasMany
    {
        return $this->services()->where('is_verified', true)->where('is_active', true);
    }

    /**
     * Get the freelancer's full name from user
     */
    public function getFullNameAttribute(): string
    {
        return $this->user ? $this->user->full_name : '';
    }

    /**
     * Get the freelancer's display name
     */
    public function getDisplayNameAttribute(): string
    {
        return $this->user ? $this->user->first_name : '';
    }

    /**
     * Check if freelancer is available
     */
    public function isAvailable(): bool
    {
        return $this->availability_status === 'available' && $this->is_active && $this->is_verified;
    }

    /**
     * Get average rating from services
     */
    public function calculateAverageRating(): float
    {
        $services = $this->services()->where('total_reviews', '>', 0)->get();
        
        if ($services->isEmpty()) {
            return 0.0;
        }

        $totalRating = $services->sum(function ($service) {
            return $service->rating * $service->total_reviews;
        });

        $totalReviews = $services->sum('total_reviews');

        return $totalReviews > 0 ? round($totalRating / $totalReviews, 2) : 0.0;
    }

    /**
     * Update freelancer rating based on service ratings
     */
    public function updateRating(): void
    {
        $this->rating = $this->calculateAverageRating();
        $this->total_reviews = $this->services()->sum('total_reviews');
        $this->save();
    }

    /**
     * Scope for verified freelancers
     */
    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    /**
     * Scope for active freelancers
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for featured freelancers
     */
    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    /**
     * Scope for available freelancers
     */
    public function scopeAvailable($query)
    {
        return $query->where('availability_status', 'available');
    }
}