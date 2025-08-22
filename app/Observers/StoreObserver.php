<?php
namespace App\Observers;

use App\Models\Store;
use Illuminate\Support\Str;

class StoreObserver
{
    /**
     * Handle the Store "creating" event.
     */
    public function creating(Store $store): void
    {
        if (!$store->owner_id) {
            $store->owner_id = auth()->id();
        }
    }

    /**
     * Handle the Store "created" event.
     */
    public function created(Store $store): void
    {
        // Log store creation
        \Log::info('Store created', [
            'store_id' => $store->store_id,
            'trading_name' => $store->trading_name,
            'owner_id' => $store->owner_id,
            'created_by' => auth()->id()
        ]);
    }

    /**
     * Handle the Store "updated" event.
     */
    public function updated(Store $store): void
    {
        // Check if verification status changed
        if ($store->wasChanged('is_verified') && $store->is_verified) {
            $store->verification_date = now();
            $store->saveQuietly(); // Prevent infinite loop

            // Send notification to owner
            // $store->owner->notify(new StoreVerifiedNotification($store));
        }
    }
}
