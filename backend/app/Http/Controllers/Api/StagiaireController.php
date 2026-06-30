<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Seance;
use App\Models\Note;
use App\Models\Absence;
use App\Models\StagiaireProfile;
use Illuminate\Http\Request;

class StagiaireController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();
        $profile = StagiaireProfile::where('user_id', $user->id)
            ->with(['groupe.filiere'])
            ->first();

        if (! $profile) {
            return response()->json([
                'user'    => $user,
                'profile' => null,
                'message' => 'Profil stagiaire non configuré.',
            ]);
        }

        // Emploi du temps du groupe du stagiaire
        $seances = Seance::where('groupe', $profile->groupe?->nom)
            ->where('status', 'validee')
            ->orderBy('weekKey')
            ->get();

        // Ses notes avec calcul de la moyenne
        $notes = Note::where('stagiaire_id', $profile->id)
            ->with(['module', 'formateur.user'])
            ->get();
        $moyenneGenerale = $notes->count() > 0
            ? round($notes->avg('valeur_note'), 2)
            : null;

        // Ses absences
        $absences = Absence::where('stagiaire_id', $profile->id)
            ->orderByDesc('date')
            ->get();
        $totalAbsences   = $absences->count();
        $absencesJustif  = $absences->where('justifiee', true)->count();
        $absencesNonJust = $absences->where('justifiee', false)->count();

        return response()->json([
            'user'              => [
                'id'        => $user->id,
                'name'      => $user->name,
                'email'     => $user->email,
                'matricule' => $profile->matricule,
            ],
            'groupe'            => $profile->groupe,
            'filiere'           => $profile->groupe?->filiere,
            'stats'             => [
                'total_seances'       => $seances->count(),
                'moyenne_generale'    => $moyenneGenerale,
                'total_absences'      => $totalAbsences,
                'absences_justifiees' => $absencesJustif,
                'absences_non_just'   => $absencesNonJust,
            ],
            'seances'           => $seances,
            'notes'             => $notes,
            'absences'          => $absences,
        ]);
    }
}
