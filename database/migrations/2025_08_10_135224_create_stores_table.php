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
        Schema::create('stores', function (Blueprint $table) {
            $table->id('store_id');
            $table->foreignId('owner_id')->constrained('users', 'user_id');
            $table->string('trading_name', 255);
            $table->string('national_id', 20);
            $table->string('trading_license_number', 50)->unique();

            // Additional Jordanian authorization fields
            $table->string('commercial_registration_number', 50)->nullable();
            $table->string('tax_number', 20)->nullable();
            $table->string('municipality_license', 50)->nullable();
            $table->string('health_permit', 50)->nullable();
            $table->string('fire_safety_certificate', 50)->nullable();

            // Store details
            $table->text('description')->nullable();
            $table->string('category', 100)->nullable();
            $table->string('subcategory', 100)->nullable();
            $table->date('established_date')->nullable();
            $table->string('website', 255)->nullable();
            $table->json('social_media')->nullable();

            // Operating hours
            $table->json('operating_hours')->nullable();

            // Status and verification
            $table->boolean('is_active')->default(true);
            $table->boolean('is_verified')->default(false);
            $table->timestamp('verification_date')->nullable();
            $table->text('verification_notes')->nullable();

            $table->timestamps();

            $table->index('trading_license_number');
            $table->index('national_id');
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
