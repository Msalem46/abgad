<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StoreLocation extends Model
{
    use HasFactory;

    protected $table = 'store_locations';
    protected $primaryKey = 'location_id';
    public $timestamps = false;

    protected $fillable = [
        'store_id',
        'street_address',
        'building_number',
        'floor_number',
        'apartment_unit',
        'neighborhood',
        'city',
        'governorate',
        'postal_code',
        'latitude',
        'longitude',
        'landmarks',
        'parking_availability',
        'public_transport_access',
        'is_primary'
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'parking_availability' => 'boolean',
        'is_primary' => 'boolean',
        'created_at' => 'datetime'
    ];

    /**
     * Store that owns this location
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class, 'store_id', 'store_id');
    }

    /**
     * Get full address attribute
     */
    public function getFullAddressAttribute(): string
    {
        $address = $this->street_address;
        if ($this->building_number) {
            $address .= ', Building ' . $this->building_number;
        }
        if ($this->neighborhood) {
            $address .= ', ' . $this->neighborhood;
        }
        $address .= ', ' . $this->city . ', ' . $this->governorate;
        return $address;
    }

    /**
     * Get Google Maps URL
     */
    public function getGoogleMapsUrlAttribute(): string
    {
        return "https://www.google.com/maps?q={$this->latitude},{$this->longitude}";
    }
}
