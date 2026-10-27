<?php

namespace App\Http\Controllers;

use App\Models\Contrat;
use App\Services\CalculVersementService;
use App\Services\PeriodeVersementService;
use Illuminate\Http\Request;

class VersementController extends Controller
{
    public function store(
        Request $request,
        Contrat $contrat,
        CalculVersementService $calculService,
        PeriodeVersementService $periodeService
    ) {
        $validated = $request->validate([
            'montant_deductions' => ['nullable', 'numeric', 'min:0'],
            'montant_paye' => ['nullable', 'numeric', 'min:0'],
        ]);

        $periode = $periodeService->periodeSuivante($contrat);

        $versement = $calculService->creerVersement(
            $contrat,
            $periode['debut'],
            $periode['fin'],
            $validated['montant_deductions'] ?? 0,
            $validated['montant_paye'] ?? 0,
        );

        return response()->json($versement);
    }
}
