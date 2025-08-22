<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Store;
use App\Observers\StoreObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Use custom PersonalAccessToken model for Sanctum (optional)
        // Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);

        // Register model observers
        Store::observe(StoreObserver::class);

        // Add any other boot logic here
    }
}
