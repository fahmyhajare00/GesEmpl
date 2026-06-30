<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            'chef_de_pole',
            'formateur',
            'stagiaire',
            'gestionnaire_stagiaires',
            'directeur_pedagogique'
        ];

        foreach ($roles as $role) {
            User::firstOrCreate(
                ['email' => $role . '@example.com'],
                [
                    'name' => ucfirst(str_replace('_', ' ', $role)),
                    'role' => $role,
                    'password' => Hash::make('password123'),
                ]
            );
        }
    }
}
