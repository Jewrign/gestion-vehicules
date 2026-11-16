<?php

namespace App\Http\Controllers;

use App\Models\DocumentVehicule;
use App\Models\Vehicule;
use Dom\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentVehiculeController extends Controller
{
    public function index()
    {
        $documents = DocumentVehicule::with('vehicule')
            ->orderBy('date_expiration')
            ->get();

        return Inertia::render('DocumentsVehicules/Index', [
            'documents' => $documents,
        ]);
    }

    public function create()
    {
        return Inertia::render('DocumentsVehicules/Create', [
            'vehicules' => Vehicule::orderBy('immatriculation')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicule_id' => 'required|exists:vehicules,id',
            'type' => 'required|in:assurance,visite_technique',
            'date_debut' => 'nullable|date',
            'date_expiration' => 'required|date',
            'montant' => 'required|numeric|min:0',
            'photo' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')
                ->store('documents-vehicules', 'public');
        }

        DocumentVehicule::create($validated);

        return redirect()
            ->route('documents-vehicules.index')
            ->with('success', 'Document ajouté avec succès.');
    }

    public function edit(DocumentVehicule $documents_vehicule)
    {
        return Inertia::render('DocumentsVehicules/Edit', [
            'document' => [
                ...$documents_vehicule->toArray(),
                'date_debut' => $documents_vehicule->date_debut?->format('Y-m-d'),
                'date_expiration' => $documents_vehicule->date_expiration?->format('Y-m-d')
            ],
            'vehicules' => Vehicule::orderBy('immatriculation')->get(),
        ]);
    }

    public function update(Request $request, DocumentVehicule $documents_vehicule)
    {
        $validated = $request->validate([
            'vehicule_id' => 'required|exists:vehicules,id',
            'type' => 'required|in:assurance,visite_technique',
            'date_debut' => 'nullable|date',
            'date_expiration' => 'required|date',
            'montant' => 'required|numeric|min:0',
            'photo' => 'nullable|image|max:5120',
        ]);

        unset($validated['photo']);

        if ($request->hasFile('photo')) {
            if ($documents_vehicule->photo) {
                Storage::disk('public')->delete($documents_vehicule->photo);
            }

            $validated['photo'] = $request->file('photo')
                ->store('documents-vehicules', 'public');
        }

        $documents_vehicule->update($validated);

        return redirect()
            ->route('documents-vehicules.index')
            ->with('success', 'Document modifié avec succès.');
    }

    public function destroy(DocumentVehicule $documents_vehicule)
    {
        if ($documents_vehicule->photo) {
            Storage::disk('public')->delete($documents_vehicule->photo);
        }

        $documents_vehicule->delete();

        return redirect()
            ->route('documents-vehicules.index')
            ->with('success', 'Document supprimé avec succès.');
    }
}
