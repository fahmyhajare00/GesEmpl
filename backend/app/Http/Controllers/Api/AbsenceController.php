<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Absence;
use App\Models\StagiaireProfile;
use Illuminate\Http\Request;

class AbsenceController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Absence::with(['stagiaire.user', 'seance']);

        if ($user->role === 'stagiaire') {
            $profile = StagiaireProfile::where('user_id', $user->id)->firstOrFail();
            $query->where('stagiaire_id', $profile->id);
        }

        return response()->json($query->orderByDesc('created_at')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'stagiaire_id' => 'required|exists:stagiaire_profiles,id',
            'seance_id'    => 'nullable|exists:seances,id',
            'date'         => 'required|date',
            'justifiee'    => 'boolean',
            'motif'        => 'nullable|string',
        ]);
        $validated['justifiee'] = $validated['justifiee'] ?? false;
        $absence = Absence::create($validated);
        return response()->json($absence->load(['stagiaire.user', 'seance']), 201);
    }

    public function show(Absence $absence)
    {
        return response()->json($absence->load(['stagiaire.user', 'seance']));
    }

    public function update(Request $request, Absence $absence)
    {
        $validated = $request->validate([
            'justifiee' => 'sometimes|boolean',
            'motif'     => 'nullable|string',
        ]);
        $absence->update($validated);
        return response()->json($absence);
    }

    public function destroy(Absence $absence)
    {
        $absence->delete();
        return response()->json(['message' => 'Absence supprimée.']);
    }
}
