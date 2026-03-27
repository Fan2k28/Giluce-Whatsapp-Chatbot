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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('plan_type', ['free', 'premium'])->default('free')->after('password');
            $table->timestamp('subscription_expires_at')->nullable()->after('plan_type');
            $table->integer('max_sessions')->default(1)->after('subscription_expires_at');
            $table->boolean('is_active')->default(true)->after('max_sessions');
            $table->string('phone')->nullable()->after('is_active');
            $table->timestamp('last_login_at')->nullable()->after('phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'plan_type',
                'subscription_expires_at',
                'max_sessions',
                'is_active',
                'phone',
                'last_login_at'
            ]);
        });
    }
};
