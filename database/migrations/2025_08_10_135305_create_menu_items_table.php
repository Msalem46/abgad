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
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id('item_id');
            $table->foreignId('store_id')->constrained('stores', 'store_id')->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained('menu_categories', 'category_id')->onDelete('set null');

            // Item details
            $table->string('item_name', 255);
            $table->text('description')->nullable();
            $table->decimal('price', 10, 3)->nullable();
            $table->string('currency', 3)->default('JOD');

            // Item properties
            $table->boolean('is_available')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->integer('preparation_time')->nullable();

            // Dietary information
            $table->boolean('is_vegetarian')->default(false);
            $table->boolean('is_vegan')->default(false);
            $table->boolean('is_halal')->default(true);
            $table->json('allergens')->nullable();

            // Display settings
            $table->integer('display_order')->default(0);
            $table->string('image_url', 500)->nullable();

            $table->timestamps();

            $table->index(['store_id', 'category_id']);
            $table->index(['is_available', 'is_featured']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
