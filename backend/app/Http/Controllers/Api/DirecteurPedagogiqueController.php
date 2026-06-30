<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Seance;
use App\Models\User;
use App\Models\Groupe;
use App\Models\Filiere;
use App\Models\Module;
use Illuminate\Http\Request;

class DirecteurPedagogiqueController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();

        // Stats globales séances
        $totalSeances   = Seance::count();
        $seancesValidees = Seance::where('status', 'validee')->count();
        $seancesEnAttente = Seance::where('status', 'en_attente')->count();
        $seancesRefusees  = Seance::where('status', 'refusee')->count();

        // Séances par pôle
        $seancesParPole = Seance::where('status', 'validee')
            ->selectRaw('pole, count(*) as total')
            ->groupBy('pole')
            ->pluck('total', 'pole');

        // Formateurs
        $totalFormateurs = User::where('role', 'formateur')->count();
        $formateursParPole = User::where('role', 'formateur')
            ->selectRaw('pole, count(*) as total')
            ->groupBy('pole')
            ->pluck('total', 'pole');

        // Stagiaires / Groupes / Filières
        $totalStagiaires = User::where('role', 'stagiaire')->count();
        $totalGroupes    = Groupe::count();
        $totalFilieres   = Filiere::count();
        $totalModules    = Module::count();

        // Toutes les séances validées pour planning global
        $seancesDetails = Seance::where('status', 'validee')
            ->orderBy('weekKey')
            ->get();

        return response()->json([
            'user'  => $user,
            'stats' => [
                'total_seances'         => $totalSeances,
                'seances_validees'      => $seancesValidees,
                'seances_en_attente'    => $seancesEnAttente,
                'seances_refusees'      => $seancesRefusees,
                'total_formateurs'      => $totalFormateurs,
                'total_stagiaires'      => $totalStagiaires,
                'total_groupes'         => $totalGroupes,
                'total_filieres'        => $totalFilieres,
                'total_modules'         => $totalModules,
            ],
            'seances_par_pole'   => $seancesParPole,
            'formateurs_par_pole'=> $formateursParPole,
            'seances'            => $seancesDetails,
        ]);
    }
}
