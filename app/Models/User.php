<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Add this import

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens; // Add HasApiTokens trait

    protected $table = 'users';
    protected $primaryKey = 'user_id';

    protected $fillable = [
        'username',
        'email',
        'password',
        'first_name',
        'last_name',
        'phone',
        'is_active',
        'email_verified',
        'last_login'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'email_verified' => 'boolean',
        'last_login' => 'datetime',
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Roles assigned to this user
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id')
            ->withPivot('assigned_at', 'assigned_by');
    }

    /**
     * Stores owned by this user
     */
    public function ownedStores(): HasMany
    {
        return $this->hasMany(Store::class, 'owner_id', 'user_id');
    }

    /**
     * Store photos uploaded by this user
     */
    public function uploadedPhotos(): HasMany
    {
        return $this->hasMany(StorePhoto::class, 'uploaded_by', 'user_id');
    }

    /**
     * Store visits by this user
     */
    public function storeVisits(): HasMany
    {
        return $this->hasMany(StoreVisit::class, 'user_id', 'user_id');
    }

    /**
     * Freelancer profile for this user
     */
    public function freelancer(): HasOne
    {
        return $this->hasOne(Freelancer::class, 'user_id', 'user_id');
    }

    /**
     * Get full name attribute
     */
    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * Check if user has specific role
     */
    public function hasRole(string $roleName): bool
    {
        return $this->roles()->where('role_name', $roleName)->exists();
    }

    /**
     * Check if user has permission
     */
    public function hasPermission(string $resource, string $action): bool
    {
        return $this->roles()->get()->some(function ($role) use ($resource, $action) {
            return $role->hasPermission($resource, $action);
        });
    }

    /**
     * Check if user owns a specific store
     */
    public function ownsStore(int $storeId): bool
    {
        return $this->ownedStores()->where('store_id', $storeId)->exists();
    }

    /**
     * Get stores accessible by the current user
     */
    public function getAccessibleStores()
    {
        // Admin can access all stores
        if ($this->hasRole('admin')) {
            return \App\Models\Store::query();
        }

        // Store owners can access their own stores
        if ($this->hasRole('store_owner')) {
            return $this->ownedStores();
        }

        // Store managers can access stores they manage
        if ($this->hasRole('store_manager')) {
            // You would need to implement store manager relationships
            // For now, return owned stores
            return $this->ownedStores();
        }

        // Regular users/viewers can only see verified stores
        return \App\Models\Store::where('is_verified', true)->where('is_active', true);
    }
}
