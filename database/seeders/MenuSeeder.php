<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Store;
use App\Models\MenuCategory;
use App\Models\MenuItem;

class MenuSeeder extends Seeder
{
    public function run()
    {
        $traditionalRestaurant = Store::where('trading_name', 'مطعم الأصالة الأردنية')->first();

        if (!$traditionalRestaurant) {
            $this->command->error('Traditional restaurant not found. Please run StoreSeeder first.');
            return;
        }

        // Create menu categories
        $categories = [
            [
                'category_name' => 'المقبلات',
                'description' => 'تشكيلة من المقبلات الأردنية التقليدية',
                'display_order' => 1
            ],
            [
                'category_name' => 'الأطباق الرئيسية',
                'description' => 'أطباق أردنية تقليدية أصيلة',
                'display_order' => 2
            ],
            [
                'category_name' => 'الحلويات',
                'description' => 'حلويات شرقية تقليدية',
                'display_order' => 3
            ]
        ];

        $categoryIds = [];
        foreach ($categories as $categoryData) {
            $categoryData['store_id'] = $traditionalRestaurant->store_id;

            $category = MenuCategory::updateOrCreate(
                [
                    'store_id' => $traditionalRestaurant->store_id,
                    'category_name' => $categoryData['category_name']
                ],
                $categoryData
            );

            $categoryIds[$categoryData['category_name']] = $category->category_id;
        }

        // Create menu items
        $menuItems = [
            [
                'category_name' => 'المقبلات',
                'item_name' => 'حمص',
                'description' => 'حمص طازج مع زيت الزيتون والطحينة',
                'price' => 3.500,
                'currency' => 'JOD',
                'is_available' => true,
                'is_featured' => true,
                'preparation_time' => 5,
                'is_vegetarian' => true,
                'is_vegan' => true,
                'is_halal' => true,
                'display_order' => 1
            ],
            [
                'category_name' => 'الأطباق الرئيسية',
                'item_name' => 'منسف',
                'description' => 'الطبق الوطني الأردني - لحم الضأن مع الجميد والأرز',
                'price' => 12.000,
                'currency' => 'JOD',
                'is_available' => true,
                'is_featured' => true,
                'preparation_time' => 30,
                'is_vegetarian' => false,
                'is_vegan' => false,
                'is_halal' => true,
                'display_order' => 1
            ],
            [
                'category_name' => 'الحلويات',
                'item_name' => 'كنافة نابلسية',
                'description' => 'كنافة طازجة بالجبن والقطر',
                'price' => 5.000,
                'currency' => 'JOD',
                'is_available' => true,
                'is_featured' => false,
                'preparation_time' => 15,
                'is_vegetarian' => true,
                'is_vegan' => false,
                'is_halal' => true,
                'display_order' => 1
            ]
        ];

        foreach ($menuItems as $itemData) {
            $categoryName = $itemData['category_name'];
            unset($itemData['category_name']);

            $itemData['store_id'] = $traditionalRestaurant->store_id;
            $itemData['category_id'] = $categoryIds[$categoryName];

            MenuItem::updateOrCreate(
                [
                    'store_id' => $traditionalRestaurant->store_id,
                    'item_name' => $itemData['item_name']
                ],
                $itemData
            );
        }

        $this->command->info('Menu items seeded successfully!');
    }
}
