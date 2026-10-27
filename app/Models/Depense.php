<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Depense extends Model
{
    protected $fillable = [
        'vehicule_id',
        'type',
        'description',
        'montant',
        'date',
        'deductible',
        'montant_deduit'
    ];

    protected $casts = [
        'date' => 'date',
        'deductible' => 'boolean',
        'montant' => 'decimal:2',
        'montant_deduit' => 'decimal:2'
    ];

    public function vehicule()
    {
        return $this->belongsTo(Vehicule::class);
    }
}
