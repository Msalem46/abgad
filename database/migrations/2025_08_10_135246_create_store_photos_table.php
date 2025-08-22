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
        Schema::create('store_photos', function (Blueprint $table) {
            $table->id('photo_id');
            $table->foreignId('store_id')->constrained('stores', 'store_id')->onDelete('cascade');

            // Photo details
            $table->string('file_name', 255);
            $table->string('file_path', 500);
            $table->integer('file_size')->nullable();
            $table->string('mime_type', 50)->nullable();

            // Photo metadata
            $table->enum('photo_type', ['exterior', 'interior', 'product', 'menu', 'other']);
            $table->string('title', 255)->nullable();
            $table->text('description')->nullable();
            $table->string('alt_text', 255)->nullable();

            // Display settings
            $table->boolean('is_featured')->default(false);
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);

            // Upload info
            $table->foreignId('uploaded_by')->nullable()->constrained('users', 'user_id');
            $table->timestamp('uploaded_at')->useCurrent();

            $table->index(['store_id', 'photo_type']);
            $table->index(['is_featured', 'display_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_photos');
    }
};
