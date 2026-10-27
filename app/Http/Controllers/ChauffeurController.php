<?php

namespace App\Http\Controllers;

use App\Models\Chauffeur;
use Illuminate\Http\Request;
use Inertia\Inertia;


class ChauffeurController extends Controller
{
    public function index()
    {
        $chauffeurs = Chauffeur::orderBy('nom')->get();

        return Inertia::render('Chauffeurs/Index', [
            'chauffeurs' => $chauffeurs,
        ]);
    }

    public function create()
    {
        return Inertia::render('Chauffeurs/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => ['required', 'string', 'max:100'],
            'telephone' => ['required', 'string', 'max:15'],
            'nmero_permis' => ['nullable', 'string', 'max:25'],
        ]);

        Chauffeur::create($validated);

        return redirect()
            ->route('chauffeurs.index')
            ->with('success', 'Cahuffeur ajouté avec succés.');
    }

    public function edit(Chauffeur $chauffeur)
    {
        return Inertia::render('Chauffeurs/Edit', [
            'chauffeur' => $chauffeur,
        ]);
    }

    public function update(Request $request, Chauffeur $chauffeur)
    {
        $validated = $request->validate([
            'nom' => ['required', 'string', 'max:100'],
            'telephone' => ['required', 'string', 'max:100'],
            'numero_permis' => ['nullable', 'string', 'max:25'],
        ]);

        $chauffeur->update($validated);

        return redirect()
            ->route('chauffeurs.index')
            ->with('success', 'chauffeur modifié avec succès.');
    }

    public function destroy(Chauffeur $chauffeur)
    {
        $chauffeur->delete();

        return redirect()
            ->route('chauffeurs.index')
            ->with('success', 'Chauffeur supprimé avec succès.');
    }
}
