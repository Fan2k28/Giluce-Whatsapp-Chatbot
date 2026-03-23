/**
 * Truth - Get a random truth question
 */

module.exports = {
    name: 'truth',
    aliases: [],
    category: 'fun',
    description: 'Get a random truth question',
    usage: '.truth',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const truths = [
                "What is your biggest fear?",
                "What is the most embarrassing thing you've ever done?",
                "What is a secret you've never told anyone?",
                "Who is your secret crush?",
                "What is the worst thing you've ever said about someone?",
                "What is your biggest regret?",
                "What is the most trouble you've ever been in?",
                "What is something you're glad you'll never have to do again?",
                "What is the biggest lie you've ever told?",
                "What is your most unpopular opinion?",
                "What's the most embarrassing thing in your search history?",
                "What is something you've done that you can't believe you got away with?",
                "Who was your worst kiss?",
                "What is your guilty pleasure?",
                "What's the most childish thing you still do?",
                "What is the worst gift you have ever received?",
                "What is the most embarrassing thing your parents have caught you doing?",
                "What is a rumor you started?",
                "What's the worst date you've ever been on?",
                "What is your hidden talent?"
            ];
            
            const randomTruth = truths[Math.floor(Math.random() * truths.length)];
            
            await sock.sendMessage(from, {
                text: `🔮 *TRUTH*\n\n${randomTruth}`
            }, { quoted: msg });
            
        } catch (error) {
            console.error('Truth Error:', error);
            await sock.sendMessage(from, {
                text: `❌ Error: ${error.message}`
            }, { quoted: msg });
        }
    }
};
