<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Groupe extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'filiere_id', 'annee_scolaire'];

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    public function stagiaires()
    {
        return $this->hasMany(StagiaireProfile::class);
    }
}
