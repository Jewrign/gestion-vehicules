<?php

namespace App\Http\Controllers;

use App\Models\Entretien;
use App\Models\Vehicule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EntretienController extends Controller
{
    public function index()
    {
        $entretien = Entretien::with('vehicule')
            ->latest('date')
            ->get();

        return Inertia::render('Entretiens/Index', [
            'entretiens' => $entretien,
        ]);
    }

    public function create()
    {
        $vehicules = Vehicule::orderBy('immatriculation')->get();

        return Inertia::render('Entretiens/Create', [
            'vehicules' => $vehicules,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicule_id' => 'required|exists:vehicules,id',
            'type' => 'required|string|max:50',
            'date' => 'required|date',
            'montant' => 'required|numeric|min:0.01',
            'description' => 'nullable|string'
        ]);

        Entretien::create($validated);

        return redirect()
            ->route('entretiens.index')
            ->with('success', 'Entretien enregistré avec succès.');
    }

    public function edit(Entretien $entretien)
    {
        $vehicules = Vehicule::orderBy('immatriculation')->get();

        return Inertia::render('Entretiens/Edit', [
            'entretien' => [
                ...$entretien->toArray(),
                'date' => $entretien->date->format('Y-m-d'),
            ],
            'vehicules' => $vehicules
        ]);
    }

    public function update(Request $request, Entretien $entretien)
    {
        $validated = $request->validate([
            'vehicule_id' => 'required|exists:vehicules,id',
            'type' => 'required|string|max:50',
            'date' => 'required|date',
            'montant' => 'required|numeric|min:0.01',
            'description' => 'nullable|string'
        ]);

        $entretien->update($validated);

        return redirect()
            ->route('entretiens.index')
            ->with('success', 'Entretien modifié avec succès.');
    }

    public function destroy(Entretien $entretien)
    {
        $entretien->delete();

        return redirect()
            ->route('entretiens.index')
            ->with('success', 'Entretien supprimé aec succès.');
    }
}
