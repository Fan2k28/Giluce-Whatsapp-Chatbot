/**
 * List Command
 * Show all commands with descriptions
 */

const fs = require('fs');
const path = require('path');
const config = require('../../config');
const { loadCommands } = require('../../src/utils/commandLoader');

module.exports = {
    name: 'list',
    aliases: ['commandslist', 'cmdlist'],
    description: 'List all commands with descriptions',
    usage: '.list',
    category: 'general',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const prefix = config.prefix;
            const commands = loadCommands();
            const categories = {};
            
            // Group commands by category
            commands.forEach((cmd, name) => {
                if (cmd.name === name) { // Only count main command names, not aliases
                    const category = (cmd.category || 'other').toLowerCase();
                    if (!categories[category]) {
                        categories[category] = [];
                    }
                    categories[category].push({
                        name: cmd.name,
                        aliases: cmd.aliases || [],
                        description: cmd.description || ''
                    });
                }
            });
            
            let menu = `*${config.botName} - Commands List*\n`;
            menu += `Prefix: *${prefix}*\n\n`;
            
            const orderedCats = Object.keys(categories).sort();
            
            for (const cat of orderedCats) {
                menu += `*📂 ${cat.toUpperCase()}*\n`;
                for (const entry of categories[cat]) {
                    const cmdList = entry.aliases.length > 0 
                        ? `${entry.name} (${entry.aliases.join(', ')})`
                        : entry.name;
                    const label = entry.description || '';
                    menu += label ? `• \`${prefix}${cmdList}\` - ${label}\n` : `• ${prefix}${cmdList}\n`;
                }
                menu += '\n';
            }
            
            menu = menu.trimEnd();
            menu += `\n\n> *Powered by ${config.botName}*`;
            
            await sock.sendMessage(from, { text: menu });
            
        } catch (err) {
            console.error('list.js error:', err);
            await sock.sendMessage(from, { 
                text: '❌ Failed to load commands list.' 
            });
        }
    }
};
