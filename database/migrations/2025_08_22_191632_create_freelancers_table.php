<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('freelancers', function (Blueprint $table) {
            $table->id('freelancer_id');
            $table->unsignedBigInteger('user_id');
            $table->string('professional_title', 100);
            $table->text('bio')->nullable();
            $table->json('skills'); // Array of skills
            $table->json('categories'); // Service categories they offer
            $table->decimal('hourly_rate', 8, 2)->nullable();
            $table->json('languages')->nullable(); // Languages spoken
            $table->string('experience_level', 20)->default('beginner'); // beginner, intermediate, expert
            $table->integer('years_experience')->default(0);
            $table->text('portfolio_description')->nullable();
            $table->json('certifications')->nullable();
            $table->json('education')->nullable();
            $table->string('availability_status', 20)->default('available'); // available, busy, unavailable
            $table->json('work_preferences')->nullable(); // remote, onsite, hybrid
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->json('social_media')->nullable(); // linkedin, portfolio, github, etc.
            $table->string('profile_image')->nullable();
            $table->json('portfolio_images')->nullable();
            $table->decimal('rating', 3, 2)->default(0.00);
            $table->integer('total_reviews')->default(0);
            $table->integer('completed_projects')->default(0);
            $table->json('location')->nullable(); // city, governorate, country
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_active')->default(true);
            $table->boolean('featured')->default(false);
            $table->timestamp('verified_at')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->index(['is_verified', 'is_active']);
            $table->index(['rating', 'total_reviews']);
            $table->index('availability_status');
            $table->index('experience_level');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('freelancers');
    }
};