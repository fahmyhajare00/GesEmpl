<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Groupe;
use Illuminate\Http\Request;

class GroupeController extends Controller
{
    public function index(Request $request)
    {
        $query = Groupe::with(['filiere'])->withCount('stagiaires');
        if ($request->has('filiere_id')) {
            $query->where('filiere_id', $request->filiere_id);
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom'           => 'required|string',
            'filiere_id'    => 'required|exists:filieres,id',
            'annee_scolaire'=> 'required|string',
        ]);
        $groupe = Groupe::create($validated);
        return response()->json($groupe->load('filiere'), 201);
    }

    public function show(Groupe $groupe)
    {
        return response()->json($groupe->load(['filiere', 'stagiaires.user']));
    }

    public function update(Request $request, Groupe $groupe)
    {
        $validated = $request->validate([
            'nom'           => 'sometimes|string',
            'filiere_id'    => 'sometimes|exists:filieres,id',
            'annee_scolaire'=> 'sometimes|string',
        ]);
        $groupe->update($validated);
        return response()->json($groupe->load('filiere'));
    }

    public function destroy(Groupe $groupe)
    {
        $groupe->delete();
        return response()->json(['message' => 'Groupe supprimé.']);
    }
}
