<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $user = auth()->user();
        $userRoles = $user->roles->pluck('role_name')->toArray();

        $hasRole = false;
        foreach ($roles as $role) {
            if (in_array($role, $userRoles)) {
                $hasRole = true;
                break;
            }
        }

        if (!$hasRole) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Access denied. Required role: ' . implode(' or ', $roles),
                    'user_roles' => $userRoles,
                    'required_roles' => $roles
                ], 403);
            }

            abort(403, 'Access denied. Insufficient role privileges.');
        }

        return $next($request);
    }
}
