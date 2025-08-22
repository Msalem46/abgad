<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @param  string  $resource
     * @param  string  $action
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next, string $resource, string $action)
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $user = auth()->user();

        if (!$user->hasPermission($resource, $action)) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Access denied. Insufficient permissions.',
                    'required_permission' => "$action on $resource"
                ], 403);
            }

            abort(403, 'Access denied. Insufficient permissions.');
        }

        return $next($request);
    }
}
