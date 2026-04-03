/**
 * Reminder Command - Set reminders for yourself or group members
 * Usage:
 * .reminder add [time] [message] - Add reminder
 * .reminder list - List your reminders
 * .reminder remove [id] - Remove reminder
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../database');
const REMINDER_DB = path.join(DB_PATH, 'reminders.json');

// Initialize database
const initDB = () => {
    if (!fs.existsSync(REMINDER_DB)) {
        fs.writeFileSync(REMINDER_DB, JSON.stringify({}));
    }
};
initDB();

// Read/Write functions
const readDB = () => {
    try {
        return JSON.parse(fs.readFileSync(REMINDER_DB, 'utf-8'));
    } catch {
        return {};
    }
};

const writeDB = (data) => {
    fs.writeFileSync(REMINDER_DB, JSON.stringify(data, null, 2));
};

// Check and send reminders
const checkReminders = async (sock) => {
    // Check if socket is valid and connected
    if (!sock || !sock.user || !sock.user.id) {
        return; // Socket not ready, skip
    }
    
    const data = readDB();
    const now = Date.now();
    let changed = false;
    
    for (const [id, reminder] of Object.entries(data)) {
        if (reminder.reminderTime <= now && !reminder.sent) {
            try {
                // Verify socket is still valid before sending
                if (!sock || !sock.user) {
                    continue;
                }
                
                const mentionText = reminder.mentionJid ? `@${reminder.mentionJid.split('@')[0]}` : '';
                
                const reminderText = `🔔 *RAPPEL*

${mentionText ? `${mentionText}\n` : ''}💬 *Message:* ${reminder.message}

⏰ Établi: ${formatTime(reminder.createdAt)}`;
                
                await sock.sendMessage(reminder.chatId, {
                    text: reminderText,
                    mentions: reminder.mentionJid ? [reminder.mentionJid] : []
                });
                
                reminder.sent = true;
                changed = true;
                console.log(`[Reminder] Reminder sent to ${reminder.chatId}`);
            } catch (error) {
                // If connection closed, mark as failed but don't delete
                if (error.message?.includes('Connection Closed') || error.isServer) {
                    console.log(`[Reminder] Connection closed, will retry later`);
                    reminder.failed = true;
                    changed = true;
                } else {
                    console.error(`[Reminder] Error sending reminder:`, error);
                }
            }
        }
    }
    
    if (changed) {
        writeDB(data);
    }
};

// Parse time input
const parseTime = (timeStr) => {
    const now = new Date();
    
    // Try date patterns first
    // Format: YYYY-MM-DD HH:MM (with space)
    let datePattern = /^(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2})$/;
    let dateMatch = timeStr.match(datePattern);
    
    if (dateMatch) {
        const [, year, month, day, hour, minute] = dateMatch;
        const reminderTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), 0, 0);
        
        if (reminderTime <= now) {
            return null;
        }
        return reminderTime.getTime();
    }
    
    // Format: YYYY-MM-DD (no time)
    datePattern = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
    dateMatch = timeStr.match(datePattern);
    
    if (dateMatch) {
        const [, year, month, day] = dateMatch;
        const reminderTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 0, 0, 0, 0);
        
        if (reminderTime <= now) {
            return null;
        }
        return reminderTime.getTime();
    }
    
    // Format: HH:MM
    if (timeStr.includes(':') && !timeStr.startsWith('-')) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const reminderTime = new Date(now);
        reminderTime.setHours(hours, minutes, 0, 0);
        
        if (reminderTime <= now) {
            reminderTime.setDate(reminderTime.getDate() + 1);
        }
        return reminderTime.getTime();
    }
    
    // Format: Number + unit
    const match = timeStr.match(/^(\d+)([smhd])$/i);
    if (match) {
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        
        switch (unit) {
            case 's': return now.getTime() + value * 1000;
            case 'm': return now.getTime() + value * 60 * 1000;
            case 'h': return now.getTime() + value * 60 * 60 * 1000;
            case 'd': return now.getTime() + value * 24 * 60 * 60 * 1000;
        }
    }
    
    return null;
};

// Format time for display
const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

module.exports = {
    name: 'reminder',
    aliases: ['rappel', 'remind'],
    category: 'automation',
    desc: 'Set reminders for yourself or group members',
    usage: 'add [time] [message] / list / remove [id]',
    
    async execute(sock, msg, args, extra) {
        const { from, sender, isGroup, mentionedJid } = extra;
        
        const subCommand = args[0]?.toLowerCase();
        
        if (!subCommand || subCommand === 'list') {
            // List user's reminders
            const data = readDB();
            const now = Date.now();
            
            // Get reminders for this user in this chat
            const userReminders = Object.entries(data)
                .filter(([_, r]) => r.userId === sender && r.chatId === from && !r.sent)
                .sort((a, b) => a[1].reminderTime - b[1].reminderTime);
            
            let response = `🔔 *Mes Rappels*\n\n`;
            
            if (userReminders.length === 0) {
                response += 'Aucun rappel pour le moment.\n\n';
            } else {
                response += `📋 *${userReminders.length} rappel(s):*\n\n`;
                
                userReminders.forEach(([id, reminder], i) => {
                    const timeLeft = reminder.reminderTime - now;
                    const minutesLeft = Math.floor(timeLeft / 60000);
                    
                    response += `${i + 1}. 🆔 ${id.substring(0, 8)}...\n`;
                    response += `   ⏰ ${formatTime(reminder.reminderTime)}`;
                    if (minutesLeft > 0) {
                        response += ` (dans ${minutesLeft}min)`;
                    }
                    response += `\n   💬 ${reminder.message.substring(0, 40)}${reminder.message.length > 40 ? '...' : ''}\n\n`;
                });
            }
            
            response += '📝 *Usage:*\n';
            response += '• .reminder add [time] [message]\n';
            response += '• .reminder add [number] [time] [message]\n';
            response += '• .reminder list\n';
            response += '• .reminder remove [id]\n\n';
            response += '⏱️ *Formats:* HH:MM, Xm, Xh, Xd, YYYY-MM-DD';
            
            await sock.sendMessage(from, { text: response }, { quoted: msg });
            return;
        }
        
        switch (subCommand) {
            case 'add':
            case 'create':
            case 'set':
                if (args.length < 3) {
                    await extra.reply(`❌ Usage: .reminder add [time] [message]

⏱️ *Formats:*
• HH:MM → 14:30
• Xm → 30m (minutes)
• Xh → 2h (heures)
• Xd → 1d (jours)
• YYYY-MM-DD → 2025-12-01
• YYYY-MM-DD HH:MM → 2025-12-01 14:30

📝 *Pour un autre numéro:*
.reminder add [numéro] [time] [message]

📝 *Exemple:*
.reminder add 1h Réunion dans 1 heure
.reminder add 2025-12-01 14:30 Réunion
.reminder add 2376725980 30m N'oublie pas!`);
                    return;
                }
                
                // Check if first arg is a phone number
                let targetChatId = from;
                let timeStr;
                let message;
                
                const firstArg = args[1];
                const phonePattern = /^[+]?\d{6,}$/;
                
                if (phonePattern.test(firstArg.replace(/\s/g, ''))) {
                    // It's a phone number
                    let phoneNumber = firstArg.replace(/[+\s]/g, '');
                    
                    // Add country code if not present (assuming Cameroon 237)
                    if (!phoneNumber.startsWith('237') && phoneNumber.length <= 9) {
                        phoneNumber = '237' + phoneNumber;
                    }
                    
                    targetChatId = phoneNumber + '@s.whatsapp.net';
                    
                    // Check if args[2] is a date (YYYY-MM-DD) and args[3] is time (HH:MM)
                    const arg2 = args[2];
                    const arg3 = args[3];
                    
                    // If arg2 is a date pattern and arg3 looks like time, combine them
                    if (arg2 && arg2.match(/^\d{4}-\d{1,2}-\d{1,2}$/) && arg3 && arg3.includes(':')) {
                        timeStr = arg2 + ' ' + arg3;
                        message = args.slice(4).join(' ');
                    } else {
                        timeStr = arg2;
                        message = args.slice(3).join(' ');
                    }
                    
                    if (!timeStr || !message) {
                        await extra.reply('❌ Usage: .reminder add [numéro] [time] [message]\n\nExemple: .reminder add 2376725980 30m Salut!');
                        return;
                    }
                } else {
                    // No phone number
                    // Check if args[1] is a date (YYYY-MM-DD) and args[2] is time (HH:MM)
                    const arg1 = args[1];
                    const arg2 = args[2];
                    
                    if (arg1 && arg1.match(/^\d{4}-\d{1,2}-\d{1,2}$/) && arg2 && arg2.includes(':')) {
                        timeStr = arg1 + ' ' + arg2;
                        message = args.slice(3).join(' ');
                    } else {
                        timeStr = args[1];
                        message = args.slice(2).join(' ');
                    }
                }
                
                const reminderTime = parseTime(timeStr);
                
                if (!reminderTime) {
                    await extra.reply('❌ Format de temps invalide.\nUtilisez: HH:MM, Xm, Xh, Xd, ou YYYY-MM-DD');
                    return;
                }
                
                // Check if mentioning someone in group
                let mentionJid = null;
                if (isGroup && mentionedJid && mentionedJid.length > 0) {
                    mentionJid = mentionedJid[0];
                }
                
                const reminderId = `remind_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const reminderData = readDB();
                
                reminderData[reminderId] = {
                    chatId: targetChatId,
                    userId: sender,
                    mentionJid: mentionJid,
                    message: message,
                    reminderTime: reminderTime,
                    sent: false,
                    createdAt: Date.now()
                };
                
                writeDB(reminderData);
                
                const timeUntil = reminderTime - Date.now();
                const minutes = Math.floor(timeUntil / 60000);
                
                const targetDisplay = targetChatId === from ? 'ce chat' : targetChatId.split('@')[0];
                
                let confirmText = `✅ *Rappel ajouté!*

📱 Pour: ${targetDisplay}
⏰ Sera envoyé: ${formatTime(reminderTime)}
💬 Message: ${message}
⏳ Dans: ${minutes} minute(s)`;
                
                if (mentionJid) {
                    confirmText += `\n👤 Pour: @${mentionJid.split('@')[0]}`;
                }
                
                await sock.sendMessage(from, {
                    text: confirmText,
                    mentions: mentionJid ? [mentionJid] : []
                }, { quoted: msg });
                break;
                
            case 'remove':
            case 'delete':
            case 'del':
                if (args.length < 2) {
                    await extra.reply('❌ Usage: .reminder remove [id]');
                    return;
                }
                
                const removeId = args[1];
                const reminderDataDel = readDB();
                
                // Find matching ID owned by user
                const foundKey = Object.keys(reminderDataDel).find(k => 
                    (k.includes(removeId) || k.startsWith(removeId)) &&
                    reminderDataDel[k].userId === sender
                );
                
                if (foundKey) {
                    delete reminderDataDel[foundKey];
                    writeDB(reminderDataDel);
                    await extra.reply('✅ Rappel supprimé!');
                } else {
                    await extra.reply('❌ Rappel non trouvé ou non autorisé.');
                }
                break;
                
            default:
                await extra.reply('❌ Commande invalide.\n\nUsage:\n• .reminder add [time] [message]\n• .reminder list\n• .reminder remove [id]');
        }
    }
};

// Export check function
module.exports.checkReminders = checkReminders;