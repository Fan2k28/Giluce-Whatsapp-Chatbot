/**
 * Autoreply Command - Auto responses for group chats
 * Usage:
 * .autoreply add [trigger] [response] - Add auto reply
 * .autoreply remove [trigger] - Remove auto reply
 * .autoreply list - List all auto replies
 * .autoreply on/off - Enable/disable
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../database');
const AUTOREPLY_DB = path.join(DB_PATH, 'autoreplies.json');

// Initialize database
const initDB = () => {
    if (!fs.existsSync(AUTOREPLY_DB)) {
        fs.writeFileSync(AUTOREPLY_DB, JSON.stringify({}));
    }
};
initDB();

// Read/Write functions
const readDB = () => {
    try {
        return JSON.parse(fs.readFileSync(AUTOREPLY_DB, 'utf-8'));
    } catch {
        return {};
    }
};

const writeDB = (data) => {
    fs.writeFileSync(AUTOREPLY_DB, JSON.stringify(data, null, 2));
};

// Process autoreply check
const checkAutoreply = async (sock, msg, text) => {
    const chatId = msg.key.remoteJid;
    const data = readDB();
    
    if (!data[chatId] || !data[chatId].enabled) return;
    
    const trigger = text.toLowerCase();
    if (data[chatId].replies && data[chatId].replies[trigger]) {
        await sock.sendMessage(chatId, {
            text: data[chatId].replies[trigger]
        }, { quoted: msg });
    }
};

module.exports = {
    name: 'autoreply',
    aliases: ['ar', 'autoreply'],
    category: 'automation',
    desc: 'Configure auto replies for group',
    usage: 'add/remove/list/on/off [trigger] [response]',
    
    async execute(sock, msg, args, extra) {
        const { from, isGroup, sender, mentionedJid } = extra;
        
        if (!isGroup) {
            await extra.reply('❌ Cette commande fonctionne uniquement dans un groupe.');
            return;
        }
        
        // Check admin rights for modifications
        const isAdmin = extra.isAdmin || false;
        
        const subCommand = args[0]?.toLowerCase();
        
        if (!subCommand || subCommand === 'list') {
            // List all autoreplies
            const data = readDB();
            const groupData = data[from] || { enabled: false, replies: {} };
            
            let response = `📝 *Auto Replies - ${isGroup ? 'Groupe' : 'Global'}*\n\n`;
            response += `📊 Status: ${groupData.enabled ? '✅ Activé' : '❌ Désactivé'}\n\n`;
            
            const replies = groupData.replies || {};
            const replyKeys = Object.keys(replies);
            
            if (replyKeys.length === 0) {
                response += 'Aucun auto-reply configuré.\n\n';
            } else {
                response += `📋 *${replyKeys.length} auto-reply(s):*\n\n`;
                replyKeys.forEach((key, i) => {
                    response += `${i + 1}. *${key}*\n   → ${replies[key].substring(0, 50)}${replies[key].length > 50 ? '...' : ''}\n\n`;
                });
            }
            
            response += '📝 *Usage:*\n';
            response += '• .autoreply add [trigger] [réponse]\n';
            response += '• .autoreply remove [trigger]\n';
            response += '• .autoreply on/off';
            
            await sock.sendMessage(from, { text: response }, { quoted: msg });
            return;
        }
        
        if (!isAdmin) {
            await extra.reply('❌ Vous devez être administrateur pour modifier les auto-replies.');
            return;
        }
        
        const data = readDB();
        
        if (!data[from]) {
            data[from] = { enabled: true, replies: {} };
        }
        
        switch (subCommand) {
            case 'add':
            case 'set':
            case 'create':
                if (args.length < 3) {
                    await extra.reply('❌ Usage: .autoreply add [trigger] [réponse]\n\nExemple: .autoreply add bonjour Bonjour à tous!');
                    return;
                }
                
                const trigger = args[1].toLowerCase();
                const responseText = args.slice(2).join(' ');
                
                data[from].replies[trigger] = responseText;
                writeDB(data);
                
                await extra.reply(`✅ Auto-reply ajouté!\n\n🔑 Trigger: ${trigger}\n💬 Réponse: ${responseText}`);
                break;
                
            case 'remove':
            case 'delete':
            case 'del':
                if (args.length < 2) {
                    await extra.reply('❌ Usage: .autoreply remove [trigger]');
                    return;
                }
                
                const removeTrigger = args[1].toLowerCase();
                
                if (data[from].replies[removeTrigger]) {
                    delete data[from].replies[removeTrigger];
                    writeDB(data);
                    await extra.reply(`✅ Auto-reply "${removeTrigger}" supprimé!`);
                } else {
                    await extra.reply(`❌ Aucun auto-reply trouvé pour "${removeTrigger}"`);
                }
                break;
                
            case 'on':
            case 'enable':
            case 'active':
                data[from].enabled = true;
                writeDB(data);
                await extra.reply('✅ Auto-replies activés!');
                break;
                
            case 'off':
            case 'disable':
            case 'desactive':
                data[from].enabled = false;
                writeDB(data);
                await extra.reply('❌ Auto-replies désactivés!');
                break;
                
            default:
                await extra.reply('❌ Commande invalide.\n\nUsage:\n• .autoreply add [trigger] [réponse]\n• .autoreply remove [trigger]\n• .autoreply list\n• .autoreply on/off');
        }
    }
};

// Export check function for handler
module.exports.checkAutoreply = checkAutoreply;