/**
 * GitHub Command - Show bot GitHub repository and stats
 */

const axios = require('axios');
const config = require('../../config');

module.exports = {
    name: 'github',
    aliases: ['repo', 'git', 'source', 'sc', 'script'],
    category: 'general',
    description: 'Show bot GitHub repository and statistics',
    usage: '.github',
    ownerOnly: false,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            // GitHub repository URL - change this to your repo
            const repoUrl = 'https://github.com/lastrat';
            const apiUrl = 'https://api.github.com/repos/lastrat/Giluce-Whatsapp-Chatbot';
            
            await sock.sendMessage(from, { 
                text: '🔍 Fetching GitHub repository information...',
                react: { text: '🔍', key: msg.key }
            });
            
            try {
                // Fetch repository data from GitHub API
                const response = await axios.get(apiUrl, {
                    headers: {
                        'User-Agent': 'Social-Bot'
                    },
                    timeout: 10000
                });
                
                const repo = response.data;
                
                // Format the response with proper styling
                let message = `╭━━『 *GitHub Repository* 』━━╮\n\n`;
                message += `🤖 *Bot Name:* ${config.botName}\n`;
                message += `🔗 *Repository:* ${repo.name}\n`;
                message += `👨‍💻 *Owner:* ${repo.owner.login}\n`;
                message += `📄 *Description:* ${repo.description || 'No description provided'}\n`;
                message += `🌐 *URL:* ${repo.html_url}\n\n`;
                
                message += `📊 *Repository Statistics*\n`;
                message += `⭐ *Stars:* ${repo.stargazers_count.toLocaleString()}\n`;
                message += `🍴 *Forks:* ${repo.forks_count.toLocaleString()}\n`;
                message += `👁️ *Watchers:* ${repo.watchers_count.toLocaleString()}\n`;
                message += `📦 *Size:* ${(repo.size / 1024).toFixed(2)} MB\n\n`;
                
                message += `🔗 *Quick Links*\n`;
                message += `⭐ Star: ${repo.html_url}/stargazers\n`;
                message += `🍴 Fork: ${repo.html_url}/fork\n`;
                message += `📥 Clone: git clone ${repo.clone_url}\n\n`;
                
                message += `╰━━━━━━━━━━━━━━━╯\n\n`;
                message += `> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${config.botName}*`;
                
                await sock.sendMessage(from, { text: message });
                
            } catch (apiError) {
                // Fallback message if API fails
                console.log('GitHub API Error:', apiError.message);
                
                let fallbackMessage = `╭━━『 *GitHub Repository* 』━━╮\n\n`;
                fallbackMessage += `🤖 *Bot Name:* ${config.botName}\n`;
                fallbackMessage += `🔗 *Repository:* Social-bot\n`;
                fallbackMessage += `👨‍💻 *Owner:* Lastrategie & Nounours\n`;
                fallbackMessage += `🌐 *URL:* ${repoUrl}\n\n`;
                fallbackMessage += `⚠️ *Note:* Unable to fetch real-time statistics.\n`;
                fallbackMessage += `Please visit the repository directly for latest stats.\n\n`;
                fallbackMessage += `╰━━━━━━━━━━━━━━━╯\n\n`;
                fallbackMessage += `> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${config.botName}*`;
                
                await sock.sendMessage(from, { text: fallbackMessage });
            }
            
        } catch (error) {
            console.error('GitHub command error:', error);
            await sock.sendMessage(from, { 
                text: `❌ Error: ${error.message}` 
            });
        }
    }
};
