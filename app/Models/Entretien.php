<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entretien extends Model
{
    protected $fillable = [
        'vehicule_id',
        'type',
        'date',
        'montant',
        'description'
    ];

    protected $casts = [
        'date' => 'date',
        'montant' => 'decimal:2'
    ];

    public function vehicule()
    {
        return $this->belongsTo(Vehicule::class);
    }
}
