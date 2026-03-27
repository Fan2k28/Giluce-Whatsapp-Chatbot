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
        Schema::create('whatsapp_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('session_id')->unique();
            $table->string('device_name');
            $table->string('phone_number')->nullable();
            $table->string('state')->default('pending');
            $table->string('qr_code')->nullable();
            $table->timestamp('last_seen')->nullable();
            $table->timestamps();
            
            // Add indexes for faster queries
            $table->index('session_id');
            $table->index('state');
            $table->index(['user_id', 'state']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('whatsapp_sessions');
    }
};