'use strict';

const checkPermissions = require('../utils/checkForPermissions');
const errorHandler = require('../utils/messageErrorHandler');
const GuildModel = require('../models/guild');
const databaseUtils = require('../utils/database');

module.exports = async (Kiyo, message) => {
    if (message.author.bot || message.channel.type === 'dm') return; // If message came from bot or in a dm channel, ignore it
    if (!message.content.toLowerCase().startsWith(Kiyo.globalPrefix)) return; // If message doesn't start with prefix, ignore it

    // Fetching or creating if doesn't exist a Guild in the database
    const Guild = await databaseUtils.guild.findOneOrCreate(GuildModel, message.guild.id);

    /*   str   array                     Slicing off the prefix          Spliting at spaces*/
    let [cmd, ...args] = message.content.slice(Kiyo.globalPrefix.length).split(/\s+/g);
    cmd = cmd.toLowerCase(); // Lowercasing the cmd to match it with lowercase aliases

    // Looping through all available commands
    for (const { name, run, aliases, requiredPermissions } of Kiyo.commands) {

        // If cmd in not in aliases skip this command
        if (!aliases.includes(cmd)) continue;

        // Checking both member and bot permissions
        if (!checkPermissions(Kiyo, message, name, requiredPermissions)) return;

        // Run the command
        run({ message, Kiyo, args }).catch(e => errorHandler(e, message));
    }
};