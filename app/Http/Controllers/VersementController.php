<?php

namespace App\Http\Controllers;

use App\Models\Contrat;
use App\Models\Versement;
use App\Services\CalculVersementService;
use App\Services\PeriodeVersementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

        return response()->json([
            'debut' => $periode['debut']->format('Y-m-d'),
            'fin' => $periode['fin']->format('Y-m-d'),
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
            'montant_deductions' => ['nullable', 'numeric', 'min:0'],
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

        // Vérifier qu'un versement identique n'existe pas déjà.
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

        $montantDeductions = (float) ($validated['montant_deductions'] ?? 0);
        $montantPaye = (float) ($validated['montant_paye'] ?? 0);

        $dernierVersement = $contrat->versements()
            ->latest('periode_fin')
            ->first();

        $montantArriere = $dernierVersement?->nouvel_arriere ?? 0;

        $resultat = $calculService->calculer(
            $contrat,
            \Carbon\Carbon::parse($validated['periode_debut']),
            \Carbon\Carbon::parse($validated['periode_fin']),
            (float) $montantArriere,
            $montantDeductions,
            $montantPaye
        );

        Versement::create([
            'contrat_id' => $contrat->id,
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
