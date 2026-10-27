<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicules', function (Blueprint $table) {
            $table->id();
            $table->string('immatriculation', 30)->unique();
            $table->enum('type', ['moto', 'voiture', 'car']);
            $table->string('marque', 50)->nullable();
            $table->string('modele', 50)->nullable();
            $table->enum('statut', ['actif', 'immobilise', 'inactif'])->default('actif');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicules');
    }
};
