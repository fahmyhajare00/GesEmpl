<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AffectationFormateur extends Model
{
    use HasFactory;

    protected $table = 'affectations_formateurs';

    protected $fillable = ['formateur_id', 'groupe_id', 'module_id'];

    public function formateur()
    {
        return $this->belongsTo(FormateurProfile::class, 'formateur_id');
    }

    public function groupe()
    {
        return $this->belongsTo(Groupe::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
