<?php

namespace App\Services;

use App\Models\Contrat;
use Carbon\Carbon;

class PeriodeVersementService
{
    /**
     * Create a new class instance.
     */
    public function periodeSuivante(Contrat $contrat): array
    {
        $dernierVersement = $contrat->versements()
            ->latest('periode_fin')
            ->first();

        // Moto : une période correspond à une journée.
        if ($contrat->vehicule->type === 'moto') {
            if ($dernierVersement) {
                $debut = $dernierVersement->periode_fin
                    ->copy()
                    ->addDay();
            } else {
                $debut = $contrat->date_debut->copy();
            }

            return [
                'debut' => $debut,
                'fin' => $debut->copy(),
            ];
        }

        // Voiture et car : période du lundi au samedi.
        if ($dernierVersement) {
            $debut = $dernierVersement->periode_fin
                ->copy()
                ->addDay();

            // Si on tombe sur dimanche, on passe au lundi.
            if ($debut->dayOfWeek === Carbon::SUNDAY) {
                $debut->addDay();
            }
        } else {
            $debut = $contrat->date_debut->copy();

            // Si le contrat commence un dimanche,
            // le premier jour payable est le lundi.
            if ($debut->dayOfWeek === Carbon::SUNDAY) {
                $debut->addDay();
            }
        }

        $fin = $debut->copy()->next(Carbon::SUNDAY)->subDay();

        return [
            'debut' => $debut,
            'fin' => $fin,
        ];
    }
}
