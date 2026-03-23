/**
 * Insult - Give a silly insult to a user
 */

module.exports = {
    name: 'insult',
    aliases: ['insultme', 'burn'],
    category: 'fun',
    description: 'Give a silly insult to a user. Reply or mention to target someone.',
    usage: '.insult (reply or @user)',
    
    async execute(sock, msg, args, context) {
        const { from, sender } = context;
        
        try {
            const ctx = msg.message?.extendedTextMessage?.contextInfo || {};
            const mentioned = ctx.mentionedJid || [];
            let targetId = null;
            
            if (mentioned.length) targetId = mentioned[0];
            else if (ctx.participant) targetId = ctx.participant;
            else targetId = sender;

            const targetTag = `@${(targetId || sender).split('@')[0]}`;

            const insults = [
                "You're as useful as a white crayon.",
                "I'd call you sharp, but that would be offensive to pencils.",
                "You're like a cloud. When you disappear, it's a beautiful day.",
                "You bring everyone so much joy... when you leave the room.",
                "If laziness was an Olympic sport, you'd come in fourth — so you wouldn't have to walk up to the podium.",
                "You're the human equivalent of a typo.",
                "I'd explain it to you, but I left my crayons at home.",
                "You're proof that evolution can go in reverse.",
                "If you were any more inbred, you'd be a sandwich.",
                "You have the perfect face for radio.",
                "Are you a sickness? Each time you ring me up I want to disappear.",
                "You're like a software update. Whenever I see you, I think, 'Not now.'",
                "You have something on your chin... no, the third one down.",
            ];

            const line = insults[Math.floor(Math.random() * insults.length)];
            await sock.sendMessage(from, { text: `${line}`, mentions: [targetId] }, { quoted: msg });
            
        } catch (error) {
            console.error('[insult] ERROR:', error);
            await sock.sendMessage(from, { text: '❌ Something went wrong.' }, { quoted: msg });
        }
    }
};
