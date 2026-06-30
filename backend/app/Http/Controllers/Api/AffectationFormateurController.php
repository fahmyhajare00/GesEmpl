<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AffectationFormateur;
use Illuminate\Http\Request;

class AffectationFormateurController extends Controller
{
    public function index(Request $request)
    {
        $query = AffectationFormateur::with(['formateur.user', 'groupe.filiere', 'module']);

        if ($request->has('formateur_id')) {
            $query->where('formateur_id', $request->formateur_id);
        }
        if ($request->has('groupe_id')) {
            $query->where('groupe_id', $request->groupe_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'formateur_id' => 'required|exists:formateur_profiles,id',
            'groupe_id'    => 'required|exists:groupes,id',
            'module_id'    => 'required|exists:modules,id',
        ]);

        // Check for duplicate assignment
        $existing = AffectationFormateur::where($validated)->first();
        if ($existing) {
            return response()->json(['message' => 'Cette affectation existe déjà.'], 409);
        }

        $affectation = AffectationFormateur::create($validated);
        return response()->json($affectation->load(['formateur.user', 'groupe.filiere', 'module']), 201);
    }

    public function show(AffectationFormateur $affectationFormateur)
    {
        return response()->json($affectationFormateur->load(['formateur.user', 'groupe.filiere', 'module']));
    }

    public function destroy(AffectationFormateur $affectationFormateur)
    {
        $affectationFormateur->delete();
        return response()->json(['message' => 'Affectation supprimée.']);
    }
}
