<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Versement extends Model
{
    protected $fillable = [
        'contrat_id',
        'periode_debut',
        'periode_fin',
        'montant_normal',
        'montant_jours_non_payables',
        'montant_deductions',
        'montant_arriere',
        'montant_du',
        'montant_paye',
        'nouvel_arriere',
        'statut',
    ];

    protected $casts = [
        'periode_debut' => 'date',
        'periode_fin' => 'date',
        'montant_normal' => 'decimal:2',
        'montant_jours_non_payables' => 'decimal:2',
        'montant_deductions' => 'decimal:2',
        'montant_arriere' => 'decimal:2',
        'montant_du' => 'decimal:2',
        'montant_paye' => 'decimal:2',
        'nouvel_arriere' => 'decimal:2',
    ];

    public function contrat()
    {
        return $this->belongsTo(Contrat::class);
    }
}
