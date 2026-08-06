<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use App\Models\WhatsAppSession;

class WhatsAppSessionController extends Controller
{
    private $nodeApiUrl;

    public function __construct()
    {
        $this->nodeApiUrl = config('services.node_api_url');
    }

    public function index()
    {
        $user = Auth::user();
        
        // Get sessions from database for this user
        $userSessions = WhatsAppSession::forUser($user->id)->get();
        
        // Also fetch from API to get current state
        $response = Http::get($this->nodeApiUrl . '/sessions');
        $apiSessions = $response->json();
        
        // Convert each session to object
        $apiSessions = array_map(function($session) {
            return (object) $session;
        }, $apiSessions);
        
        // Sync database records for this user's sessions only
        $this->syncUserSessionsWithDatabase($apiSessions, $user->id);
        
        // Get updated sessions from database
        // dd($apiSessions);
        $userSessions = WhatsAppSession::forUser($user->id)->get();
        
        // Map to API session format for display
        $sessions = $userSessions->map(function($dbSession) use ($apiSessions) {
            // Find matching API session
            $apiSession = collect($apiSessions)->firstWhere('id', $dbSession->session_id);
            if ($apiSession) {
                return (object) [
                    'id' => $apiSession->id,
                    'name' => $apiSession->name ?? $dbSession->device_name,
                    'phoneNumber' => $apiSession->phoneNumber ?? $dbSession->phone_number,
                    'state' => $apiSession->state ?? $dbSession->state,
                    'lastSeen' => $apiSession->lastSeen ?? $dbSession->last_seen,
                ];
            }
            
            return (object) [
                'id' => $dbSession->session_id,
                'name' => $dbSession->device_name,
                'phoneNumber' => $dbSession->phone_number,
                'state' => $dbSession->state,
                'lastSeen' => $dbSession->last_seen,
            ];
        })->toArray();
       
        
        return view('sessions.index', ['sessions' => $sessions]);
    }

    /**
     * Sync sessions for a specific user - only update existing records, don't create new ones
     */
    private function syncUserSessionsWithDatabase(array $apiSessions, int $userId): void
    {
        // Get existing session IDs for this user from database
        $localSessions = WhatsAppSession::forUser($userId)->get();
        $localSessionIds = $localSessions->pluck('session_id')->toArray();
        
        // Update only the sessions that belong to this user
        foreach ($localSessions as $localSession) {
            
            // Find matching session in API response
            $apiSession = collect($apiSessions)->firstWhere('id', $localSession->session_id);
            
            if ($apiSession) {
                $localSession->update([
                    'device_name' => $apiSession->name ?? $localSession->device_name,
                    'phone_number' => $apiSession->phoneNumber ?? $localSession->phone_number,
                    'state' => $apiSession->state ?? $localSession->state,
                    'last_seen' => isset($apiSession->lastSeen) ? now() : $localSession->last_seen,
                ]);
            }
        }
        
        // Clean up: remove sessions that no longer exist in API for this user
        $apiSessionIds = array_map(function($session) {
            return $session->id;
        }, $apiSessions);
        
        $sessionsToDelete = array_diff($localSessionIds, $apiSessionIds);
        if (!empty($sessionsToDelete)) {
            WhatsAppSession::forUser($userId)->whereIn('session_id', $sessionsToDelete)->delete();
        }
    }

    public function create()
    {
        return view('sessions.create');
    }

    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'device_name' => 'required|string|max:255',
        ]);
        
        $user = Auth::user();
        
        // Get user's session count
        $sessionCount = WhatsAppSession::forUser($user->id)->count();
        
        // Get max sessions based on user plan (default: 1 for free)
        $maxSessions = $user->max_sessions ?? 1;
        
        // Check if user has reached the session limit
        if ($sessionCount >= $maxSessions) {
            return back()->with('error', 'Vous avez atteint la limite de ' . $maxSessions . ' session(s) pour votre plan.');
        }
        
        // Create session via Node.js API
        $response = Http::post($this->nodeApiUrl . '/sessions', [
            'device_name' => $request->input('device_name')
        ]);
        
        if ($response->successful()) {
            $data = $response->json();
            
            // Save session to database with user_id
            WhatsAppSession::create([
                'user_id' => $user->id,
                'session_id' => $data['sessionId'],
                'device_name' => $request->input('device_name'),
                'state' => 'waiting_qr',
                'phone_number' => null,
            ]);
            
            return redirect()->route('sessions.show', ['session' => $data['sessionId']]);
        }
        
        return back()->with('error', 'Failed to create session');
    }

    public function show($id)
    {
        $user = Auth::user();
        
        // First check if this session belongs to the current user
        $sessionExists = WhatsAppSession::forUser($user->id)
            ->where('session_id', $id)
            ->exists();
        
        if (!$sessionExists) {
            abort(403, 'Cette session ne vous appartient pas.');
        }
        
        $response = Http::get($this->nodeApiUrl . '/sessions/' . $id);
        $sessionData = (object) $response->json();
        
        // Update database record only for this user's session
        WhatsAppSession::forUser($user->id)->where('session_id', $id)->update([
            'phone_number' => $sessionData->phoneNumber ?? null,
            'state' => $sessionData->state ?? 'unknown',
            'last_seen' => isset($sessionData->lastSeen) ? now() : null,
        ]);
        
        return view('sessions.show', ['session' => $sessionData]);
    }

    public function getQrCode($id)
    {
        $response = Http::get($this->nodeApiUrl . '/sessions/' . $id);
        $sessionData = $response->json();
        
        // Get QR code separately
        $qrResponse = Http::get($this->nodeApiUrl . '/sessions/' . $id . '/qr');
        $qrData = $qrResponse->json();
        
        // Return both session info and QR code
        return response()->json([
            'qr' => $qrData['qr'] ?? null,
            'state' => $sessionData['state'] ?? 'unknown',
            'phoneNumber' => $sessionData['phoneNumber'] ?? null
        ]);
    }

    public function reconnect($id)
    {
        $user = Auth::user();
        $response = Http::post($this->nodeApiUrl . '/sessions/' . $id . '/reconnect');
        
        // Update session state in database
        WhatsAppSession::forUser($user->id)->where('session_id', $id)->update(['state' => 'waiting_qr']);
        
        return response()->json([
            'message' => 'Reconnexion initiée'
        ]);
    }

    public function getPairNumber()
    {
        $user = Auth::user();
        
        // For simplicity, we'll create a temporary session ID
        // In a real implementation, you might want to use the user's latest session
        $sessionId = 'temp_' . $user->id . '_' . time();
        
        $response = Http::get($this->nodeApiUrl . '/sessions/' . $sessionId . '/pair-number');
        
        if ($response->successful()) {
            return response()->json([
                'success' => true,
                'pair_number' => $response->json()['pairNumber'] ?? null,
                'message' => $response->json()['message'] ?? 'Use this pair number in WhatsApp > Settings > Linked Devices'
            ]);
        }
        
        return response()->json([
            'success' => false,
            'message' => 'Failed to get pair number'
        ], 500);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        
        Http::delete($this->nodeApiUrl . '/sessions/' . $id);
        
        // Delete from database for this user
        WhatsAppSession::forUser($user->id)->where('session_id', $id)->delete();
        
        return redirect()->route('sessions.index');
    }
}
