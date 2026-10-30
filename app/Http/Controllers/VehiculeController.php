<?php

namespace App\Http\Controllers;

use App\Models\Vehicule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VehiculeController extends Controller
{
    public function index()
    {
        $vehicules = Vehicule::all();

        return Inertia::render('Vehicules/Index', [
            'vehicules' => $vehicules,
        ]);
    }

    public function create()
    {
        return Inertia::render('Vehicules/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'immatriculation' => ['required', 'string', 'max:30', 'unique:vehicules,immatriculation'],
            'type' => ['required', 'in:moto,voiture,car'],
            'marque' => ['nullable', 'string', 'max:50'],
            'modele' => ['nullable', 'string', 'max:50'],
            'statut' => ['required', 'in:actif,immobilise,inactif'],
        ]);

        Vehicule::create($validated);

        return redirect()
            ->route('vehicules.index')
            ->with('success', 'Véhicule enregistré avec succès.');
    }

    public function edit(Vehicule $vehicule)
    {
        return Inertia::render('Vehicules/Edit', [
            'vehicule' => $vehicule,
        ]);
    }

    public function update(Request $request, Vehicule $vehicule)
    {
        $validated = $request->validate([
            'immatriculation' => ['required', 'string', 'max:30', 'unique:vehicules,immatriculation,' . $vehicule->id],
            'type' => ['required', 'in:moto,voiture,car'],
            'marque' =>  ['nullable', 'string', 'max:50'],
            'modele' => ['nullable', 'string', 'max:50'],
            'statut' => ['required', 'in:actif,immobilise,inactif'],
        ]);

        $vehicule->update($validated);

        return redirect()
            ->route('vehicules.index')
            ->with('success', 'Véhicule modifié avec succés');
    }

    public function destroy(Vehicule $vehicule)
    {
        if (
            $vehicule->contrats()->exists() ||
            $vehicule->depenses()->exists() ||
            $vehicule->pannes()->exists() ||
            $vehicule->entretiens()->exists() ||
            $vehicule->documents()->exists()
        ) {
            return redirect()
                ->route('vehicules.index')
                ->with('success', 'Véhicule supprimé avec succès');
        }

        $vehicule->delete();

        return redirect()
            ->route('vehicules.index')
            ->with('success', 'Véhicule supprimé avec succès');
    }
}
