<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\StagiaireProfile;
use App\Models\Groupe;
use App\Models\Filiere;
use App\Models\Module;
use App\Models\Absence;
use Illuminate\Http\Request;

class GestionnaireStagiairesController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();

        // Listes complètes
        $stagiaires = User::where('role', 'stagiaire')
            ->with('stagiaireProfile.groupe.filiere')
            ->get();

        $groupes  = Groupe::with(['filiere'])->withCount('stagiaires')->get();
        $filieres = Filiere::withCount('groupes')->get();
        $modules  = Module::all();

        // Stats globales absences du mois en cours
        $debutMois = now()->startOfMonth()->toDateString();
        $finMois   = now()->endOfMonth()->toDateString();
        $absencesMois = Absence::whereBetween('date', [$debutMois, $finMois])
            ->with('stagiaire.user')
            ->get();

        return response()->json([
            'user'    => $user,
            'stats'   => [
                'total_stagiaires' => $stagiaires->count(),
                'total_groupes'    => $groupes->count(),
                'total_filieres'   => $filieres->count(),
                'total_modules'    => $modules->count(),
                'absences_ce_mois' => $absencesMois->count(),
            ],
            'stagiaires'      => $stagiaires,
            'groupes'         => $groupes,
            'filieres'        => $filieres,
            'modules'         => $modules,
            'absences_mois'   => $absencesMois,
        ]);
    }
}
