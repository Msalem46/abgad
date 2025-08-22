<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MenuCategory extends Model
{
    use HasFactory;

    protected $table = 'menu_categories';
    protected $primaryKey = 'category_id';
    public $timestamps = false;

    protected $fillable = [
        'store_id',
        'category_name',
        'description',
        'display_order',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime'
    ];

    /**
     * Store that owns this category
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class, 'store_id', 'store_id');
    }

    /**
     * Menu items in this category
     */
    public function menuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class, 'category_id', 'category_id')
            ->orderBy('display_order');
    }

    /**
     * Available menu items in this category
     */
    public function availableMenuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class, 'category_id', 'category_id')
            ->where('is_available', true)
            ->orderBy('display_order');
    }
}
