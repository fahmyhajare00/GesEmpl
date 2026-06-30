<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use App\Models\StagiaireProfile;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    /**
     * Liste des notes - filtré selon le rôle
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Note::with(['stagiaire.user', 'module', 'formateur.user']);

        if ($user->role === 'stagiaire') {
            // Le stagiaire voit uniquement ses propres notes
            $profile = StagiaireProfile::where('user_id', $user->id)->firstOrFail();
            $query->where('stagiaire_id', $profile->id);
        } elseif ($user->role === 'formateur') {
            // Le formateur voit les notes qu'il a saisies
            $profile = $user->formateurProfile;
            $query->where('formateur_id', $profile->id);
        }
        // chef_de_pole, directeur, gestionnaire voient tout

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'stagiaire_id'    => 'required|exists:stagiaire_profiles,id',
            'module_id'       => 'required|exists:modules,id',
            'formateur_id'    => 'required|exists:formateur_profiles,id',
            'valeur_note'     => 'required|numeric|min:0|max:20',
            'date_evaluation' => 'required|date',
        ]);
        $note = Note::create($validated);
        return response()->json($note->load(['stagiaire.user', 'module', 'formateur.user']), 201);
    }

    public function show(Note $note)
    {
        return response()->json($note->load(['stagiaire.user', 'module', 'formateur.user']));
    }

    public function update(Request $request, Note $note)
    {
        $validated = $request->validate([
            'valeur_note'     => 'sometimes|numeric|min:0|max:20',
            'date_evaluation' => 'sometimes|date',
        ]);
        $note->update($validated);
        return response()->json($note);
    }

    public function destroy(Note $note)
    {
        $note->delete();
        return response()->json(['message' => 'Note supprimée.']);
    }
}
