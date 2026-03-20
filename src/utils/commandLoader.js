/**
 * Command Loader - Loads all commands from commands folder
 */

const fs = require('fs');
const path = require('path');

const commands = new Map();

const loadCommands = () => {
    const commandsDir = path.join(__dirname, '../../commands');
    
    if (!fs.existsSync(commandsDir)) {
        console.log('Commands directory not found, creating...');
        fs.mkdirSync(commandsDir, { recursive: true });
        return commands;
    }
    
    const loadFromDir = (dir, category = '') => {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                // Load commands from subdirectory
                loadFromDir(filePath, file);
            } else if (file.endsWith('.js')) {
                try {
                    const command = require(filePath);
                    
                    if (command.name) {
                        // Add category prefix if exists
                        const commandName = category ? `${category}_${command.name}` : command.name;
                        commands.set(command.name, command);
                        console.log(`Loaded command: ${command.name}`);
                    }
                } catch (error) {
                    console.error(`Error loading command ${file}:`, error.message);
                }
            }
        }
    };
    
    loadFromDir(commandsDir);
    console.log(`Total commands loaded: ${commands.size}`);
    
    return commands;
};

const getCommand = (name) => {
    return commands.get(name.toLowerCase());
};

const getAllCommands = () => {
    return commands;
};

module.exports = {
    loadCommands,
    getCommand,
    getAllCommands
};
