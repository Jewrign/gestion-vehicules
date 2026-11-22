<?php

namespace App\Http\Controllers;

use App\Services\RapportMensuelService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RapportMensuelController extends Controller
{
    public function index(Request $request, RapportMensuelService $rapportService)
    {
        $validated = $request->validate([
            'mois' => ['sometimes', 'required', 'integer', 'between:1,12'],
            'annee' => ['sometimes', 'required', 'integer', 'between:2000,2100']
        ]);

        $mois = (int) ($validated['mois'] ?? now()->month);
        $annee = (int) ($validated['annee'] ?? now()->year);

        $rapport = $rapportService->genererRapportMensuel(
            $mois,
            $annee
        );

        return Inertia::render('Rapports/Mensuel', [
            'rapport' => $rapport,
            'mois' => $mois,
            'annee' => $annee,
        ]);
    }
}
