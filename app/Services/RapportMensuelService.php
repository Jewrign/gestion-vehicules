<?php

namespace App\Services;

use App\Models\Depense;
use App\Models\Contrat;
use Carbon\CarbonImmutable;

class RapportMensuelService
{
  /**
   * Calcule les données des versements pour un mois donné,
   * contrat par contrat.
   */
  public function calculerVersements(int $mois, int $annee): array
  {
    $debutMois = CarbonImmutable::create($annee, $mois, 1)
      ->startOfMonth();

    $finMois = $debutMois->endOfMonth();

    $contrats = Contrat::query()
      ->with([
        'chauffeur',
        'vehicule',
        'versements' => function ($query) use ($finMois) {
          $query
            ->whereDate('periode_debut', '<=', $finMois)
            ->orderBy('periode_debut');
        },
      ])
      ->whereDate('date_debut', '<=', $finMois)
      ->where(function ($query) use ($debutMois, $finMois) {
        $query
          ->whereNull('date_fin')
          ->orWhereDate('date_fin', '>=', $debutMois)
          ->orWhereHas('versements', function ($versements) use ($finMois) {
            $versements->whereDate(
              'periode_debut',
              '<=',
              $finMois
            );
          });
      })
      ->get();

    $resultats = [];

    foreach ($contrats as $contrat) {
      $versements = $contrat->versements;

      $montantNormal = 0;
      $montantJoursNonPayables = 0;
      $montantDeductions = 0;
      $montantPaye = 0;

      foreach ($versements as $versement) {
        $debutPeriode = $versement->periode_debut;
        $finPeriode = $versement->periode_fin;

        // Ignorer les périodes qui ne chevauchent pas le mois.
        if (
          $finPeriode->lt($debutMois)
          || $debutPeriode->gt($finMois)
        ) {
          continue;
        }

        $debutPartie = $debutPeriode->gt($debutMois)
          ? $debutPeriode
          : $debutMois;

        $finPartie = $finPeriode->lt($finMois)
          ? $finPeriode
          : $finMois;

        $joursPeriode = $debutPeriode->diffInDays($finPeriode) + 1;

        $joursDansMois = $debutPartie->diffInDays($finPartie) + 1;

        $montantNormal += $this->repartirMontant(
          (float) $versement->montant_normal,
          $joursPeriode,
          $joursDansMois
        );

        $montantJoursNonPayables += $this->repartirMontant(
          (float) $versement->montant_jours_non_payables,
          $joursPeriode,
          $joursDansMois
        );

        $montantDeductions += $this->repartirMontant(
          (float) $versement->montant_deductions,
          $joursPeriode,
          $joursDansMois
        );

        $montantPaye += $this->repartirMontant(
          (float) $versement->montant_paye,
          $joursPeriode,
          $joursDansMois
        );
      }

      $arriereInitial = $this->calculerArriereInitial(
        $versements,
        $debutMois
      );

      $arriereFinal = $this->calculerArriereFinal(
        $versements,
        $debutMois,
        $finMois,
        $arriereInitial
      );

      $montantNet = $montantNormal
        - $montantJoursNonPayables
        - $montantDeductions;

      $resultats[] = [
        'contrat_id' => $contrat->id,

        'chauffeur_id' => $contrat->chauffeur_id,

        'chauffeur' => $contrat->chauffeur->nom,

        'vehicule' => $contrat->vehicule->immatriculation,

        'montant_normal' => round($montantNormal, 2),

        'montant_jours_non_payables' => round(
          $montantJoursNonPayables,
          2
        ),

        'montant_deductions' => round($montantDeductions, 2),

        'montant_net' => round($montantNet, 2),

        'montant_paye' => round($montantPaye, 2),

        'montant_du_mois' => round(
          $arriereInitial + $montantNet,
          2
        ),

        'arriere_initial' => round($arriereInitial, 2),

        'arriere_final' => round($arriereFinal, 2),
      ];
    }

    return [
      'mois' => $debutMois->format('Y-m'),
      'debut' => $debutMois->toDateString(),
      'fin' => $finMois->toDateString(),
      'contrats' => $resultats,
    ];
  }



  /**
   * Génère le rapport mensuel complet regroupé par chauffeur.
   */
  public function genererRapportMensuel(int $mois, int $annee): array
  {
    // Récupérer les deux calculs déjà existants.
    $versements = $this->calculerVersements($mois, $annee);
    $depenses = $this->calculerDepenses($mois, $annee);

    // Indexer les dépenses par contrat.
    $depensesParContrat = collect($depenses['contrats'])
      ->keyBy('contrat_id');

    // Regrouper les versements par chauffeur.
    $contratsParChauffeur = collect($versements['contrats'])
      ->groupBy('chauffeur_id');

    $resultats = [];

    foreach ($contratsParChauffeur as $chauffeurId => $contrats) {
      $premierContrat = $contrats->first();

      $totaux = [
        'montant_normal' => 0,
        'montant_jours_non_payables' => 0,
        'montant_deductions' => 0,
        'montant_net' => 0,
        'montant_paye' => 0,
        'montant_du_mois' => 0,
        'arriere_initial' => 0,
        'arriere_final' => 0,
        'total_depenses' => 0,
        'total_deduit' => 0,
        'total_non_deduit' => 0,
        'nombre_depenses' => 0,
      ];

      $detailsContrats = [];

      foreach ($contrats as $contrat) {
        // Récupérer les dépenses de ce contrat.
        $depense = $depensesParContrat->get(
          $contrat['contrat_id'],
          [
            'total_depenses' => 0,
            'total_deduit' => 0,
            'total_non_deduit' => 0,
            'nombre_depenses' => 0,
          ]
        );

        // Associer les dépenses au détail du contrat.
        $detailsContrats[] = array_merge($contrat, [
          'total_depenses' => $depense['total_depenses'],
          'total_deduit' => $depense['total_deduit'],
          'total_non_deduit' => $depense['total_non_deduit'],
          'nombre_depenses' => $depense['nombre_depenses'],
        ]);

        // Additionner les montants du versement.
        foreach (
          [
            'montant_normal',
            'montant_jours_non_payables',
            'montant_deductions',
            'montant_net',
            'montant_paye',
            'montant_du_mois',
            'arriere_initial',
            'arriere_final',
          ] as $champ
        ) {
          $totaux[$champ] += $contrat[$champ];
        }

        // Additionner les dépenses.
        $totaux['total_depenses'] += $depense['total_depenses'];
        $totaux['total_deduit'] += $depense['total_deduit'];
        $totaux['total_non_deduit'] += $depense['total_non_deduit'];
        $totaux['nombre_depenses'] += $depense['nombre_depenses'];
      }

      // Arrondir les montants à deux décimales.
      foreach ($totaux as $champ => $valeur) {
        if ($champ !== 'nombre_depenses') {
          $totaux[$champ] = round($valeur, 2);
        }
      }

      $resultats[] = [
        'chauffeur_id' => (int) $chauffeurId,
        'chauffeur' => $premierContrat['chauffeur'],
        'nombre_contrats' => $contrats->count(),
        'totaux' => $totaux,
        'contrats' => $detailsContrats,
      ];
    }

    return [
      'mois' => $versements['mois'],
      'debut' => $versements['debut'],
      'fin' => $versements['fin'],
      'chauffeurs' => $resultats,
      'depenses_non_attribuees' => $depenses['non_attribuees'],
      'depenses_ambigues' => $depenses['ambigues'],
    ];
  }



  /**
   * Récupère et attribue les dépenses du mois aux contrats
   * qui couvraient les véhicules à la date de chaque dépense.
   */
  public function calculerDepenses(int $mois, int $annee): array
  {
    $debutMois = CarbonImmutable::create($annee, $mois, 1)
      ->startOfMonth();

    $finMois = $debutMois->endOfMonth();

    // Récupérer les dépenses du mois.
    $depenses = Depense::query()
      ->whereBetween('date', [
        $debutMois->toDateString(),
        $finMois->toDateString(),
      ])
      ->get();

    // Charger les contrats susceptibles de couvrir le mois.
    $contrats = Contrat::query()
      ->with('chauffeur')
      ->whereDate('date_debut', '<=', $finMois)
      ->where(function ($query) use ($debutMois) {
        $query->whereNull('date_fin')
          ->orWhereDate('date_fin', '>=', $debutMois);
      })
      ->get()
      ->groupBy('vehicule_id');

    $totauxParContrat = [];
    $nonAttribuees = [];
    $ambigues = [];

    foreach ($depenses as $depense) {
      $dateDepense = $depense->date;

      // Rechercher les contrats qui couvrent cette date.
      $contratsCorrespondants = $contrats
        ->get($depense->vehicule_id, collect())
        ->filter(function ($contrat) use ($dateDepense) {
          return $contrat->date_debut->lte($dateDepense)
            && (
              $contrat->date_fin === null
              || $contrat->date_fin->gte($dateDepense)
            );
        })
        ->values();

      // Aucun contrat : dépense non attribuée.
      if ($contratsCorrespondants->isEmpty()) {
        $nonAttribuees[] = [
          'depense_id' => $depense->id,
          'vehicule_id' => $depense->vehicule_id,
          'date' => $dateDepense->toDateString(),
          'montant' => (float) $depense->montant,
        ];

        continue;
      }

      // Plusieurs contrats : attribution ambiguë.
      if ($contratsCorrespondants->count() > 1) {
        $ambigues[] = [
          'depense_id' => $depense->id,
          'vehicule_id' => $depense->vehicule_id,
          'date' => $dateDepense->toDateString(),
          'contrats' => $contratsCorrespondants
            ->pluck('id')
            ->all(),
        ];

        continue;
      }

      // Un seul contrat : attribution confirmée.
      $contrat = $contratsCorrespondants->first();
      $contratId = $contrat->id;

      if (!isset($totauxParContrat[$contratId])) {
        $totauxParContrat[$contratId] = [
          'contrat_id' => $contratId,
          'chauffeur_id' => $contrat->chauffeur_id,
          'chauffeur' => $contrat->chauffeur->nom,
          'total_depenses' => 0,
          'total_deduit' => 0,
          'total_non_deduit' => 0,
          'nombre_depenses' => 0,
        ];
      }

      $montant = (float) $depense->montant;
      $montantDeduit = (float) $depense->montant_deduit;

      $totauxParContrat[$contratId]['total_depenses'] += $montant;
      $totauxParContrat[$contratId]['total_deduit'] += $montantDeduit;
      $totauxParContrat[$contratId]['total_non_deduit'] += (
        $montant - $montantDeduit
      );
      $totauxParContrat[$contratId]['nombre_depenses']++;
    }

    return [
      'mois' => $debutMois->format('Y-m'),
      'contrats' => array_values($totauxParContrat),
      'non_attribuees' => $nonAttribuees,
      'ambigues' => $ambigues,
    ];
  }



  /**
   * Répartit un montant selon le nombre de jours couverts.
   */
  private function repartirMontant(
    float $montant,
    int $joursPeriode,
    int $joursDansMois
  ): float {
    if ($joursPeriode <= 0) {
      return 0;
    }

    return $montant * ($joursDansMois / $joursPeriode);
  }

  /**
   * Calcule l'arriéré à la veille du premier jour du mois.
   */
  private function calculerArriereInitial(
    $versements,
    CarbonImmutable $debutMois
  ): float {
    $periodeEnCours = $versements->first(function ($versement) use ($debutMois) {
      return $versement->periode_debut->lte($debutMois)
        && $versement->periode_fin->gte($debutMois);
    });

    if ($periodeEnCours) {
      return $this->calculerSoldeIntermediaire(
        $periodeEnCours,
        $periodeEnCours->periode_debut
          ->diffInDays($debutMois)
      );
    }

    $dernierVersement = $versements
      ->filter(function ($versement) use ($debutMois) {
        return $versement->periode_fin->lt($debutMois);
      })
      ->last();

    return (float) ($dernierVersement?->nouvel_arriere ?? 0);
  }

  /**
   * Calcule l'arriéré à la fin du mois.
   */
  private function calculerArriereFinal(
    $versements,
    CarbonImmutable $debutMois,
    CarbonImmutable $finMois,
    float $arriereInitial
  ): float {
    $dernierVersement = $versements
      ->filter(function ($versement) use ($debutMois, $finMois) {
        return $versement->periode_debut->lte($finMois)
          && $versement->periode_fin->gte($debutMois);
      })
      ->last();

    if (!$dernierVersement) {
      return $arriereInitial;
    }

    // Si la période se termine pendant le mois,
    // on reprend le solde réellement enregistré.
    if ($dernierVersement->periode_fin->lte($finMois)) {
      return (float) $dernierVersement->nouvel_arriere;
    }

    // Si la période dépasse la fin du mois,
    // on calcule le solde intermédiaire au prorata.
    $joursEcoules = $dernierVersement->periode_debut
      ->diffInDays($finMois) + 1;

    return $this->calculerSoldeIntermediaire(
      $dernierVersement,
      $joursEcoules
    );
  }

  /**
   * Calcule un solde intermédiaire à l'intérieur d'une période.
   */
  private function calculerSoldeIntermediaire(
    $versement,
    int $joursEcoules
  ): float {
    $joursPeriode = $versement->periode_debut
      ->diffInDays($versement->periode_fin) + 1;

    if ($joursPeriode <= 0) {
      return (float) $versement->montant_arriere;
    }

    $montantNet = (float) $versement->montant_normal
      - (float) $versement->montant_jours_non_payables
      - (float) $versement->montant_deductions;

    $variationParJour = (
      $montantNet - (float) $versement->montant_paye
    ) / $joursPeriode;

    $solde = (float) $versement->montant_arriere
      + ($variationParJour * $joursEcoules);

    return max(0, $solde);
  }
}
