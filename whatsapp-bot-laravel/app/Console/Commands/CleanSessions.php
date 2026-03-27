<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\WhatsAppSession;

class CleanSessions extends Command
{
    protected $signature = 'sessions:clean';
    protected $description = 'Clean all WhatsApp sessions from database';

    public function handle()
    {
        $count = WhatsAppSession::count();
        
        if ($count > 0) {
            WhatsAppSession::truncate();
            $this->info("Deleted {$count} sessions from database.");
        } else {
            $this->info("No sessions found in database.");
        }
        
        return 0;
    }
}