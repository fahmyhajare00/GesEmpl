<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Ajouter champs code/description/duree_heures à modules
        Schema::table('modules', function (Blueprint $table) {
            if (!Schema::hasColumn('modules', 'code')) {
                $table->string('code')->nullable()->unique();
            }
            if (!Schema::hasColumn('modules', 'description')) {
                $table->text('description')->nullable();
            }
            if (!Schema::hasColumn('modules', 'duree_heures')) {
                $table->integer('duree_heures')->nullable();
            }
        });

        // Ajouter champ pole à users (pour identifier le pôle du formateur/chef)
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'pole')) {
                $table->string('pole')->nullable();
            }
        });

        // Ajouter champ role à users si pas encore présent
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'role')) {
                $table->string('role')->default('stagiaire');
            }
        });
    }

    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->dropColumn(['code', 'description', 'duree_heures']);
        });
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('pole');
        });
    }
};
