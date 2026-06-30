<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StagiaireProfile extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'groupe_id', 'date_naissance', 'matricule'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function groupe()
    {
        return $this->belongsTo(Groupe::class);
    }

    public function notes()
    {
        return $this->hasMany(Note::class, 'stagiaire_id');
    }

    public function absences()
    {
        return $this->hasMany(Absence::class, 'stagiaire_id');
    }
}
