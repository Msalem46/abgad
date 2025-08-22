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
        Schema::create('visit_interactions', function (Blueprint $table) {
            $table->id('interaction_id');
            $table->foreignId('visit_id')->constrained('store_visits', 'visit_id')->onDelete('cascade');

            // Interaction details
            $table->string('page_section', 100)->nullable();
            $table->string('action_type', 50)->nullable();
            $table->string('element_id', 100)->nullable();
            $table->json('interaction_data')->nullable();

            $table->timestamp('interaction_time')->useCurrent();

            $table->index(['visit_id', 'page_section']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visit_interactions');
    }
};
