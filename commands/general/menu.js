/**
 * Menu Command - Display bot menu (Mobile-friendly with box characters)
 */

const config = require('../../config');

module.exports = {
    name: 'menu',
    description: 'Display bot menu',
    category: 'general',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const menuText = `┌─── *${config.botName}* ───┐
│
│ 👋 Bienvenue!
│
├─ 📋 COMMANDES ─┤
│
│ 📌 Général
│ ├ .menu - Ce menu
│ ├ .ping - Tester le bot
│ ├ .info - Info du bot
│ ├ .owner - Propriétaire
│ └ .groupinfo - Groupe
│
│ 📥 Médias
│ ├ .facebook - FB video
│ ├ .instagram - IG media
│ ├ .tiktok - TikTok
│ ├ .pinterest - Pinterest
│ ├ .song - YouTube audio
│ ├ .video - YouTube video
│ ├ .lyrics - Paroles
│ ├ .igs - IG sticker
│ └ .igsc - IG sticker crop
│
│ 🎮 Fun
│ ├ .meme - Meme
│ ├ .joke - Blague
│ ├ .truth - Vérité
│ └ .dare - Défi
│
│ 🛡️ Admin (Groupe)
│ ├ .kick - Exclure
│ ├ .promote - Promouvoir
│ ├ .demote - Rétrograder
│ ├ .welcome - Welcome
│ ├ .tagall - Mentionner tous
│ └ .antilink - Anti-lien
│
│ 👑 Owner
│ ├ .broadcast - Diffuser
│ └ .block - Bloquer
│
├─── ⚡ INFO ────┤
│ Prefix: ${config.prefix}
│ Owner: ${config.ownerName[0]}
│ Version: 1.0.0
│
└───────────┘`;

        await sock.sendMessage(from, { text: menuText });
    }
};
