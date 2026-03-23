/**
 * Flirt - Get a random flirty pickup line
 */

const axios = require('axios');

module.exports = {
    name: 'flirt',
    aliases: ['pickup', 'pickupline'],
    category: 'fun',
    description: 'Get a random flirty pickup line',
    usage: '.flirt [@user]',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            // Local pickup lines as fallback
            const pickupLines = [
                "Are you a keyboard? Because you're my type!",
                "Do you have a map? I keep getting lost in your eyes.",
                "Is your name WiFi? Because I'm feeling a connection.",
                "Are you made of Copper and Tellurium? Because you are CuTe.",
                "Do you believe in love at first sight, or should I walk by again?",
                "Are you a camera? Because every time I look at you, I smile.",
                "Do you have a name, or can I just call you mine?",
                "Is this the Hogwarts Express? Because I'm feeling a magical connection.",
                "If you were a fruit, you'd be a Fine-apple.",
                "Do you have a band-aid? I scraped my knee falling for you.",
                "Are you made of beryllium, gold, and titanium? Because you're Be-Au-Ti-Ful!",
                "I must be a snowflake, because I've fallen for you.",
                "Are you a bank loan? Because you've got my interest.",
                "Do you have a map? I keep getting lost in your eyes.",
                "If beauty were a crime, you'd be serving a life sentence.",
                "Are you a time traveler? Because I see you in my future.",
                "I'm not a photographer, but I can picture us together.",
                "Do you believe in fate? Because I think we were meant to match.",
                "Are you a WiFi signal? Because I'm feeling a strong connection.",
                "Your hand looks heavy. Let me hold it for you."
            ];
            
            try {
                // Try to fetch from API first
                const response = await axios.get('https://api.shizo.top/quote/flirt-en?apikey=shizo', {
                    timeout: 5000
                });
                
                if (response.data && response.data.status && response.data.result) {
                    const flirtText = response.data.result;
                    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                    
                    if (mentioned.length > 0) {
                        await sock.sendMessage(from, {
                            text: flirtText,
                            mentions: mentioned
                        }, { quoted: msg });
                    } else {
                        await sock.sendMessage(from, { text: flirtText }, { quoted: msg });
                    }
                    return;
                }
            } catch (apiError) {
                // Fall back to local pickup lines
                console.log('Flirt API unavailable, using local pickup lines');
            }
            
            // Use local pickup lines
            const randomLine = pickupLines[Math.floor(Math.random() * pickupLines.length)];
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            
            if (mentioned.length > 0) {
                await sock.sendMessage(from, {
                    text: `${randomLine}`,
                    mentions: mentioned
                }, { quoted: msg });
            } else {
                await sock.sendMessage(from, {
                    text: `${randomLine}`
                }, { quoted: msg });
            }
            
        } catch (error) {
            console.error('Flirt Error:', error);
            await sock.sendMessage(from, { text: `❌ Error: ${error.message}` }, { quoted: msg });
        }
    }
};
