<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'plan_type',
        'subscription_expires_at',
        'max_sessions',
        'is_active',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'subscription_expires_at' => 'datetime',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    /**
     * Check if user has an active premium subscription
     */
    public function isPremium(): bool
    {
        if ($this->plan_type !== 'premium') {
            return false;
        }

        if ($this->subscription_expires_at === null) {
            return true; // Lifetime premium
        }

        return $this->subscription_expires_at->isFuture();
    }

    /**
     * Check if user can create more sessions
     */
    public function canCreateSession(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        return true; // Will be checked against actual session count in controller
    }

    /**
     * Get the number of active sessions for this user
     */
    public function activeSessions(): int
    {
        // This will be implemented based on the sessions table
        return 0;
    }

    /**
     * Get remaining sessions available
     */
    public function getRemainingSessionsAttribute(): int
    {
        return max(0, $this->max_sessions - $this->activeSessions());
    }

    /**
     * Update last login timestamp
     */
    public function updateLastLogin(): void
    {
        $this->update(['last_login_at' => now()]);
    }

    /**
     * Check if user account is active
     */
    public function isActive(): bool
    {
        return $this->is_active;
    }
}
