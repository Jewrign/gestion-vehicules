<?php

namespace App\Http\Controllers;

use App\Models\Chauffeur;
use App\Models\Contrat;
use App\Models\Vehicule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContratController extends Controller
{
    public function index()
    {
        $contrats = Contrat::with(['chauffeur', 'vehicule'])
            ->latest()
            ->get();

        return Inertia::render('Contrats/Index', [
            'contrats' => $contrats,
        ]);
    }

    public function create()
    {
        $chauffeurs = Chauffeur::where('statut', true)
            ->orderBy('nom')
            ->get();

        $vehicules = Vehicule::where('statut', 'actif')
            ->orderBy('immatriculation')
            ->get();

        return Inertia::render('Contrats/Create', [
            'chauffeurs' => $chauffeurs,
            'vehicules' => $vehicules,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'chauffeur_id' => ['required', 'exists:chauffeurs,id'],
            'vehicule_id' => ['required', 'exists:vehicules,id'],
            'date_debut' => ['required', 'date'],
        ]);

        $chauffeurDejaAffecte = Contrat::where('chauffeur_id', $validated['chauffeur_id'])
            ->where('statut', 'actif')
            ->exists();

        if ($chauffeurDejaAffecte) {
            return back()
                ->withErrors([
                    'chauffeur_id' => 'Ce chauffeur possède déjà un contrat actif.',
                ])
                ->withInput();
        }

        $vehicule = Vehicule::findOrFail($validated['vehicule_id']);

        // Détermination automatique selon le type de véhicule
        $montants = [
            'moto' => 3000,
            'voiture' => 10000,
            'car' => 15000,
        ];

        $montantJournalier = $montants[$vehicule->type];

        $frequence = in_array($vehicule->type, ['voiture', 'car'])
            ? 'hebdomadaire'
            : 'journalier';

        $jourPaiement = match ($vehicule->type) {
            'voiture' => 'dimanche',
            'car' => 'lundi',
            default => null,
        };

        // Un véhicule ne peut avoir qu'un contrat actif
        $contratActif = Contrat::where('vehicule_id', $vehicule->id)
            ->where('statut', 'actif')
            ->exists();

        if ($contratActif) {
            return back()
                ->withErrors([
                    'vehicule_id' => 'Ce véhicule possède déjà un contrat actif.',
                ])
                ->withInput();
        }

        $contrat = Contrat::create([
            'chauffeur_id' => $validated['chauffeur_id'],
            'vehicule_id' => $validated['vehicule_id'],
            'date_debut' => $validated['date_debut'],
            'montant_journalier' => $montantJournalier,
            'frequence' => $frequence,
            'jour_paiement' => $jourPaiement,
            'statut' => 'actif',
        ]);

        return redirect()
            ->route('contrats.index')
            ->with('success', 'Contrat créé avec succès.');
    }

    public function edit(Contrat $contrat)
    {
        $contrat->load(['chauffeur', 'vehicule']);

        $chauffeurs = Chauffeur::where('statut', true)
            ->orderBy('nom')
            ->get();

        return Inertia::render('Contrats/Edit', [
            'contrat' => $contrat,
            'chauffeurs' => $chauffeurs,
        ]);
    }

    public function update(Request $request, Contrat $contrat)
    {
        $validated = $request->validate([
            'chauffeur_id' => ['required', 'exists:chauffeurs,id'],
            'date_debut' => ['required', 'date'],
        ]);

        if ($contrat->statut !== 'actif') {
            return back()->with('error', 'Ce contrat est déjà terminé.');
        }

        $chauffeurDejaAffecte = Contrat::where('chauffeur_id', $validated['chauffeur_id'])
            ->where('statut', 'actif')
            ->where('id', '!=', $contrat->id)
            ->exists();

        if ($chauffeurDejaAffecte) {
            return back()
                ->withErrors([
                    'chauffeur_id' => 'Ce chauffeur possède déjà un contrat actif.',
                ])
                ->withInput();
        }

        $contrat->update([
            'chauffeur_id' => $validated['chauffeur_id'],
            'date_debut' => $validated['date_debut'],
        ]);

        return redirect()
            ->route('contrats.index')
            ->with('success', 'Contrat modifié avec succès.');
    }

    public function terminer(Contrat $contrat)
    {
        $contrat->update([
            'date_fin' => now()->toDateString(),
            'statut' => 'termine',
        ]);

        return redirect()
            ->route('contrats.index')
            ->with('success', 'Contrat terminé avec succès.');
    }
}
