<?php

namespace App\Http\Controllers;

use App\Models\Panne;
use App\Models\Vehicule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PanneController extends Controller
{
    public function index()
    {
        $pannes = Panne::with('vehicule')
            ->latest('date')
            ->get();

        return Inertia::render('Pannes/Index', [
            'pannes' => $pannes,
        ]);
    }

    public function create()
    {
        $vehicules = Vehicule::orderBy('immatriculation')->get();

        return Inertia::render('Pannes/Create', [
            'vehicules' => $vehicules,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicule_id' => 'required|exists:vehicules,id',
            'date' => 'required|date',
            'description' => 'nullable|string',
            'jour_complet' => 'required|boolean',
        ]);

        Panne::create($validated);

        return redirect()
            ->route('pannes.index')
            ->with('success', 'Panne enregistrée avec succès.');
    }

    public function edit(Panne $panne)
    {
        $vehicules = Vehicule::orderBy('immatriculation')->get();

        return Inertia::render('Pannes/Edit', [
            'panne' => [
                ...$panne->toArray(),
                'date' => $panne->date->format('Y-m-d'),
            ],
            'vehicules' => $vehicules,
        ]);
    }

    public function update(Request $request, Panne $panne)
    {
        $validated = $request->validate([
            'vehicule_id' => 'required|exists:vehicules,id',
            'date' => 'required|date',
            'description' => 'nullable|string',
            'jour_complet' => 'required|boolean',
        ]);

        $panne->update($validated);

        return redirect()
            ->route('pannes.index')
            ->with('success', 'Pannes modifiée avec succès.');
    }

    public function destroy(Panne $panne)
    {
        $panne->delete();

        return redirect()
            ->route('pannes.index')
            ->with('success', 'Panne supprimée avec succès.');
    }
}
