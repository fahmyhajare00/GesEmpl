<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }
        return response()->json($query->with(['stagiaireProfile.groupe', 'formateurProfile'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => ['required', Rule::in(['chef_de_pole', 'formateur', 'stagiaire', 'gestionnaire_stagiaires', 'directeur_pedagogique'])],
            'pole'     => 'nullable|string',
        ]);
        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);
        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        return response()->json($user->load(['stagiaireProfile.groupe', 'formateurProfile']));
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'     => 'sometimes|string',
            'email'    => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => 'sometimes|string|min:6',
            'role'     => ['sometimes', Rule::in(['chef_de_pole', 'formateur', 'stagiaire', 'gestionnaire_stagiaires', 'directeur_pedagogique'])],
            'pole'     => 'nullable|string',
        ]);
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }
        $user->update($validated);
        return response()->json($user);
    }

    public function destroy(User $user)
    {
        $user->tokens()->delete();
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé.']);
    }

    /**
     * Get all formateurs (for schedule dropdown)
     */
    public function formateurs()
    {
        return response()->json(
            User::where('role', 'formateur')
                ->with('formateurProfile')
                ->get(['id', 'name', 'email', 'pole'])
        );
    }

    /**
     * Get all stagiaires (for gestionnaire)
     */
    public function stagiaires()
    {
        return response()->json(
            User::where('role', 'stagiaire')
                ->with('stagiaireProfile.groupe.filiere')
                ->get()
        );
    }
}
