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
        Schema::create('contrats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chauffeur_id')->constrained('chauffeurs')->restrictOnDelete();
            $table->foreignId('vehicule_id')->constrained('vehicules')->restrictOnDelete();
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            $table->decimal('montant_journalier', 10, 2);
            $table->enum('frequence', ['journalier', 'hebdomadaire']);
            $table->enum('jour_paiement', ['dimanche', 'lundi'])->nullable();
            $table->enum('statut', ['actif', 'termine'])->default('actif');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contrats');
    }
};
