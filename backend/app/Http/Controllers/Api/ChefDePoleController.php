<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Seance;
use App\Models\User;
use Illuminate\Http\Request;

class ChefDePoleController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();
        $pole = $user->pole;

        // Séances filtrées par pôle du chef
        $baseQuery = Seance::when($pole, fn($q) => $q->where('pole', $pole));

        $seancesEnAttente = (clone $baseQuery)->where('status', 'en_attente')->get();
        $seancesValidees  = (clone $baseQuery)->where('status', 'validee')->count();
        $seancesRefusees  = (clone $baseQuery)->where('status', 'refusee')->count();
        $totalSeances     = (clone $baseQuery)->count();

        // Formateurs de ce pôle
        $formateurs = User::where('role', 'formateur')
            ->when($pole, fn($q) => $q->where('pole', $pole))
            ->with('formateurProfile')
            ->get(['id', 'name', 'email', 'pole']);

        // Séances de la semaine courante en attente (pour validation)
        $enAttenteDetails = $seancesEnAttente->map(fn($s) => [
            'id'        => $s->id,
            'module'    => $s->module,
            'formateur' => $s->formateur,
            'groupe'    => $s->groupe,
            'salle'     => $s->salle,
            'day'       => $s->day,
            'slotIdx'   => $s->slotIdx,
            'weekKey'   => $s->weekKey,
            'type'      => $s->type,
            'pole'      => $s->pole,
            'status'    => $s->status,
        ]);

        return response()->json([
            'user'              => $user,
            'pole'              => $pole,
            'stats'             => [
                'total_seances'    => $totalSeances,
                'en_attente'       => $seancesEnAttente->count(),
                'validees'         => $seancesValidees,
                'refusees'         => $seancesRefusees,
                'total_formateurs' => $formateurs->count(),
            ],
            'seances_en_attente' => $enAttenteDetails,
            'formateurs'         => $formateurs,
        ]);
    }
}
