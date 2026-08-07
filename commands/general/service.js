/**
 * Service Menu - MTN-style interactive client service using Baileys v7 Native Flow
 */

const fs = require('fs');
const path = require('path');
const config = require('../../config');
const { proto, generateMessageIDV2 } = require('@whiskeysockets/baileys');

const BOT_IMAGE_PATH = path.join(__dirname, '../../src/bot_image.png');

const serviceData = {
    main: {
        text: `👋 Bienvenue chez *Ghostroar Digital* !

En quoi pouvons-nous vous aider aujourd'hui ?`,
        footer: 'Ghostroar Digital - Votre partenaire digital',
        buttons: [
            { id: 'btn_services', label: '🚀 Services' },
            { id: 'btn_support', label: '🎧 Support Client' },
            { id: 'btn_pricing', label: '💰 Tarifs' },
            { id: 'btn_about', label: 'ℹ️ À Propos' }
        ]
    },
    services: {
        text: `🚀 *Nos Services*

Choisissez un service pour plus d'informations :`,
        footer: 'Ghostroar Digital',
        buttons: [
            { id: 'svc_web', label: '🌐 Sites Web' },
            { id: 'svc_bot', label: '🤖 Bots WhatsApp' },
            { id: 'svc_design', label: '🎨 Design UI/UX' },
            { id: 'svc_marketing', label: '📈 Marketing Digital' },
            { id: 'svc_hosting', label: '☁️ Hébergement' },
            { id: 'back_main', label: '🔙 Retour' }
        ]
    },
    support: {
        text: `🎧 *Support Client*

Comment puis-je vous aider ?`,
        footer: 'Ghostroar Digital',
        buttons: [
            { id: 'sup_technical', label: '🛠️ Support Technique' },
            { id: 'sup_billing', label: '💳 Facturation' },
            { id: 'sup_account', label: '👤 Compte' },
            { id: 'sup_other', label: '📝 Autre' },
            { id: 'back_main', label: '🔙 Retour' }
        ]
    },
    pricing: {
        text: `💰 *Nos Tarifs*

Sélectionnez un pack :`,
        footer: 'Ghostroar Digital',
        buttons: [
            { id: 'price_basic', label: '🥉 Pack Basique' },
            { id: 'price_pro', label: '🥇 Pack Pro' },
            { id: 'price_enterprise', label: '💎 Pack Entreprise' },
            { id: 'back_main', label: '🔙 Retour' }
        ]
    },
    about: {
        text: `ℹ️ *À Propos de Ghostroar Digital*

Ghostroar Digital est une agence digitale spécialisée dans la création de solutions web et mobiles innovantes.

📧 Email: contact@ghostroar.com
🌐 Site: https://ghostroar.com`,
        footer: 'Ghostroar Digital',
        buttons: [
            { id: 'back_main', label: '🔙 Retour' }
        ]
    },
    web: {
        text: `🌐 *Sites Web*

Sites modernes, responsifs et optimisés SEO.

💰 À partir de 50.000 FCFA`,
        footer: 'Ghostroar Digital',
        buttons: [
            { id: 'back_services', label: '🔙 Retour' }
        ]
    },
    bot: {
        text: `🤖 *Bots WhatsApp*

Automatisation et bots sur mesure.

💰 À partir de 75.000 FCFA`,
        footer: 'Ghostroar Digital',
        buttons: [
            { id: 'back_services', label: '🔙 Retour' }
        ]
    },
    design: {
        text: `🎨 *Design UI/UX*

Interfaces modernes et expériences utilisateur optimisées.

💰 À partir de 40.000 FCFA`,
        footer: 'Ghostroar Digital',
        buttons: [
            { id: 'back_services', label: '🔙 Retour' }
        ]
    },
    marketing: {
        text: `📈 *Marketing Digital*

Stratégies de croissance en ligne.

💰 Forfaits personnalisés`,
        footer: 'Ghostroar Digital',
        buttons: [
            { id: 'back_services', label: '🔙 Retour' }
        ]
    },
    hosting: {
        text: `☁️ *Hébergement*

Cloud managé et hébergement performant.

💰 À partir de 10.000 FCFA/mois`,
        footer: 'Ghostroar Digital',
        buttons: [
            { id: 'back_services', label: '🔙 Retour' }
        ]
    },
    technical: {
        text: `🛠️ *Support Technique*

Notre équipe vous aide sous 24h.

📧 support@ghostroar.com`,
        footer: 'Ghostroar Digital',
        buttons: [
            { id: 'back_support', label: '🔙 Retour' }
        ]
    },
    billing: {
        text: `💳 *Facturation*

Questions paiements et devis.

📧 billing@ghostroar.com`,
        footer: 'Ghostroar Digital',
        buttons: [
            { id: 'back_support', label: '🔙 Retour' }
        ]
    },
    account: {
        text: `👤 *Gestion de Compte*

Problèmes de compte et accès.

📧 support@ghostroar.com`,
        footer: 'Ghostroar Digital',
        buttons: [
            { id: 'back_support', label: '🔙 Retour' }
        ]
    },
    other: {
        text: `📝 *Autre Demande*

Contactez-nous directement.

📧 contact@ghostroar.com`,
        footer: 'Ghostroar Digital',
        buttons: [
            { id: 'back_support', label: '🔙 Retour' }
        ]
    },
    basic: {
        text: `🥉 *Pack Basique* - 50.000 FCFA

• Site vitrine 5 pages
• Design responsive
• Hébergement 1 an`,
        footer: 'Ghostroar Digital',
        buttons: [
            { id: 'back_pricing', label: '🔙 Retour' }
        ]
    },
    pro: {
        text: `🥇 *Pack Pro* - 150.000 FCFA

• Site avancé 15 pages
• Blog + SEO
• Support prioritaire`,
        footer: 'Ghostroar Digital',
        buttons: [
            { id: 'back_pricing', label: '🔙 Retour' }
        ]
    },
    enterprise: {
        text: `💎 *Pack Entreprise* - Sur devis

• Solution sur mesure
• E-commerce
• Support 24/7`,
        footer: 'Ghostroar Digital',
        buttons: [
            { id: 'back_pricing', label: '🔙 Retour' }
        ]
    }
};

const conversationState = new Map();

const getConversationKey = (jid) => `${jid}_service`;

const setConversationState = (jid, state) => {
    const key = getConversationKey(jid);
    conversationState.set(key, { state, timestamp: Date.now() });
};

const getConversationState = (jid) => {
    const key = getConversationKey(jid);
    return conversationState.get(key)?.state || null;
};

const clearConversationState = (jid) => {
    const key = getConversationKey(jid);
    conversationState.delete(key);
};

const buildNativeFlowMessage = (menuKey) => {
    const menu = serviceData[menuKey];
    if (!menu || !menu.buttons) return null;

    const buttons = menu.buttons.map((btn) =>
        proto.Message.InteractiveMessage.NativeFlowMessage.NativeFlowButton.create({
            name: 'cta_reply',
            buttonParamsJson: JSON.stringify({
                display_text: btn.label,
                id: btn.id
            })
        })
    );

    return proto.Message.InteractiveMessage.NativeFlowMessage.create({
        buttons,
        messageVersion: 1
    });
};

const sendInteractiveMenu = async (sock, from, menuKey) => {
    const menu = serviceData[menuKey];
    if (!menu) return;

    setConversationState(from, menuKey);

    const nativeFlow = buildNativeFlowMessage(menuKey);
    if (!nativeFlow) return;

    let headerImageBytes = null;
    try {
        if (fs.existsSync(BOT_IMAGE_PATH)) {
            headerImageBytes = fs.readFileSync(BOT_IMAGE_PATH);
        }
    } catch (e) {
        console.error('[ServiceMenu] Failed to read bot image:', e.message);
    }

    const interactiveMessage = proto.Message.InteractiveMessage.create({
        body: proto.Message.InteractiveMessage.Body.create({
            text: menu.text
        }),
        footer: proto.Message.InteractiveMessage.Footer.create({
            text: menu.footer || 'Ghostroar Digital'
        }),
        header: headerImageBytes
            ? proto.Message.InteractiveMessage.Header.create({
                  title: config.botName,
                  hasMediaAttachment: true,
                  jpegThumbnail: headerImageBytes
              })
            : proto.Message.InteractiveMessage.Header.create({
                  title: config.botName,
                  hasMediaAttachment: false
              }),
        nativeFlowMessage: nativeFlow
    });

    const messagePayload = proto.Message.create({
        viewOnceMessage: {
            message: proto.Message.create({
                messageContextInfo: {},
                interactiveMessage
            })
        }
    });

    const msgId = generateMessageIDV2();
    console.log(`[ServiceMenu] sending menu=${menuKey} to=${from} msgId=${msgId} hasButtons=${interactiveMessage.nativeFlowMessage?.buttons?.length || 0}`);
    try {
        await sock.relayMessage(from, messagePayload, {
            messageId: msgId
        });
        console.log(`[ServiceMenu] sent menu=${menuKey} to=${from}`);
    } catch (e) {
        console.error(`[ServiceMenu] failed to send menu=${menuKey} to=${from}:`, e.message);
        await sock.sendMessage(from, {
            text: `Menu: ${menu.text}\n\n⚠️ Interactive buttons failed to load. Please use the text-based menu.`
        });
    }
};

const handleServiceResponse = async (sock, msg, context) => {
    const { from, content } = context;
    
    // Try interactive response first
    const response = (content?.interactiveResponseMessage || msg.message?.interactiveResponseMessage)?.nativeFlowResponseMessage;
    
    console.log(`[ServiceMenu] handleServiceResponse from=${from} response=${response ? 'found' : 'none'} contentKeys=${content ? Object.keys(content).join(',') : 'none'}`);

    if (response) {
        let params = {};
        try {
            params = JSON.parse(response.paramsJson || '{}');
        } catch (e) {
            console.log(`[ServiceMenu] failed to parse paramsJson: ${response.paramsJson}`);
            params = {};
        }

        const buttonId = params.id;
        console.log(`[ServiceMenu] buttonId=${buttonId} from=${from}`);
        if (!buttonId) return false;

        return await handleButtonAction(sock, from, buttonId);
    }
    
    // Fallback: if user sends text that matches a button label or command
    const body = (content?.conversation || content?.extendedTextMessage?.text || '').trim();
    if (!body) return false;
    
    const state = getConversationState(from);
    console.log(`[ServiceMenu] fallback text body="${body}" state=${state}`);
    
    // Check if it's a command
    // if (body === '.service' || body === 'service' || body === 'menu') {
    //     await sendInteractiveMenu(sock, from, 'main');
    //     return true;
    // }
    
    // Check if it's a back command
    if (body === '0' || body.toLowerCase() === 'retour' || body.toLowerCase() === 'back') {
        if (state === 'services' || state === 'web' || state === 'bot' || state === 'design' || state === 'marketing' || state === 'hosting') {
            await sendInteractiveMenu(sock, from, 'services');
            return true;
        }
        if (state === 'support' || state === 'technical' || state === 'billing' || state === 'account' || state === 'other') {
            await sendInteractiveMenu(sock, from, 'support');
            return true;
        }
        if (state === 'pricing' || state === 'basic' || state === 'pro' || state === 'enterprise') {
            await sendInteractiveMenu(sock, from, 'pricing');
            return true;
        }
        await sendInteractiveMenu(sock, from, 'main');
        return true;
    }
    
    // Try to match button labels (fuzzy match)
    const buttonMap = {
        '🚀 services': 'btn_services',
        'services': 'btn_services',
        '🎧 support client': 'btn_support',
        'support': 'btn_support',
        '💰 tarifs': 'btn_pricing',
        'tarifs': 'btn_pricing',
        'ℹ️ à propos': 'btn_about',
        'a propos': 'btn_about',
        '🌐 sites web': 'svc_web',
        'sites web': 'svc_web',
        '🤖 bots whatsapp': 'svc_bot',
        'bots whatsapp': 'svc_bot',
        '🎨 design ui/ux': 'svc_design',
        'design': 'svc_design',
        '📈 marketing digital': 'svc_marketing',
        'marketing': 'svc_marketing',
        '☁️ hébergement': 'svc_hosting',
        'hebergement': 'svc_hosting',
        '🛠️ support technique': 'sup_technical',
        'support technique': 'sup_technical',
        '💳 facturation': 'sup_billing',
        'facturation': 'sup_billing',
        '👤 compte': 'sup_account',
        'compte': 'sup_account',
        '📝 autre': 'sup_other',
        'autre': 'sup_other',
        '🥉 pack basique': 'price_basic',
        'pack basique': 'price_basic',
        '🥇 pack pro': 'price_pro',
        'pack pro': 'price_pro',
        '💎 pack entreprise': 'price_enterprise',
        'pack entreprise': 'price_enterprise',
        '🔙 retour': 'back_main',
        'retour': 'back_main'
    };
    
    const normalizedBody = body.toLowerCase();
    const matchedButtonId = Object.entries(buttonMap).find(([key]) => normalizedBody.includes(key))?.[1];
    
    if (matchedButtonId) {
        console.log(`[ServiceMenu] matched button from text: ${matchedButtonId}`);
        return await handleButtonAction(sock, from, matchedButtonId);
    }
    
    return false;
};

const handleButtonAction = async (sock, from, buttonId) => {
    switch (buttonId) {
        case 'btn_services':
            await sendInteractiveMenu(sock, from, 'services');
            return true;
        case 'btn_support':
            await sendInteractiveMenu(sock, from, 'support');
            return true;
        case 'btn_pricing':
            await sendInteractiveMenu(sock, from, 'pricing');
            return true;
        case 'btn_about':
            await sendInteractiveMenu(sock, from, 'about');
            return true;
        case 'svc_web':
            await sendInteractiveMenu(sock, from, 'web');
            return true;
        case 'svc_bot':
            await sendInteractiveMenu(sock, from, 'bot');
            return true;
        case 'svc_design':
            await sendInteractiveMenu(sock, from, 'design');
            return true;
        case 'svc_marketing':
            await sendInteractiveMenu(sock, from, 'marketing');
            return true;
        case 'svc_hosting':
            await sendInteractiveMenu(sock, from, 'hosting');
            return true;
        case 'sup_technical':
            await sendInteractiveMenu(sock, from, 'technical');
            return true;
        case 'sup_billing':
            await sendInteractiveMenu(sock, from, 'billing');
            return true;
        case 'sup_account':
            await sendInteractiveMenu(sock, from, 'account');
            return true;
        case 'sup_other':
            await sendInteractiveMenu(sock, from, 'other');
            return true;
        case 'price_basic':
            await sendInteractiveMenu(sock, from, 'basic');
            return true;
        case 'price_pro':
            await sendInteractiveMenu(sock, from, 'pro');
            return true;
        case 'price_enterprise':
            await sendInteractiveMenu(sock, from, 'enterprise');
            return true;
        case 'back_main':
            await sendInteractiveMenu(sock, from, 'main');
            return true;
        case 'back_services':
            await sendInteractiveMenu(sock, from, 'services');
            return true;
        case 'back_support':
            await sendInteractiveMenu(sock, from, 'support');
            return true;
        case 'back_pricing':
            await sendInteractiveMenu(sock, from, 'pricing');
            return true;
        default:
            return false;
    }
};

module.exports = {};
