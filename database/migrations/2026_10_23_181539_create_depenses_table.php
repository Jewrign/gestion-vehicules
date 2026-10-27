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
        Schema::create('depenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicule_id')->constrained('vehicules')->restrictOnDelete();
            $table->string('type', 50);
            $table->text('description')->nullable();
            $table->decimal('montant', 10, 2);
            $table->date('date');
            $table->boolean('deductible')->default(false);
            $table->decimal('montant_deduit', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('depenses');
    }
};
