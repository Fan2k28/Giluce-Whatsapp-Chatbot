/**
 * Menu Command - Display bot menu (Mobile-friendly with box characters)
 */

const config = require('../../config');

module.exports = {
    name: 'menu',
    aliases: ['help'],
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
│ ├ .uptime - Temps en ligne
│ ├ .github - Repo GitHub
│ ├ .list - Liste cmd
│ ├ .getpp - Photo de profil
│ ├ .qr - Générer QR code
│ ├ .translate - Traduire
│ ├ .tts - Texte en audio
│ ├ .ssweb - Capture écran
│ ├ .viewonce - Voir msg unique
│ ├ .groupinfo - Info groupe
│ ├ .groupstats - Stats groupe
│ ├ .myactivity - Mon activité
│ ├ .sticker - Créer sticker
│ ├ .simage - Sticker→image
│ ├ .take - Voler sticker
│ ├ .crop - Rogner sticker
│ ├ .attp - Sticker animé
│ └ .igs - Sticker Instagram
│
│ 📥 Médias
│ ├ .facebook - FB video
│ ├ .instagram - IG media
│ ├ .tiktok - TikTok
│ ├ .pinterest - Pinterest
│ ├ .song - YouTube audio
│ ├ .video - YouTube video
│ ├ .lyrics - Paroles
│ └ .igsc - IG sticker crop
│
│ 🎮 Fun
│ ├ .meme - Meme
│ ├ .joke - Blague
│ ├ .truth - Vérité
│ ├ .dare - Défi
│ ├ .compliment - Compliment
│ ├ .flirt - Flirt
│ ├ .insult - Insulte
│ ├ .ship - Ship users
│ ├ .gayrate - Gay rate
│ ├ .bomb - Jeu bombe
│ └ .ttt - TicTacToe
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
│ ├ .block - Bloquer
│ ├ .unblock - Débloquer
│ ├ .mode - Mode privé/public
│ ├ .setprefix - Changer préfixe
│ ├ .setbotname - Changer nom bot
│ ├ .setbotpp - Photo de profil
│ ├ .anticall - Anti-appel
│ ├ .autoreact - Auto-réaction
│ ├ .newsletter - Info chaîne
│ ├ .setnewsletter - Définir chaîne
│ ├ .setmenuimage - Image menu
│ ├ .restart - Redémarrer
│ └ .update - Mettre à jour
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
