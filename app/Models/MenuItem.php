<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenuItem extends Model
{
    use HasFactory;

    protected $table = 'menu_items';
    protected $primaryKey = 'item_id';

    protected $fillable = [
        'store_id',
        'category_id',
        'item_name',
        'description',
        'price',
        'currency',
        'is_available',
        'is_featured',
        'preparation_time',
        'is_vegetarian',
        'is_vegan',
        'is_halal',
        'allergens',
        'display_order',
        'image_url'
    ];

    protected $casts = [
        'price' => 'decimal:3',
        'is_available' => 'boolean',
        'is_featured' => 'boolean',
        'is_vegetarian' => 'boolean',
        'is_vegan' => 'boolean',
        'is_halal' => 'boolean',
        'allergens' => 'array'
    ];

    /**
     * Store that owns this menu item
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class, 'store_id', 'store_id');
    }

    /**
     * Category this item belongs to
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(MenuCategory::class, 'category_id', 'category_id');
    }

    /**
     * Get formatted price attribute
     */
    public function getFormattedPriceAttribute(): string
    {
        if (!$this->price) return 'Price on request';
        return number_format($this->price, 3) . ' ' . $this->currency;
    }

    /**
     * Get dietary info as array
     */
    public function getDietaryInfoAttribute(): array
    {
        $info = [];
        if ($this->is_vegetarian) $info[] = 'Vegetarian';
        if ($this->is_vegan) $info[] = 'Vegan';
        if ($this->is_halal) $info[] = 'Halal';
        return $info;
    }

    /**
     * Get preparation time in human format
     */
    public function getPreparationTimeFormattedAttribute(): ?string
    {
        if (!$this->preparation_time) return null;
        return $this->preparation_time . ' minute' . ($this->preparation_time > 1 ? 's' : '');
    }
}
