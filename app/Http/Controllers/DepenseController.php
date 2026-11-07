<?php

namespace App\Http\Controllers;

use App\Models\Depense;
use App\Models\Vehicule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepenseController extends Controller
{
    /**
     * Afficher la liste des dépenses.
     */
    public function index()
    {
        $depenses = Depense::with('vehicule')
            ->latest('date')
            ->get();

        return Inertia::render('Depenses/Index', [
            'depenses' => $depenses,
        ]);
    }

    /**
     * Afficher le formulaire de création.
     */
    public function create()
    {
        $vehicules = Vehicule::orderBy('immatriculation')->get();

        return Inertia::render('Depenses/Create', [
            'vehicules' => $vehicules,
        ]);
    }

    /**
     * Enregistrer une nouvelle dépense.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicule_id' => ['required', 'exists:vehicules,id'],
            'type' => ['required', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'montant' => ['required', 'numeric', 'min:0.01'],
            'date' => ['required', 'date'],
            'deductible' => ['required', 'boolean'],
            'montant_deduit' => [
                'nullable',
                'numeric',
                'min:0',
                'lte:montant',
            ],
        ]);

        // Une dépense non déductible ne peut rien retirer au versement.
        if (!$request->boolean('deductible')) {
            $validated['montant_deduit'] = 0;
        } else {
            $validated['montant_deduit'] =
                $validated['montant_deduit'] ?? 0;
        }

        Depense::create($validated);

        return redirect()
            ->route('depenses.index')
            ->with('success', 'Dépense enregistrée avec succès.');
    }

    /**
     * Afficher le formulaire de modification.
     */
    public function edit(Depense $depense)
    {
        $vehicules = Vehicule::orderBy('immatriculation')->get();

        return Inertia::render('Depenses/Edit', [
            'depense' => [
                ...$depense->toArray(),
                'date' => $depense->date->format('Y-m-d'),
            ],
            'vehicules' => $vehicules,
        ]);
    }

    /**
     * Mettre à jour une dépense.
     */
    public function update(Request $request, Depense $depense)
    {
        $validated = $request->validate([
            'vehicule_id' => ['required', 'exists:vehicules,id'],
            'type' => ['required', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'montant' => ['required', 'numeric', 'min:0.01'],
            'date' => ['required', 'date'],
            'deductible' => ['required', 'boolean'],
            'montant_deduit' => [
                'nullable',
                'numeric',
                'min:0',
                'lte:montant',
            ],
        ]);

        if (!$request->boolean('deductible')) {
            $validated['montant_deduit'] = 0;
        } else {
            $validated['montant_deduit'] =
                $validated['montant_deduit'] ?? 0;
        }

        $depense->update($validated);

        return redirect()
            ->route('depenses.index')
            ->with('success', 'Dépense modifiée avec succès.');
    }

    /**
     * Supprimer une dépense.
     */
    public function destroy(Depense $depense)
    {
        $depense->delete();

        return redirect()
            ->route('depenses.index')
            ->with('success', 'Dépense supprimée avec succès.');
    }
}
