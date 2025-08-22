<?php
namespace App\Policies;

use App\Models\Store;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class StorePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any stores.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('read', 'stores');
    }

    /**
     * Determine whether the user can view the store.
     */
    public function view(User $user, Store $store): bool
    {
        return $user->can('read', 'stores') || $user->ownsStore($store->store_id);
    }

    /**
     * Determine whether the user can create stores.
     */
    public function create(User $user): bool
    {
        return $user->can('create', 'stores');
    }

    /**
     * Determine whether the user can update the store.
     */
    public function update(User $user, Store $store): bool
    {
        return $user->can('update', 'stores') || $user->ownsStore($store->store_id);
    }

    /**
     * Determine whether the user can delete the store.
     */
    public function delete(User $user, Store $store): bool
    {
        return $user->can('delete', 'stores') || $user->ownsStore($store->store_id);
    }

    /**
     * Determine whether the user can verify stores.
     */
    public function verify(User $user): bool
    {
        return $user->can('verify', 'stores');
    }

    /**
     * Determine whether the user can view analytics for the store.
     */
    public function viewAnalytics(User $user, Store $store): bool
    {
        if ($user->can('read', 'analytics')) {
            return true;
        }

        if ($user->can('read_own', 'analytics') && $user->ownsStore($store->store_id)) {
            return true;
        }

        return false;
    }
}
