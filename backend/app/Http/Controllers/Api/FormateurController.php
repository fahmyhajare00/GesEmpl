<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Seance;
use App\Models\AffectationFormateur;
use Illuminate\Http\Request;

class FormateurController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();
        $formateurName = $user->name;
        $formateurProfile = $user->formateurProfile;

        // Ses séances
        $seances = Seance::where('formateur', $formateurName)->get();

        $stats = [
            'total'      => $seances->count(),
            'validees'   => $seances->where('status', 'validee')->count(),
            'en_attente' => $seances->where('status', 'en_attente')->count(),
            'refusees'   => $seances->where('status', 'refusee')->count(),
        ];

        // Ses affectations (groupes et modules assignés)
        $affectations = $formateurProfile
            ? AffectationFormateur::where('formateur_id', $formateurProfile->id)
                ->with(['groupe.filiere', 'module'])
                ->get()
            : collect();

        return response()->json([
            'user'        => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
                'pole'  => $user->pole,
            ],
            'stats'       => $stats,
            'seances'     => $seances,
            'affectations'=> $affectations,
        ]);
    }
}
