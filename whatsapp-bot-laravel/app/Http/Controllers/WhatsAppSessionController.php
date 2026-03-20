<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WhatsAppSessionController extends Controller
{
    private $nodeApiUrl;

    public function __construct()
    {
        $this->nodeApiUrl = config('services.node_api_url');
    }

    public function index()
    {
        $response = Http::get($this->nodeApiUrl . '/sessions');
        $sessions = $response->json();
        
        // Convert each session to object
        $sessions = array_map(function($session) {
            return (object) $session;
        }, $sessions);
        
        return view('sessions.index', ['sessions' => $sessions]);
    }

    public function create()
    {
        return view('sessions.create');
    }

    public function store(Request $request)
    {
        $response = Http::post($this->nodeApiUrl . '/sessions', [
            'device_name' => $request->input('device_name')
        ]);
        
        if ($response->successful()) {
            $data = $response->json();
            return redirect()->route('sessions.show', ['session' => $data['sessionId']]);
        }
        
        return back()->with('error', 'Failed to create session');
    }

    public function show($id)
    {
        $response = Http::get($this->nodeApiUrl . '/sessions/' . $id);
        $sessionData = (object) $response->json();
        
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
        $response = Http::post($this->nodeApiUrl . '/sessions/' . $id . '/reconnect');
        
        return response()->json([
            'message' => 'Reconnexion initiée'
        ]);
    }

    public function destroy($id)
    {
        Http::delete($this->nodeApiUrl . '/sessions/' . $id);
        return redirect()->route('sessions.index');
    }
}
