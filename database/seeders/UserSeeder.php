<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Create admin user
        $admin = User::updateOrCreate(
            ['email' => 'admin@storeview.jo'], // Find by email
            [
                'username' => 'admin',
                'password' => Hash::make('password'),
                'first_name' => 'System',
                'last_name' => 'Administrator',
                'phone' => '+962791234567',
                'is_active' => true,
                'email_verified' => true,
            ]
        );

        // Create sample store owner
        $storeOwner = User::updateOrCreate(
            ['email' => 'owner@storeview.jo'], // Find by email
            [
                'username' => 'store_owner_demo',
                'password' => Hash::make('password'),
                'first_name' => 'Ahmad',
                'last_name' => 'Al-Mahmoud',
                'phone' => '+962791234568',
                'is_active' => true,
                'email_verified' => true,
            ]
        );

        // Get roles
        $adminRole = Role::where('role_name', 'admin')->first();
        $storeOwnerRole = Role::where('role_name', 'store_owner')->first();

        if (!$adminRole || !$storeOwnerRole) {
            $this->command->error('Roles not found. Please ensure RoleSeeder has run successfully.');
            return;
        }

        // Assign admin role (fix column ambiguity by using pivot table name)
        if (!$admin->roles()->wherePivot('role_id', $adminRole->role_id)->exists()) {
            $admin->roles()->attach($adminRole->role_id, [
                'assigned_at' => now(),
                'assigned_by' => $admin->user_id
            ]);
            $this->command->info("Assigned admin role to {$admin->email}");
        } else {
            $this->command->info("Admin role already assigned to {$admin->email}");
        }

        // Assign store owner role (fix column ambiguity by using pivot table name)
        if (!$storeOwner->roles()->wherePivot('role_id', $storeOwnerRole->role_id)->exists()) {
            $storeOwner->roles()->attach($storeOwnerRole->role_id, [
                'assigned_at' => now(),
                'assigned_by' => $admin->user_id
            ]);
            $this->command->info("Assigned store_owner role to {$storeOwner->email}");
        } else {
            $this->command->info("Store owner role already assigned to {$storeOwner->email}");
        }

        $this->command->info('Users seeded successfully!');
        $this->command->info('Admin: admin@storeview.jo / password');
        $this->command->info('Store Owner: owner@storeview.jo / password');
    }
}
