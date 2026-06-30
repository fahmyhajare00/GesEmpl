<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     * Usage: middleware('role:chef_de_pole') or middleware('role:chef_de_pole,formateur')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Non authentifié.'], 401);
        }

        if (! in_array($user->role, $roles)) {
            return response()->json([
                'message' => 'Accès interdit. Rôle requis : ' . implode(' ou ', $roles) . '. Votre rôle : ' . $user->role,
            ], 403);
        }

        return $next($request);
    }
}
