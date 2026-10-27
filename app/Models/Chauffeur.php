<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chauffeur extends Model
{
    protected $fillable = [
        'nom',
        'telephone',
        'numero_permis',
        'statut'
    ];

    public function contrats()
    {
        return $this->hasMany(Contrat::class);
    }
}
