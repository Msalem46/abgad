<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $roles = [
            [
                'role_name' => 'admin',
                'description' => 'System Administrator',
                'permissions' => [
                    'users' => ['create', 'read', 'update', 'delete'],
                    'stores' => ['create', 'read', 'update', 'delete', 'verify'],
                    'analytics' => ['read'],
                    'system' => ['manage']
                ]
            ],
            [
                'role_name' => 'store_owner',
                'description' => 'Store Owner',
                'permissions' => [
                    'stores' => ['create', 'read', 'update'],
                    'menu' => ['create', 'read', 'update', 'delete'],
                    'photos' => ['create', 'read', 'update', 'delete'],
                    'analytics' => ['read_own']
                ]
            ],
            [
                'role_name' => 'store_manager',
                'description' => 'Store Manager',
                'permissions' => [
                    'menu' => ['create', 'read', 'update', 'delete'],
                    'photos' => ['create', 'read', 'update', 'delete'],
                    'analytics' => ['read_own']
                ]
            ],
            [
                'role_name' => 'freelancer',
                'description' => 'Freelancer',
                'permissions' => [
                    'services' => ['create', 'read', 'update', 'delete'],
                    'portfolio' => ['create', 'read', 'update', 'delete'],
                    'profile' => ['read', 'update'],
                    'orders' => ['read', 'update'],
                    'analytics' => ['read_own']
                ]
            ],
            [
                'role_name' => 'tourism_provider',
                'description' => 'Tourism Service Provider',
                'permissions' => [
                    'tours' => ['create', 'read', 'update', 'delete'],
                    'tourism_profile' => ['create', 'read', 'update'],
                    'bookings' => ['read', 'update'],
                    'portfolio' => ['create', 'read', 'update', 'delete'],
                    'analytics' => ['read_own']
                ]
            ],
            [
                'role_name' => 'viewer',
                'description' => 'Public Viewer',
                'permissions' => [
                    'stores' => ['read'],
                    'services' => ['read'],
                    'tours' => ['read'],
                    'menu' => ['read'],
                    'photos' => ['read']
                ]
            ]
        ];

        foreach ($roles as $roleData) {
            Role::updateOrCreate(
                ['role_name' => $roleData['role_name']], // Find by role_name
                [
                    'description' => $roleData['description'],
                    'permissions' => $roleData['permissions']
                ]
            );
        }

        $this->command->info('Roles seeded successfully!');
    }
}
