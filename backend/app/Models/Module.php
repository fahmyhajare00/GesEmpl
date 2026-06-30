<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'coefficient', 'filiere_id', 'code', 'description', 'duree_heures'];

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }
}
