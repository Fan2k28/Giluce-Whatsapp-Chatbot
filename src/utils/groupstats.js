/**
 * Group Statistics - Track group message statistics
 */

const fs = require('fs');
const path = require('path');

const STATS_PATH = path.join(__dirname, '../../database/groupstats.json');

// Initialize file if not exists
if (!fs.existsSync(STATS_PATH)) {
    fs.writeFileSync(STATS_PATH, JSON.stringify({}, null, 2));
}

const readStats = () => {
    try {
        return JSON.parse(fs.readFileSync(STATS_PATH, 'utf-8'));
    } catch {
        return {};
    }
};

const writeStats = (data) => {
    fs.writeFileSync(STATS_PATH, JSON.stringify(data, null, 2));
};

const addMessage = (groupId, senderId) => {
    const stats = readStats();
    
    if (!stats[groupId]) {
        stats[groupId] = {
            totalMessages: 0,
            members: {},
            createdAt: Date.now()
        };
    }
    
    stats[groupId].totalMessages++;
    
    if (!stats[groupId].members[senderId]) {
        stats[groupId].members[senderId] = {
            messages: 0,
            firstSeen: Date.now()
        };
    }
    
    stats[groupId].members[senderId].messages++;
    
    writeStats(stats);
};

const getGroupStats = (groupId) => {
    const stats = readStats();
    return stats[groupId] || null;
};

const getTopMembers = (groupId, limit = 10) => {
    const stats = readStats();
    const group = stats[groupId];
    
    if (!group || !group.members) return [];
    
    return Object.entries(group.members)
        .sort((a, b) => b[1].messages - a[1].messages)
        .slice(0, limit)
        .map(([userId, data]) => ({ userId, messages: data.messages }));
};

const resetGroupStats = (groupId) => {
    const stats = readStats();
    delete stats[groupId];
    writeStats(stats);
};

module.exports = {
    addMessage,
    getGroupStats,
    getTopMembers,
    resetGroupStats
};
