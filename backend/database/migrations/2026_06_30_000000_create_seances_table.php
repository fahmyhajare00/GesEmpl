<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seances', function (Blueprint $table) {
            $table->id();
            $table->string('module');
            $table->string('formateur');
            $table->string('groupe')->nullable();
            $table->string('salle');
            $table->string('day');
            $table->integer('slotIdx');
            $table->string('type')->default('presentiel');
            $table->string('status')->default('en_attente'); // en_attente, validee, refusee
            $table->string('annee')->nullable();
            $table->string('filiere')->nullable();
            $table->string('pole');
            $table->string('weekKey')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seances');
    }
};
