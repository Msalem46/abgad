<?php
namespace App\Traits;

trait HasPermissions
{
    /**
     * Check if user has specific permission for a resource
     */
    public function can(string $action, string $resource = null): bool
    {
        if (!$resource) {
            // If no resource specified, check if user has the action permission on any resource
            return $this->roles()->get()->some(function ($role) use ($action) {
                $permissions = $role->permissions ?? [];
                foreach ($permissions as $resourcePerms) {
                    if (in_array($action, $resourcePerms)) {
                        return true;
                    }
                }
                return false;
            });
        }

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
     * Get accessible stores for this user
     */
    public function getAccessibleStores()
    {
        if ($this->hasRole('admin')) {
            return \App\Models\Store::all();
        }

        return $this->ownedStores;
    }
}
