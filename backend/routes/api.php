<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChefDePoleController;
use App\Http\Controllers\Api\FormateurController;
use App\Http\Controllers\Api\StagiaireController;
use App\Http\Controllers\Api\GestionnaireStagiairesController;
use App\Http\Controllers\Api\DirecteurPedagogiqueController;
use App\Http\Controllers\Api\SeanceController;
use App\Http\Controllers\Api\FiliereController;
use App\Http\Controllers\Api\GroupeController;
use App\Http\Controllers\Api\ModuleController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\AbsenceController;
use App\Http\Controllers\Api\AffectationFormateurController;

// ─── Routes publiques ───────────────────────────────────────────────────────
Route::post('/login', [AuthController::class, 'login']);

// ─── Routes protégées (Sanctum) ──────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Authentification
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // ── Séances (tous les utilisateurs authentifiés) ──────────────────────────
    Route::get('/seances', [SeanceController::class, 'index']);
    Route::post('/seances', [SeanceController::class, 'store']);
    Route::get('/seances/{seance}', [SeanceController::class, 'show']);
    Route::put('/seances/{seance}', [SeanceController::class, 'update']);
    Route::delete('/seances/{seance}', [SeanceController::class, 'destroy']);
    // Validation / Refus (Chef de Pôle seulement)
    Route::put('/seances/{seance}/accept', [SeanceController::class, 'accept'])
        ->middleware('role:chef_de_pole');
    Route::put('/seances/{seance}/reject', [SeanceController::class, 'reject'])
        ->middleware('role:chef_de_pole');

    // ── Notes (formateur : créer/modifier, stagiaire : consulter) ─────────────
    Route::apiResource('notes', NoteController::class);

    // ── Absences ─────────────────────────────────────────────────────────────
    Route::apiResource('absences', AbsenceController::class);

    // ── Lecture des données de référence (tous les authentifiés) ──────────────
    Route::get('/filieres', [FiliereController::class, 'index']);
    Route::get('/filieres/{filiere}', [FiliereController::class, 'show']);
    Route::get('/groupes', [GroupeController::class, 'index']);
    Route::get('/groupes/{groupe}', [GroupeController::class, 'show']);
    Route::get('/modules', [ModuleController::class, 'index']);
    Route::get('/modules/{module}', [ModuleController::class, 'show']);
    Route::get('/affectations', [AffectationFormateurController::class, 'index']);
    Route::get('/users/formateurs', [UserController::class, 'formateurs']);

    // ── Chef de Pôle ─────────────────────────────────────────────────────────
    Route::middleware('role:chef_de_pole')->prefix('chef-de-pole')->group(function () {
        Route::get('/dashboard', [ChefDePoleController::class, 'dashboard']);
    });

    // ── Formateur ─────────────────────────────────────────────────────────────
    Route::middleware('role:formateur')->prefix('formateur')->group(function () {
        Route::get('/dashboard', [FormateurController::class, 'dashboard']);
    });

    // ── Stagiaire ─────────────────────────────────────────────────────────────
    Route::middleware('role:stagiaire')->prefix('stagiaire')->group(function () {
        Route::get('/dashboard', [StagiaireController::class, 'dashboard']);
    });

    // ── Gestionnaire des Stagiaires ───────────────────────────────────────────
    Route::middleware('role:gestionnaire_stagiaires')->prefix('gestionnaire-stagiaires')->group(function () {
        Route::get('/dashboard', [GestionnaireStagiairesController::class, 'dashboard']);
        // CRUD stagiaires
        Route::get('/stagiaires', [UserController::class, 'stagiaires']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
        // CRUD données de référence
        Route::post('/filieres', [FiliereController::class, 'store']);
        Route::put('/filieres/{filiere}', [FiliereController::class, 'update']);
        Route::delete('/filieres/{filiere}', [FiliereController::class, 'destroy']);
        Route::post('/groupes', [GroupeController::class, 'store']);
        Route::put('/groupes/{groupe}', [GroupeController::class, 'update']);
        Route::delete('/groupes/{groupe}', [GroupeController::class, 'destroy']);
        Route::post('/modules', [ModuleController::class, 'store']);
        Route::put('/modules/{module}', [ModuleController::class, 'update']);
        Route::delete('/modules/{module}', [ModuleController::class, 'destroy']);
    });

    // ── Directeur Pédagogique ─────────────────────────────────────────────────
    Route::middleware('role:directeur_pedagogique')->prefix('directeur-pedagogique')->group(function () {
        Route::get('/dashboard', [DirecteurPedagogiqueController::class, 'dashboard']);
    });

    // ── Affectations formateurs (Chef de pôle + Gestionnaire) ─────────────────
    Route::middleware('role:chef_de_pole,gestionnaire_stagiaires')->group(function () {
        Route::post('/affectations', [AffectationFormateurController::class, 'store']);
        Route::delete('/affectations/{affectationFormateur}', [AffectationFormateurController::class, 'destroy']);
    });

    // ── Administration des utilisateurs (accès gestionnaire ou directeur) ─────
    Route::middleware('role:gestionnaire_stagiaires,directeur_pedagogique')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{user}', [UserController::class, 'show']);
    });
});
