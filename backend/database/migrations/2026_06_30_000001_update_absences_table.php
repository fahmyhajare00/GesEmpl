<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('absences', function (Blueprint $table) {
            // Ajouter les nouveaux champs manquants
            if (!Schema::hasColumn('absences', 'seance_id')) {
                $table->foreignId('seance_id')->nullable()->constrained('seances')->onDelete('set null');
            }
            if (!Schema::hasColumn('absences', 'date')) {
                $table->date('date')->nullable();
            }
            if (!Schema::hasColumn('absences', 'justifiee')) {
                $table->boolean('justifiee')->default(false);
            }
        });
    }

    public function down(): void
    {
        Schema::table('absences', function (Blueprint $table) {
            $table->dropColumn(['seance_id', 'date', 'justifiee']);
        });
    }
};
