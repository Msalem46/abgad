<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Store;
use App\Models\StoreLocation;
use App\Models\User;

class StoreSeeder extends Seeder
{
    public function run()
    {
        $storeOwner = User::where('email', 'owner@storeview.jo')->first();

        if (!$storeOwner) {
            $this->command->error('Store owner not found. Please run UserSeeder first.');
            return;
        }

        // Create sample stores
        $stores = [
            [
                'owner_id' => $storeOwner->user_id,
                'trading_name' => 'مطعم الأصالة الأردنية',
                'national_id' => '9881234567890',
                'trading_license_number' => 'TL-AMM-2024-001',
                'commercial_registration_number' => 'CR-123456789',
                'tax_number' => 'TAX-987654321',
                'municipality_license' => 'MUN-AMM-2024-001',
                'health_permit' => 'HP-2024-001',
                'fire_safety_certificate' => 'FSC-2024-001',
                'description' => 'مطعم تراثي يقدم أشهى الأكلات الأردنية التقليدية',
                'category' => 'Restaurant',
                'subcategory' => 'Traditional Jordanian',
                'established_date' => '2020-01-15',
                'website' => 'https://example-restaurant.jo',
                'social_media' => [
                    'facebook' => 'https://facebook.com/example-restaurant',
                    'instagram' => 'https://instagram.com/example-restaurant'
                ],
                'operating_hours' => [
                    'sunday' => ['open' => '10:00', 'close' => '23:00'],
                    'monday' => ['open' => '10:00', 'close' => '23:00'],
                    'tuesday' => ['open' => '10:00', 'close' => '23:00'],
                    'wednesday' => ['open' => '10:00', 'close' => '23:00'],
                    'thursday' => ['open' => '10:00', 'close' => '23:00'],
                    'friday' => ['open' => '14:00', 'close' => '23:00'],
                    'saturday' => ['open' => '10:00', 'close' => '23:00']
                ],
                'is_active' => true,
                'is_verified' => true,
                'verification_date' => now(),
                'location' => [
                    'street_address' => 'شارع الملك عبدالله الثاني',
                    'building_number' => '45',
                    'neighborhood' => 'الصويفية',
                    'city' => 'عمان',
                    'governorate' => 'العاصمة',
                    'postal_code' => '11181',
                    'latitude' => 31.9454,
                    'longitude' => 35.9284,
                    'landmarks' => 'بالقرب من مجمع الأصالة التجاري',
                    'parking_availability' => true,
                    'public_transport_access' => 'محطة باص على بعد 200 متر',
                ]
            ],
            [
                'owner_id' => $storeOwner->user_id,
                'trading_name' => 'Golden Cafe',
                'national_id' => '9881234567891',
                'trading_license_number' => 'TL-AMM-2024-002',
                'commercial_registration_number' => 'CR-123456790',
                'tax_number' => 'TAX-987654322',
                'municipality_license' => 'MUN-AMM-2024-002',
                'health_permit' => 'HP-2024-002',
                'description' => 'Modern cafe serving premium coffee and international cuisine',
                'category' => 'Cafe',
                'subcategory' => 'Coffee Shop',
                'established_date' => '2022-06-20',
                'website' => 'https://golden-cafe.jo',
                'social_media' => [
                    'facebook' => 'https://facebook.com/golden-cafe',
                    'instagram' => 'https://instagram.com/golden-cafe'
                ],
                'operating_hours' => [
                    'sunday' => ['open' => '07:00', 'close' => '22:00'],
                    'monday' => ['open' => '07:00', 'close' => '22:00'],
                    'tuesday' => ['open' => '07:00', 'close' => '22:00'],
                    'wednesday' => ['open' => '07:00', 'close' => '22:00'],
                    'thursday' => ['open' => '07:00', 'close' => '22:00'],
                    'friday' => ['open' => '07:00', 'close' => '22:00'],
                    'saturday' => ['open' => '07:00', 'close' => '22:00']
                ],
                'is_active' => true,
                'is_verified' => false,
                'location' => [
                    'street_address' => 'Rainbow Street',
                    'building_number' => '12',
                    'neighborhood' => 'Jabal Amman',
                    'city' => 'Amman',
                    'governorate' => 'Capital',
                    'postal_code' => '11195',
                    'latitude' => 31.9515,
                    'longitude' => 35.9239,
                    'landmarks' => 'Near Wild Jordan Center',
                    'parking_availability' => false,
                    'public_transport_access' => 'Walking distance from downtown',
                ]
            ]
        ];

        foreach ($stores as $storeData) {
            $locationData = $storeData['location'];
            unset($storeData['location']);

            // Create or update store
            $store = Store::updateOrCreate(
                ['trading_license_number' => $storeData['trading_license_number']], // Find by license
                $storeData
            );

            // Create location if it doesn't exist
            $locationData['store_id'] = $store->store_id;
            $locationData['is_primary'] = true;

            StoreLocation::updateOrCreate(
                [
                    'store_id' => $store->store_id,
                    'is_primary' => true
                ],
                $locationData
            );
        }

        $this->command->info('Stores seeded successfully!');
    }
}
