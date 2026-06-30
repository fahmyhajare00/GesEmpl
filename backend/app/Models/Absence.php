<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Absence extends Model
{
    use HasFactory;

    protected $fillable = [
        'stagiaire_id',
        'seance_id',
        'date',
        'justifiee',
        'motif',
        // Legacy fields (kept for compatibility)
        'module_id',
        'date_absence',
        'duree_heures',
        'est_justifiee',
    ];

    protected $casts = [
        'justifiee'    => 'boolean',
        'est_justifiee' => 'boolean',
    ];

    public function stagiaire()
    {
        return $this->belongsTo(StagiaireProfile::class, 'stagiaire_id');
    }

    public function seance()
    {
        return $this->belongsTo(Seance::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
