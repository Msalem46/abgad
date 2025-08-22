<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Service extends Model
{
    use HasFactory;

    protected $table = 'services';
    protected $primaryKey = 'service_id';

    protected $fillable = [
        'freelancer_id',
        'title',
        'description',
        'category',
        'subcategory',
        'tags',
        'base_price',
        'price_type',
        'delivery_days',
        'service_packages',
        'requirements',
        'deliverables',
        'add_ons',
        'service_type',
        'location_restrictions',
        'portfolio_images',
        'featured_image',
        'max_revisions',
        'faq',
        'skills_required',
        'views',
        'inquiries',
        'orders',
        'rating',
        'total_reviews',
        'is_active',
        'featured',
        'is_verified',
        'verified_at',
        'admin_notes'
    ];

    protected $casts = [
        'tags' => 'array',
        'service_packages' => 'array',
        'requirements' => 'array',
        'deliverables' => 'array',
        'add_ons' => 'array',
        'location_restrictions' => 'array',
        'portfolio_images' => 'array',
        'skills_required' => 'array',
        'base_price' => 'decimal:2',
        'rating' => 'decimal:2',
        'is_active' => 'boolean',
        'featured' => 'boolean',
        'is_verified' => 'boolean',
        'verified_at' => 'datetime'
    ];

    /**
     * The freelancer who offers this service
     */
    public function freelancer(): BelongsTo
    {
        return $this->belongsTo(Freelancer::class, 'freelancer_id', 'freelancer_id');
    }

    /**
     * Get the user through the freelancer relationship
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id')
            ->through('freelancer');
    }

    /**
     * Get the service's display price
     */
    public function getDisplayPriceAttribute(): string
    {
        $price = number_format($this->base_price, 2);
        
        switch ($this->price_type) {
            case 'hourly':
                return "$price JOD/hour";
            case 'per_project':
                return "Starting from $price JOD";
            default:
                return "$price JOD";
        }
    }

    /**
     * Get the delivery time display
     */
    public function getDeliveryTimeAttribute(): string
    {
        if ($this->delivery_days == 1) {
            return "1 day";
        }
        return "{$this->delivery_days} days";
    }

    /**
     * Check if service is available for order
     */
    public function isAvailable(): bool
    {
        return $this->is_active && 
               $this->is_verified && 
               $this->freelancer && 
               $this->freelancer->isAvailable();
    }

    /**
     * Increment view count
     */
    public function incrementViews(): void
    {
        $this->increment('views');
    }

    /**
     * Increment inquiry count
     */
    public function incrementInquiries(): void
    {
        $this->increment('inquiries');
    }

    /**
     * Increment order count
     */
    public function incrementOrders(): void
    {
        $this->increment('orders');
        $this->freelancer->increment('completed_projects');
    }

    /**
     * Update rating
     */
    public function updateRating(float $newRating): void
    {
        $totalRating = ($this->rating * $this->total_reviews) + $newRating;
        $this->total_reviews++;
        $this->rating = round($totalRating / $this->total_reviews, 2);
        $this->save();

        // Update freelancer's overall rating
        $this->freelancer->updateRating();
    }

    /**
     * Scope for verified services
     */
    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    /**
     * Scope for active services
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for featured services
     */
    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    /**
     * Scope for available services (active, verified, with available freelancer)
     */
    public function scopeAvailable($query)
    {
        return $query->where('is_active', true)
                    ->where('is_verified', true)
                    ->whereHas('freelancer', function ($q) {
                        $q->where('is_active', true)
                          ->where('is_verified', true)
                          ->where('availability_status', 'available');
                    });
    }

    /**
     * Scope for search
     */
    public function scopeSearch($query, $searchTerm)
    {
        return $query->where(function ($q) use ($searchTerm) {
            $q->where('title', 'LIKE', "%{$searchTerm}%")
              ->orWhere('description', 'LIKE', "%{$searchTerm}%")
              ->orWhere('tags', 'LIKE', "%{$searchTerm}%")
              ->orWhere('category', 'LIKE', "%{$searchTerm}%");
        });
    }

    /**
     * Scope for category filter
     */
    public function scopeByCategory($query, $category)
    {
        if ($category) {
            return $query->where('category', $category);
        }
        return $query;
    }

    /**
     * Scope for price range filter
     */
    public function scopeByPriceRange($query, $minPrice = null, $maxPrice = null)
    {
        if ($minPrice !== null) {
            $query->where('base_price', '>=', $minPrice);
        }
        
        if ($maxPrice !== null) {
            $query->where('base_price', '<=', $maxPrice);
        }
        
        return $query;
    }
}