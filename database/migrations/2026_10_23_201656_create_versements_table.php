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
        Schema::create('versements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contrat_id')->constrained('contrats')->restrictOnDelete();
            $table->date('periode_debut');
            $table->date('periode_fin');
            $table->decimal('montant_normal', 10, 2)->default(0);
            $table->decimal('montant_jours_non_payables', 10, 2)->default(0);
            $table->decimal('montant_deductions', 10, 2)->default(0);
            $table->decimal('montant_arriere', 10, 2)->default(0);
            $table->decimal('montant_du', 10, 2)->default(0);
            $table->decimal('montant_paye', 10, 2)->default(0);
            $table->decimal('nouvel_arriere', 10, 2)->default(0);
            $table->enum('statut', ['en_attente', 'partiel', 'paye'])->default('en_attente');
            $table->timestamps();
            $table->unique(
                ['contrat_id', 'periode_debut', 'periode_fin'],
                'versements_contrat_periode_unique'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('versements');
    }
};
