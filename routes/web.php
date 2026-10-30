<?php

use App\Http\Controllers\ChauffeurController;
use App\Http\Controllers\VehiculeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VersementController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::post(
    '/contrats/{contrat}/versements',
    [VersementController::class, 'store']
)->name('versements.store');

Route::get(
    '/chauffeurs',
    [ChauffeurController::class, 'index']
)
    ->name('/chauffeurs.index');

Route::get('/chauffeurs/create', [ChauffeurController::class, 'create'])
    ->name('chauffeurs.create');


Route::post('/chauffeurs', [ChauffeurController::class, 'store'])
    ->name('chauffeurs.store');


Route::get('/chauffeurs/{chauffeur}/edit', [ChauffeurController::class, 'edit'])
    ->name('chauffeurs.edit');


Route::put('/chauffeurs/{chauffeur}', [ChauffeurController::class, 'update'])
    ->name('chauffeurs.update');

Route::delete('/chauffeurs/{chauffeur}', [ChauffeurController::class, 'destroy'])
    ->name('chauffeurs.destroy');

Route::get('/vehicules', [VehiculeController::class, 'index'])
    ->name('vehicules.index');

Route::get('/vehicules/create', [VehiculeController::class, 'create'])
    ->name('vehicules.create');

Route::post('/vehicules', [VehiculeController::class, 'store'])
    ->name('vehicules.store');

Route::get('/vehicules/{vehicule}/edit', [VehiculeController::class, 'edit'])
    ->name('vehicules.edit');

Route::put('/vehicules/{vehicule}', [VehiculeController::class, 'update'])
    ->name('vehicules.update');

Route::delete('vehicules/{vehicule}', [VehiculeController::class, 'destroy'])
    ->name('vehicules.destroy');

require __DIR__ . '/settings.php';
