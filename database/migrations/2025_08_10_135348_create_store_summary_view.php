<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("
            CREATE VIEW store_summary AS
            SELECT
                s.store_id,
                s.trading_name,
                s.category,
                s.is_verified,
                sl.city,
                sl.governorate,
                COUNT(DISTINCT sp.photo_id) as photo_count,
                COUNT(DISTINCT mi.item_id) as menu_item_count,
                COALESCE(SUM(da.total_visits), 0) as monthly_visits
            FROM stores s
            LEFT JOIN store_locations sl ON s.store_id = sl.store_id AND sl.is_primary = TRUE
            LEFT JOIN store_photos sp ON s.store_id = sp.store_id AND sp.is_active = TRUE
            LEFT JOIN menu_items mi ON s.store_id = mi.store_id AND mi.is_available = TRUE
            LEFT JOIN daily_store_analytics da ON s.store_id = da.store_id
                AND da.analytics_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY s.store_id, s.trading_name, s.category, s.is_verified,
                     sl.city, sl.governorate
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS store_summary');
    }
};
