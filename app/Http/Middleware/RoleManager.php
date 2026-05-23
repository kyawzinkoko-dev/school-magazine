<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleManager
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    // app/Http/Middleware/RoleMiddleware.php

    public function handle(Request $request, Closure $next, $role)
    {
        if (!Auth::check() || $request->user()->role !== $role) {
            // Redirecting to '/' prevents the loop if they aren't authorized
            return redirect('/')->with('error', 'Unauthorized access.');
        }

        return $next($request);
    }
}
