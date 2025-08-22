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
        Schema::create('store_locations', function (Blueprint $table) {
            $table->id('location_id');
            $table->foreignId('store_id')->constrained('stores', 'store_id')->onDelete('cascade');

            // Address details
            $table->string('street_address', 255);
            $table->string('building_number', 10)->nullable();
            $table->string('floor_number', 10)->nullable();
            $table->string('apartment_unit', 10)->nullable();
            $table->string('neighborhood', 100)->nullable();
            $table->string('city', 100);
            $table->string('governorate', 100);
            $table->string('postal_code', 10)->nullable();

            // Map coordinates
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);

            // Additional location info
            $table->text('landmarks')->nullable();
            $table->boolean('parking_availability')->default(false);
            $table->text('public_transport_access')->nullable();

            $table->boolean('is_primary')->default(true);
            $table->timestamp('created_at')->useCurrent();

            $table->index(['latitude', 'longitude']);
            $table->index(['city', 'governorate']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_locations');
    }
};
