<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogApiActivity
{
    /**
     * Log API requests for monitoring and debugging
     */
    public function handle(Request $request, Closure $next)
    {
        $startTime = microtime(true);

        // Log request
        Log::info('API Request', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'user_id' => auth()->id(),
            'timestamp' => now()->toISOString()
        ]);

        $response = $next($request);

        $duration = round((microtime(true) - $startTime) * 1000, 2);

        // Log response
        Log::info('API Response', [
            'status' => $response->getStatusCode(),
            'duration_ms' => $duration,
            'memory_usage' => round(memory_get_peak_usage(true) / 1024 / 1024, 2) . 'MB'
        ]);

        return $response;
    }
}
