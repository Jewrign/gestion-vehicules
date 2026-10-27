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

        if ($contrat->frequence === 'journalier') {

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

        if ($dernierVersement) {
            $debut = $dernierVersement->periode_fin
                ->copy()
                ->next(Carbon::MONDAY);
        } else {
            $debut = $contrat->date_debut->copy();
        }

        $fin = $debut->copy()->endOfWeek(Carbon::SATURDAY);

        return [
            'debut' => $debut,
            'fin' => $fin,
        ];
    }
}
