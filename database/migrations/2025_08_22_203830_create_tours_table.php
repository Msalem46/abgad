<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tours', function (Blueprint $table) {
            $table->id('tour_id');
            $table->foreignId('provider_id')->constrained('tourism_providers', 'provider_id')->onDelete('cascade');
            
            // Basic Information
            $table->string('title', 200);
            $table->text('description');
            $table->text('highlights'); // Main attractions/highlights
            $table->json('inclusions'); // What's included in the tour
            $table->json('exclusions')->nullable(); // What's not included
            $table->text('itinerary'); // Detailed itinerary
            
            // Tour Classification
            $table->enum('tour_type', ['cultural', 'adventure', 'historical', 'nature', 'religious', 'city', 'desert', 'diving']);
            $table->enum('difficulty_level', ['easy', 'moderate', 'challenging', 'extreme'])->default('easy');
            $table->json('categories')->nullable(); // Additional categories/tags
            
            // Duration & Timing
            $table->integer('duration_days')->unsigned();
            $table->integer('duration_hours')->unsigned()->nullable(); // For day tours
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->json('operating_days')->nullable(); // Days of week
            $table->date('season_start')->nullable();
            $table->date('season_end')->nullable();
            
            // Pricing
            $table->decimal('price_adult', 10, 2);
            $table->decimal('price_child', 10, 2)->nullable();
            $table->decimal('price_senior', 10, 2)->nullable();
            $table->enum('currency', ['JOD', 'USD', 'EUR'])->default('JOD');
            $table->boolean('price_negotiable')->default(false);
            $table->decimal('group_discount_threshold', 5, 2)->nullable(); // Minimum group size for discount
            $table->decimal('group_discount_percentage', 5, 2)->nullable();
            
            // Capacity & Booking
            $table->integer('min_participants')->unsigned()->default(1);
            $table->integer('max_participants')->unsigned();
            $table->integer('advance_booking_hours')->unsigned()->default(24); // How far in advance to book
            $table->boolean('instant_booking')->default(false);
            $table->enum('cancellation_policy', ['flexible', 'moderate', 'strict'])->default('moderate');
            
            // Location Information
            $table->json('pickup_locations')->nullable(); // Array of pickup points
            $table->json('destinations'); // Array of destinations/locations visited
            $table->string('meeting_point', 500);
            $table->decimal('meeting_latitude', 10, 7)->nullable();
            $table->decimal('meeting_longitude', 10, 7)->nullable();
            
            // Requirements & Additional Info
            $table->json('requirements')->nullable(); // Age limits, fitness level, etc.
            $table->json('what_to_bring')->nullable(); // Items to bring
            $table->json('languages_offered')->nullable(); // Tour guide languages
            $table->text('special_notes')->nullable();
            $table->boolean('accessible')->default(false); // Wheelchair accessible
            
            // Media
            $table->string('featured_image')->nullable();
            $table->json('gallery_images')->nullable(); // Array of image paths
            $table->string('video_url')->nullable();
            
            // Status & Availability
            $table->enum('status', ['active', 'inactive', 'draft', 'suspended'])->default('draft');
            $table->boolean('featured')->default(false);
            $table->boolean('available')->default(true);
            $table->date('available_from')->nullable();
            $table->date('available_until')->nullable();
            
            // Performance Metrics
            $table->decimal('average_rating', 3, 2)->default(0.00);
            $table->integer('total_reviews')->unsigned()->default(0);
            $table->integer('total_bookings')->unsigned()->default(0);
            $table->integer('views_count')->unsigned()->default(0);
            
            // SEO & Marketing
            $table->string('slug', 250)->unique();
            $table->string('meta_title', 160)->nullable();
            $table->text('meta_description')->nullable();
            $table->json('keywords')->nullable();
            
            // Metadata
            $table->json('metadata')->nullable(); // Additional flexible data
            $table->timestamps();
            
            // Indexes
            $table->index('tour_type');
            $table->index('difficulty_level');
            $table->index('status');
            $table->index('available');
            $table->index('featured');
            $table->index(['price_adult', 'currency']);
            $table->index(['average_rating', 'total_reviews']);
            $table->index(['duration_days', 'tour_type']);
            $table->fullText(['title', 'description', 'highlights']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('tours');
    }
};