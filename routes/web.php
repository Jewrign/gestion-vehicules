<?php

use App\Http\Controllers\ChauffeurController;
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
    ->name('chauffeurs.index');

Route::get('chauffeurs/create', [ChauffeurController::class, 'create'])
    ->name('chauffeurs.create');


Route::post('/chauffeurs', [ChauffeurController::class, 'store'])
    ->name('chauffeurs.store');


Route::get('/chauffeurs/{chauffeur}/edit', [ChauffeurController::class, 'edit'])
    ->name('chauffeurs.edit');


Route::put('chauffeurs/{chauffeur}', [ChauffeurController::class, 'update'])
    ->name('chauffeurs.update');

Route::delete('chauffeurs/{chauffeur}', [ChauffeurController::class, 'destroy'])
    ->name('chauffeurs.destroy');

require __DIR__ . '/settings.php';
