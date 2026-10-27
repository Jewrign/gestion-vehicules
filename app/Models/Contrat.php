<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

class Contrat extends Model
{
    protected $fillable = [
        'chauffeur_id',
        'vehicule_id',
        'date_debut',
        'date_fin',
        'montant_journalier',
        'frequence',
        'jour_paiement',
        'statut'
    ];

    public function chauffeur()
    {
        return $this->belongsTo(Chauffeur::class);
    }

    public function vehicule()
    {
        return $this->belongsTo(Vehicule::class);
    }

    public function versements()
    {
        return $this->hasMany(Versement::class);
    }
}
