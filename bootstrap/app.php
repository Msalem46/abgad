<?php
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// Import your custom middleware classes
use App\Http\Middleware\CheckPermission;
use App\Http\Middleware\CheckRole;
use App\Http\Middleware\CheckStoreOwnership;
use App\Http\Middleware\CheckStoreAccess;
use App\Http\Middleware\VerifyStoreAccess;
use App\Http\Middleware\TrackStoreVisit;
use App\Http\Middleware\RateLimitByUser;
use App\Http\Middleware\LogApiActivity;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php', // Add API routes
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {

        // Global middleware (applied to all requests)
        $middleware->append([
            // Add any global middleware here if needed
        ]);

        // Web middleware group (for web routes)
        $middleware->web(append: [
            // Add web-specific middleware here
        ]);

        // API middleware group (for API routes)
        $middleware->api(prepend: [
            // Add API-specific middleware here
            LogApiActivity::class, // Log all API requests
        ]);

        // Register route-specific middleware aliases
        $middleware->alias([
            'permission' => CheckPermission::class,
            'role' => CheckRole::class,
            'store.owner' => CheckStoreOwnership::class,
            'store.access' => CheckStoreAccess::class,
            'store.verify' => VerifyStoreAccess::class,
            'store.track' => TrackStoreVisit::class,
            'rate.user' => RateLimitByUser::class,
            'log.api' => LogApiActivity::class,
        ]);

        // Middleware groups (you can define custom groups)
        $middleware->group('store-management', [
            'auth:sanctum',
            'store.owner',
            'log.api'
        ]);

        $middleware->group('admin-only', [
            'auth:sanctum',
            'role:admin',
            'log.api'
        ]);

        $middleware->group('public-store', [
            'store.verify:true',
            'store.track',
            'rate.user:200,1'
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Custom exception handling
        $exceptions->render(function (Illuminate\Auth\Access\AuthorizationException $e) {
            if (request()->expectsJson()) {
                return response()->json([
                    'message' => 'Access denied. Insufficient permissions.',
                    'error' => $e->getMessage()
                ], 403);
            }
            return response()->view('errors.403', [], 403);
        });

        $exceptions->render(function (Illuminate\Auth\AuthenticationException $e) {
            if (request()->expectsJson()) {
                return response()->json([
                    'message' => 'Unauthenticated.',
                    'error' => 'Please log in to access this resource.'
                ], 401);
            }
            return redirect()->route('login');
        });

        $exceptions->render(function (Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            if (request()->expectsJson()) {
                return response()->json([
                    'message' => 'Resource not found.',
                    'error' => 'The requested resource does not exist.'
                ], 404);
            }
            return response()->view('errors.404', [], 404);
        });
    })->create();
