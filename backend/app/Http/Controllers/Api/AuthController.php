<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.'],
            ]);
        }

        // Revoke all previous tokens
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        // Load associated profile
        $profile = null;
        if ($user->role === 'formateur') {
            $profile = $user->formateurProfile;
        } elseif ($user->role === 'stagiaire') {
            $profile = $user->stagiaireProfile?->load('groupe');
        }

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'      => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
                'role'    => $user->role,
                'pole'    => $user->pole,
                'profile' => $profile,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Déconnecté avec succès.']);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        $profile = null;
        if ($user->role === 'formateur') {
            $profile = $user->formateurProfile;
        } elseif ($user->role === 'stagiaire') {
            $profile = $user->stagiaireProfile?->load('groupe');
        }

        return response()->json([
            'id'      => $user->id,
            'name'    => $user->name,
            'email'   => $user->email,
            'role'    => $user->role,
            'pole'    => $user->pole,
            'profile' => $profile,
        ]);
    }
}
