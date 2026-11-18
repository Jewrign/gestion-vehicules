<?php

namespace App\Http\Controllers;

use App\Models\Contrat;
use App\Models\Versement;
use App\Services\CalculVersementService;
use App\Services\PeriodeVersementService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Depense;
use Illuminate\Support\Facades\DB;

class VersementController extends Controller
{
    public function index()
    {
        $versements = Versement::with([
            'contrat.chauffeur',
            'contrat.vehicule',
        ])
            ->latest('periode_fin')
            ->get();

        return Inertia::render('Versements/Index', [
            'versements' => $versements,
        ]);
    }

    public function create(PeriodeVersementService $periodeService)
    {
        $contrats = Contrat::with([
            'chauffeur',
            'vehicule',
        ])
            ->where('statut', 'actif')
            ->get();

        return Inertia::render('Versements/Create', [
            'contrats' => $contrats,
        ]);
    }


    public function prochainePeriode(
        Request $request,
        PeriodeVersementService $periodeService
    ) {
        $validated = $request->validate([
            'contrat_id' => ['required', 'exists:contrats,id'],
        ]);

        $contrat = Contrat::with('vehicule')
            ->findOrFail($validated['contrat_id']);

        if ($contrat->statut !== 'actif') {
            return response()->json([
                'message' => 'Ce contrat est terminé.',
            ], 422);
        }

        $periode = $periodeService->periodeSuivante($contrat);

        $depenses = Depense::query()
            ->where('vehicule_id', $contrat->vehicule_id)
            ->whereBetween('date', [
                $periode['debut']->format('Y-m-d'),
                $periode['fin']->format('Y-m-d'),
            ])
            ->whereDate('date', '>=', $contrat->date_debut)
            ->when(
                $contrat->date_fin,
                fn($query) => $query->whereDate(
                    'date',
                    '<=',
                    $contrat->date_fin
                )
            )
            ->where('deductible', true)
            ->where('montant_deduit', '>', 0)
            ->whereNull('versement_id')
            ->get();

        return response()->json([
            'debut' => $periode['debut']->format('Y-m-d'),
            'fin' => $periode['fin']->format('Y-m-d'),
            'montant_deductions' => (float) $depenses->sum('montant_deduit'),
            'depenses' => $depenses->map(fn($depense) => [
                'id' => $depense->id,
                'type' => $depense->type,
                'description' => $depense->description,
                'date' => $depense->date->format('Y-m-d'),
                'montant_deduit' => (float) $depense->montant_deduit,
            ])->values(),
        ]);
    }

    public function store(
        Request $request,
        CalculVersementService $calculService,
        PeriodeVersementService $periodeService
    ) {
        $validated = $request->validate([
            'contrat_id' => ['required', 'exists:contrats,id'],
            'periode_debut' => ['required', 'date'],
            'periode_fin' => ['required', 'date', 'after_or_equal:periode_debut'],
            'montant_paye' => ['nullable', 'numeric', 'min:0'],
        ]);

        $contrat = Contrat::with('vehicule')
            ->findOrFail($validated['contrat_id']);

        if ($contrat->statut !== 'actif') {
            return back()
                ->withErrors([
                    'contrat_id' => 'Ce contrat est terminé.',
                ])
                ->withInput();
        }

        $existe = Versement::where('contrat_id', $contrat->id)
            ->where('periode_debut', $validated['periode_debut'])
            ->where('periode_fin', $validated['periode_fin'])
            ->exists();

        if ($existe) {
            return back()
                ->withErrors([
                    'periode_debut' => 'Un versement existe déjà pour cette période.',
                ])
                ->withInput();
        }

        $versement = DB::transaction(function () use (
            $contrat,
            $validated,
            $calculService
        ) {
            // Récupérer les dépenses déductibles non encore affectées.
            $depenses = Depense::query()
                ->where('vehicule_id', $contrat->vehicule_id)
                ->whereBetween('date', [
                    $validated['periode_debut'],
                    $validated['periode_fin'],
                ])
                ->whereDate('date', '>=', $contrat->date_debut)
                ->when(
                    $contrat->date_fin,
                    fn($query) => $query->whereDate(
                        'date',
                        '<=',
                        $contrat->date_fin
                    )
                )
                ->where('deductible', true)
                ->where('montant_deduit', '>', 0)
                ->whereNull('versement_id')
                ->lockForUpdate()
                ->get();

            // Calculer automatiquement le total des déductions.
            $montantDeductions = (float) $depenses->sum('montant_deduit');

            $dernierVersement = $contrat->versements()
                ->latest('periode_fin')
                ->first();

            $montantArriere = $dernierVersement?->nouvel_arriere ?? 0;

            // Calculer le versement.
            $resultat = $calculService->calculer(
                $contrat,
                \Carbon\Carbon::parse($validated['periode_debut']),
                \Carbon\Carbon::parse($validated['periode_fin']),
                (float) $montantArriere,
                $montantDeductions,
                (float) ($validated['montant_paye'] ?? 0)
            );

            // Enregistrer le versement.
            $versement = $contrat->versements()->create([
                'periode_debut' => $validated['periode_debut'],
                'periode_fin' => $validated['periode_fin'],
                'montant_normal' => $resultat['montant_normal'],
                'montant_jours_non_payables' => $resultat['montant_jours_non_payables'],
                'montant_deductions' => $resultat['montant_deductions'],
                'montant_arriere' => $resultat['montant_arriere'],
                'montant_du' => $resultat['montant_du'],
                'montant_paye' => $resultat['montant_paye'],
                'nouvel_arriere' => $resultat['nouvel_arriere'],
                'statut' => $resultat['statut'],
            ]);

            // Affecter les dépenses à ce versement.
            foreach ($depenses as $depense) {
                $depense->update([
                    'versement_id' => $versement->id,
                ]);
            }

            return $versement;
        });

        return redirect()
            ->route('versements.index')
            ->with('success', 'Versement créé avec succès.');
    }

    public function show(Versement $versement)
    {
        $versement->load([
            'contrat.chauffeur',
            'contrat.vehicule',
        ]);

        return Inertia::render('Versements/Show', [
            'versement' => $versement,
        ]);
    }
}
