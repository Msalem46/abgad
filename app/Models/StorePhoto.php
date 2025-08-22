<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StorePhoto extends Model
{
    use HasFactory;

    protected $table = 'store_photos';
    protected $primaryKey = 'photo_id';
    public $timestamps = false;

    protected $fillable = [
        'store_id',
        'file_name',
        'file_path',
        'file_size',
        'mime_type',
        'photo_type',
        'title',
        'description',
        'alt_text',
        'is_featured',
        'display_order',
        'is_active',
        'uploaded_by'
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'uploaded_at' => 'datetime'
    ];

    /**
     * Store that owns this photo
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class, 'store_id', 'store_id');
    }

    /**
     * User who uploaded this photo
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by', 'user_id');
    }

    /**
     * Get full URL attribute
     */
    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->file_path);
    }

    /**
     * Get file size in human readable format
     */
    public function getHumanFileSizeAttribute(): string
    {
        if (!$this->file_size) return 'Unknown';

        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }
}
