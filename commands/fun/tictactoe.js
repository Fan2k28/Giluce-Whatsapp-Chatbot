/**
 * TicTacToe Game - Two player game
 */

const TicTacToe = require('../../src/utils/tictactoe');

// Store games globally
const games = {};

module.exports = {
    games, // Export for handler access
    name: 'tictactoe',
    aliases: ['ttt', 'xo'],
    category: 'fun',
    description: 'Play TicTacToe with another player',
    usage: '.ttt [room name]',
    
    async execute(sock, msg, args, context) {
        const { from, sender } = context;
        
        try {
            const text = args.join(' ').trim();
            
            // Check if player is already in a game
            const existingRoom = Object.values(games).find(room => 
                room.id.startsWith('tictactoe') && 
                [room.game.playerX, room.game.playerO].includes(sender)
            );
            
            if (existingRoom && existingRoom.state === 'PLAYING') {
                await sock.sendMessage(from, { 
                    text: '❌ You are still in a game. Type *surrender* to quit.' 
                }, { quoted: msg });
                return;
            }
            
            // Look for existing waiting room
            let room = Object.values(games).find(room => 
                room.state === 'WAITING' && 
                room.id.startsWith('tictactoe') &&
                (text ? room.name === text : !room.name)
            );
            
            if (room) {
                // Join existing room
                room.o = from;
                room.game.playerO = sender;
                room.state = 'PLAYING';
                
                const arr = room.game.render().map(v => ({
                    'X': '❎',
                    'O': '⭕',
                    '1': '1️⃣',
                    '2': '2️⃣',
                    '3': '3️⃣',
                    '4': '4️⃣',
                    '5': '5️⃣',
                    '6': '6️⃣',
                    '7': '7️⃣',
                    '8': '8️⃣',
                    '9': '9️⃣',
                }[v]));
                
                const str = `
🎮 *TicTacToe Game Started!*

Waiting for @${room.game.currentTurn.split('@')[0]} to play...

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

▢ *Room ID:* ${room.id}
▢ *Rules:*
• Make 3 rows of symbols vertically, horizontally or diagonally to win
• Type a number (1-9) to place your symbol
• Type *surrender* to give up
`;
                
                await sock.sendMessage(from, { 
                    text: str,
                    mentions: [room.game.currentTurn, room.game.playerX, room.game.playerO]
                }, { quoted: msg });
                
            } else {
                // Create new room
                room = {
                    id: 'tictactoe-' + (+new Date),
                    x: from,
                    o: '',
                    game: new TicTacToe(sender, 'o'),
                    state: 'WAITING'
                };
                
                if (text) room.name = text;
                
                await sock.sendMessage(from, { 
                    text: `⏳ *Waiting for opponent*\nType *.ttt ${text || ''}* to join!`
                }, { quoted: msg });
                
                games[room.id] = room;
            }
            
        } catch (error) {
            console.error('Error in tictactoe command:', error);
            await sock.sendMessage(from, { 
                text: '❌ Error starting game. Please try again.' 
            }, { quoted: msg });
        }
    },
};
