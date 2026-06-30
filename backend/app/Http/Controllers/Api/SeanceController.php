<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Seance;
use Illuminate\Http\Request;

class SeanceController extends Controller
{
    /**
     * Display a listing of the resource.
     * - Formateur : only their own sessions
     * - Chef de Pôle : only their pole sessions
     * - Others (gestionnaire, directeur) : all sessions
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Seance::query();

        if ($user->role === 'formateur') {
            $query->where('formateur', $user->name);
        } elseif ($user->role === 'chef_de_pole' && $user->pole) {
            $query->where('pole', $user->pole);
        } elseif ($user->role === 'stagiaire') {
            // Stagiaire sees only validated sessions of their group
            $profile = $user->stagiaireProfile?->load('groupe');
            $groupeNom = $profile?->groupe?->nom;
            if ($groupeNom) {
                $query->where('groupe', $groupeNom)->where('status', 'validee');
            } else {
                return response()->json([]);
            }
        }

        // Filter by weekKey if provided
        if ($request->has('weekKey')) {
            $query->where('weekKey', $request->weekKey);
        }
        if ($request->has('pole')) {
            $query->where('pole', $request->pole);
        }

        return response()->json($query->orderBy('weekKey')->orderBy('slotIdx')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'module' => 'required|string',
            'formateur' => 'required|string',
            'groupe' => 'nullable|string',
            'salle' => 'required|string',
            'day' => 'required|string',
            'slotIdx' => 'required|integer',
            'type' => 'nullable|string',
            'status' => 'nullable|string',
            'annee' => 'nullable|string',
            'filiere' => 'nullable|string',
            'pole' => 'required|string',
            'weekKey' => 'nullable|string'
        ]);

        $seance = Seance::create($validated);

        return response()->json($seance, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Seance $seance)
    {
        return response()->json($seance);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Seance $seance)
    {
        $validated = $request->validate([
            'module' => 'sometimes|string',
            'formateur' => 'sometimes|string',
            'groupe' => 'nullable|string',
            'salle' => 'sometimes|string',
            'day' => 'sometimes|string',
            'slotIdx' => 'sometimes|integer',
            'type' => 'nullable|string',
            'status' => 'nullable|string',
            'annee' => 'nullable|string',
            'filiere' => 'nullable|string',
            'pole' => 'sometimes|string',
            'weekKey' => 'nullable|string'
        ]);

        $seance->update($validated);

        return response()->json($seance);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Seance $seance)
    {
        $seance->delete();
        return response()->json(['message' => 'Seance deleted successfully']);
    }

    /**
     * Accept a seance (Chef de Pôle action)
     */
    public function accept(Seance $seance)
    {
        $seance->update(['status' => 'validee']);
        return response()->json($seance);
    }

    /**
     * Reject a seance (Chef de Pôle action)
     */
    public function reject(Seance $seance)
    {
        $seance->update(['status' => 'refusee']);
        return response()->json($seance);
    }
}
