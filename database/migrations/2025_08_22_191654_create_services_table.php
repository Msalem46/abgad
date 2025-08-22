<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id('service_id');
            $table->unsignedBigInteger('freelancer_id');
            $table->string('title', 150);
            $table->text('description');
            $table->string('category', 50);
            $table->string('subcategory', 50)->nullable();
            $table->json('tags')->nullable(); // Service tags for better searchability
            $table->decimal('base_price', 10, 2);
            $table->string('price_type', 20)->default('fixed'); // fixed, hourly, per_project
            $table->integer('delivery_days')->default(1);
            $table->json('service_packages')->nullable(); // basic, standard, premium packages
            $table->json('requirements')->nullable(); // What client needs to provide
            $table->json('deliverables')->nullable(); // What freelancer will deliver
            $table->json('add_ons')->nullable(); // Additional services with prices
            $table->string('service_type', 30)->default('remote'); // remote, onsite, hybrid
            $table->json('location_restrictions')->nullable(); // If onsite, which locations
            $table->json('portfolio_images')->nullable();
            $table->string('featured_image')->nullable();
            $table->integer('max_revisions')->default(2);
            $table->text('faq')->nullable();
            $table->json('skills_required')->nullable();
            $table->integer('views')->default(0);
            $table->integer('inquiries')->default(0);
            $table->integer('orders')->default(0);
            $table->decimal('rating', 3, 2)->default(0.00);
            $table->integer('total_reviews')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('featured')->default(false);
            $table->boolean('is_verified')->default(false);
            $table->timestamp('verified_at')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamps();

            $table->foreign('freelancer_id')->references('freelancer_id')->on('freelancers')->onDelete('cascade');
            $table->index(['category', 'is_active', 'is_verified']);
            $table->index(['featured', 'rating']);
            $table->index('price_type');
            $table->index('service_type');
            $table->fullText(['title', 'description']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};