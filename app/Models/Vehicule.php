<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicule extends Model
{
    protected $fillable = [
        'immatriculation',
        'type',
        'marque',
        'modele',
        'statut'
    ];

    public function contrats()
    {
        return $this->hasMany(Contrat::class);
    }

    public function depenses()
    {
        return $this->hasMany(Depense::class);
    }

    public function pannes()
    {
        return $this->hasMany(Panne::class);
    }

    public function entretiens()
    {
        return $this->hasMany(Entretien::class);
    }
    public function documents()
    {
        return $this->hasMany(DocumentVehicule::class);
    }
}
