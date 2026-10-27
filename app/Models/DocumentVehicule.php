<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentVehicule extends Model
{
    protected $fillable = [
        'vehicule_id',
        'type',
        'date_debut',
        'date_expiration',
        'montant',
        'photo'
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_expiration' => 'date',
        'montant' => 'decimal:2',
    ];

    public function vehicule()
    {
        return $this->belongsTo(Vehicule::class);
    }
}
