<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('daily_store_analytics', function (Blueprint $table) {
            $table->id('analytics_id');
            $table->foreignId('store_id')->constrained('stores', 'store_id')->onDelete('cascade');
            $table->date('analytics_date');

            // Visit statistics
            $table->integer('total_visits')->default(0);
            $table->integer('unique_visitors')->default(0);
            $table->bigInteger('total_duration_seconds')->default(0);
            $table->decimal('average_duration_seconds', 10, 2)->default(0);

            // Engagement metrics
            $table->decimal('bounce_rate', 5, 2)->default(0);
            $table->integer('page_views')->default(0);
            $table->integer('menu_views')->default(0);
            $table->integer('gallery_views')->default(0);

            // Device breakdown
            $table->integer('desktop_visits')->default(0);
            $table->integer('mobile_visits')->default(0);
            $table->integer('tablet_visits')->default(0);

            $table->timestamps();

            $table->unique(['store_id', 'analytics_date']);
            $table->index('analytics_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_store_analytics');
    }
};
