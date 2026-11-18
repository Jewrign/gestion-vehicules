<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('depenses', function (Blueprint $table) {
            $table->foreignId('versement_id')
                ->nullable()
                ->after('vehicule_id')
                ->constrained('versements')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('depenses', function (Blueprint $table) {
            $table->dropForeign(['versement_id']);
            $table->dropColumn('versement_id');
        });
    }
};
