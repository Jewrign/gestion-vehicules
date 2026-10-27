<?php

namespace App\Services;

use App\Models\Contrat;
use Carbon\Carbon;

class CalculVersementService
{
  public function calculerMontantNormal(
    Contrat $contrat,
    Carbon $debut,
    Carbon $fin,
  ): float {
    $montant = 0;

    $date = $debut->copy();

    while ($date->lte($fin)) {
      if ($contrat->frequence === 'journalier') {

        if ($date->dayOfWeek !== Carbon::SUNDAY) {
          $montant += $contrat->montant_journalier;
        }
      } elseif ($contrat->frequence === 'hebdomadaire') {

        if (
          $date->dayOfWeek !== Carbon::SUNDAY
        ) {
          $montant += $contrat->montant_journalier;
        }
      }

      $date->addDay();
    }

    return $montant;
  }

  public function calculerMontantJoursNonPayables(
    Contrat $contrat,
    Carbon $debut,
    Carbon $fin,
  ): float {

    $montant = 0;

    $pannes = $contrat->vehicule
      ->pannes()
      ->whereBetween('date', [$debut, $fin])
      ->where('jour_complet', true)
      ->get();

    foreach ($pannes as $panne) {
      $montant += $contrat->montant_journalier;
    }

    return $montant;
  }

  public function calculerMontantVidangesNonPayables(
    Contrat $contrat,
    Carbon $debut,
    Carbon $fin,
  ): float {

    if ($contrat->vehicule->type !== 'moto') {
      return 0;
    }

    $vidanges = $contrat->vehicule
      ->entretiens()
      ->whereBetween('date', [$debut, $fin])
      ->where('type', 'vidange')
      ->get();

    return $vidanges->count() * $contrat->montant_journalier;
  }

  public function calculer(
    Contrat $contrat,
    Carbon $debut,
    Carbon $fin,
    float $montantArriere = 0,
    float $montantDeductions = 0,
    float $montantPaye = 0
  ): array {
    $montantNormal = $this->calculerMontantNormal(
      $contrat,
      $debut,
      $fin
    );

    $montantPannes = $this->calculerMontantJoursNonPayables(
      $contrat,
      $debut,
      $fin
    );

    $montantVidanges = $this->calculerMontantVidangesNonPayables(
      $contrat,
      $debut,
      $fin
    );

    $montantJoursNonPayables = $montantPannes + $montantVidanges;

    $montantDu = $montantNormal
      - $montantJoursNonPayables
      - $montantDeductions
      - $montantArriere;

    $nouvel_arriere = max(0, $montantDu - $montantPaye);

    if ($montantPaye <= 0) {
      $statut = 'en_attente';
    } elseif ($montantPaye < $montantDu) {
      $statut = 'partiel';
    } else {
      $statut = 'paye';
    }

    return [
      'montant_normal' => $montantNormal,
      'montant_pannes' => $montantPannes,
      'montant_vidanges' => $montantVidanges,
      'montant_jours_non_payables' => $montantJoursNonPayables,
      'montant_deductions' => $montantDeductions,
      'montant_arriere' => $montantArriere,
      'montant_du' => $montantDu,
      'montant_paye' => $montantPaye,
      'nouvel_arriere' => $nouvel_arriere,
      'statut' => $statut
    ];
  }

  public function creerVersement(
    Contrat $contrat,
    Carbon $debut,
    Carbon $fin,
    float $montantDeductions = 0,
    float $montantPaye = 0,
  ): \App\Models\Versement {

    $dernierVersement = $contrat->versements()
      ->latest('periode_fin')
      ->first();

    $montantArriere = $dernierVersement?->nouvel_arriere ?? 0;

    $resultat = $this->calculer(
      $contrat,
      $debut,
      $fin,
      $montantArriere,
      $montantDeductions,
      $montantPaye
    );

    return $contrat->versements()->create([
      'periode_debut' => $debut,
      'periode_fin' => $fin,
      'montant_normal' => $resultat['montant_normal'],
      'montant_jours_non_payables' => $resultat['montant_jours_non_payables'],
      'montant_deductions' => $resultat['montant_deductions'],
      'montant_arriere' => $resultat['montant_arriere'],
      'montant_du' => $resultat['montant_du'],
      'montant_paye' => $resultat['montant_paye'],
      'nouvel_arriere' => $resultat['nouvel_arriere'],
      'statut' => $resultat['statut'],
    ]);
  }
}
