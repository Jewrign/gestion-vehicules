<?php

namespace App\Http\Controllers;

use App\Models\Chauffeur;
use App\Models\Contrat;
use App\Models\Depense;
use App\Models\DocumentVehicule;
use App\Models\Vehicule;
use App\Models\Versement;
use App\Services\RapportMensuelService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(RapportMensuelService $rapportService)
    {
        $aujourdHui = Carbon::today();
        $debutMois = $aujourdHui->copy()->startOfMonth();
        $finMois = $aujourdHui->copy()->endOfMonth();

        // Indicateurs du parc
        $vehiculesActifs = Vehicule::where('statut', 'actif')->count();

        $vehiculesImmobilises = Vehicule::where('statut', 'immobilise')->count();

        $chauffeursActifs = Chauffeur::where('statut', true)->count();

        $contratsActifs = Contrat::where('statut', 'actif')
            ->whereDate('date_debut', '<=', $aujourdHui)
            ->where(function ($query) use ($aujourdHui) {
                $query->whereNull('date_fin')
                    ->orWhereDate('date_fin', '>=', $aujourdHui);
            })
            ->count();

        // Documents expirés ou arrivant à expiration dans les 30 jours
        $documentsAlerte = DocumentVehicule::with('vehicule')
            ->whereDate('date_expiration', '<=', $aujourdHui->copy()->addDays(30))
            ->orderBy('date_expiration')
            ->get()
            ->map(fn($document) => [
                'id' => $document->id,
                'type' => $document->type,
                'date_expiration' => $document->date_expiration->format('Y-m-d'),
                'immatriculation' => $document->vehicule?->immatriculation,
                'expire' => $document->date_expiration->lt($aujourdHui),
            ]);

        // Indicateurs financiers issus du rapport mensuel
        $rapport = $rapportService->genererRapportMensuel(
            $aujourdHui->month,
            $aujourdHui->year
        );

        $chauffeursRapport = collect($rapport['chauffeurs']);

        $versementsComptabilises = $chauffeursRapport->sum(
            fn($chauffeur) => $chauffeur['totaux']['montant_paye']
        );

        $obligationsNettes = $chauffeursRapport->sum(
            fn($chauffeur) => $chauffeur['totaux']['montant_net']
        );

        $depensesMois = Depense::whereBetween('date', [
            $debutMois->toDateString(),
            $finMois->toDateString(),
        ])->sum('montant');

        // Derniers versements
        $derniersVersements = Versement::with([
            'contrat.chauffeur',
            'contrat.vehicule',
        ])
            ->latest('created_at')
            ->limit(5)
            ->get();

        // Dernières dépenses
        $dernieresDepenses = Depense::with('vehicule')
            ->latest('date')
            ->limit(5)
            ->get();

        return Inertia::render('dashboard', [
            'statistiques' => [
                'vehicules_actifs' => $vehiculesActifs,
                'vehicules_immobilises' => $vehiculesImmobilises,
                'chauffeurs_actifs' => $chauffeursActifs,
                'contrats_actifs' => $contratsActifs,
                'versements_comptabilises' => round($versementsComptabilises, 2),
                'obligations_nettes' => round($obligationsNettes, 2),
                'depenses_mois' => round((float) $depensesMois, 2),
            ],
            'documents_alerte' => $documentsAlerte,
            'derniers_versements' => $derniersVersements,
            'dernieres_depenses' => $dernieresDepenses,
            'mois' => $aujourdHui->month,
            'annee' => $aujourdHui->year,
        ]);
    }
}
