<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tourism_providers', function (Blueprint $table) {
            $table->id('provider_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade');
            
            // Company Information
            $table->string('company_name', 200);
            $table->text('company_description');
            $table->string('license_number', 100)->unique();
            $table->string('representative_name', 150);
            $table->string('representative_title', 100);
            
            // Contact Information
            $table->string('phone', 20);
            $table->string('email', 255);
            $table->string('website')->nullable();
            $table->string('whatsapp', 20)->nullable();
            
            // Location Information
            $table->json('operating_areas'); // Array of cities/regions
            $table->string('main_office_city', 100);
            $table->string('main_office_address', 500);
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            
            // Business Details
            $table->json('service_types'); // Array of service types (cultural, adventure, etc.)
            $table->json('specialties'); // Array of specialties
            $table->json('spoken_languages'); // Array of languages
            $table->integer('years_experience')->unsigned();
            $table->json('certifications')->nullable(); // Array of certifications
            
            // Media
            $table->string('logo')->nullable();
            $table->json('portfolio_images')->nullable(); // Array of image paths
            $table->json('certificates')->nullable(); // Array of certificate image paths
            
            // Business Status
            $table->enum('verification_status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->enum('business_status', ['active', 'inactive', 'suspended'])->default('active');
            $table->boolean('featured')->default(false);
            
            // Ratings & Reviews
            $table->decimal('average_rating', 3, 2)->default(0.00);
            $table->integer('total_reviews')->unsigned()->default(0);
            $table->integer('total_bookings')->unsigned()->default(0);
            
            // Metadata
            $table->json('metadata')->nullable(); // Additional flexible data
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('last_active')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('verification_status');
            $table->index('business_status');
            $table->index('main_office_city');
            $table->index(['average_rating', 'total_reviews']);
            $table->index('featured');
            $table->fullText(['company_name', 'company_description']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('tourism_providers');
    }
};