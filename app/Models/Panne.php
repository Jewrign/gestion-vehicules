<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Panne extends Model
{
    protected $fillable = [
        'vehicule_id',
        'date',
        'description',
        'jour_complet',
    ];

    protected $casts = [
        'date' => 'date',
        'jour_complet' => 'boolean',
    ];

    public function vehicule()
    {
        return $this->belongsTo(Vehicule::class);
    }
}
