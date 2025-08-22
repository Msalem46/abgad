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
        Schema::create('store_visits', function (Blueprint $table) {
            $table->id('visit_id');
            $table->foreignId('store_id')->constrained('stores', 'store_id')->onDelete('cascade');

            // Visitor information
            $table->string('visitor_ip', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users', 'user_id')->onDelete('set null');

            // Session details
            $table->string('session_id', 100)->nullable();
            $table->timestamp('visit_start')->useCurrent();
            $table->timestamp('visit_end')->nullable();
            $table->integer('duration_seconds')->nullable();

            // Visit metadata
            $table->string('referrer_url', 500)->nullable();
            $table->enum('device_type', ['desktop', 'mobile', 'tablet'])->default('desktop');
            $table->string('browser_name', 50)->nullable();
            $table->string('operating_system', 50)->nullable();

            // Location data
            $table->string('visitor_country', 100)->nullable();
            $table->string('visitor_city', 100)->nullable();

            $table->timestamp('created_at')->useCurrent();

            $table->index(['store_id', 'visit_start']);
            $table->index('session_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_visits');
    }
};
