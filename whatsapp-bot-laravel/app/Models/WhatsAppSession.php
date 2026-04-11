<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WhatsAppSession extends Model
{ 
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'whatsapp_sessions';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'session_id',
        'device_name',
        'phone_number',
        'state',
        'qr_code',
        'last_seen',
    ];

    /**
     * The attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'last_seen' => 'datetime',
        ];
    }

    /**
     * Get the user that owns this session.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if the session is authenticated/connected
     */
    public function isAuthenticated(): bool
    {
        return $this->state === 'authenticated';
    }

    /**
     * Check if the session is pending/awaiting QR code scan
     */
    public function isPending(): bool
    {
        return $this->state === 'pending' || $this->state === 'waiting_qr';
    }

    /**
     * Check if the session is active (authenticated)
     */
    public function isActive(): bool
    {
        return $this->isAuthenticated();
    }

    /**
     * Scope to get only active/connected sessions
     */
    public function scopeActive($query)
    {
        return $query->where('state', 'authenticated');
    }

    /**
     * Scope to get only pending sessions
     */
    public function scopePending($query)
    {
        return $query->whereIn('state', ['pending', 'waiting_qr']);
    }

    /**
     * Scope to get sessions for a specific user
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }
}