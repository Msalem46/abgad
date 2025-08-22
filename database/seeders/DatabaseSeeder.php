<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('Starting database seeding...');

        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            StoreSeeder::class,
            MenuSeeder::class,
        ]);

        $this->command->info('Database seeding completed successfully!');
        $this->command->line('');
        $this->command->info('🎉 Your store viewing system is ready!');
        $this->command->line('');
        $this->command->info('Default Login Credentials:');
        $this->command->line('Admin: admin@storeview.jo / password');
        $this->command->line('Store Owner: owner@storeview.jo / password');
        $this->command->line('');
        $this->command->info('API Base URL: http://localhost:8000/api');
    }
}
