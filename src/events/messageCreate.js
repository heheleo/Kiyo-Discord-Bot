'use strict';

const checkPermissions = require('../utils/checkForPermissions');
const errorHandler = require('../utils/messageErrorHandler');
const databaseUtils = require('../utils/database');
const onCooldown = require('../utils/onCooldown');

module.exports = async (client, message) => {
    // If guild is not available becase of outage return
    if (!message.guild.available) return;

    // If message came from another bot or it was from a non *text* channel, ignore it
    if (message.author.bot || message.channel.type !== 'GUILD_TEXT') return;

    // Fetching or creating a guild and the user if they don't exist in the database already
    const Guild = await databaseUtils.guild.findOneOrCreate(message.guild.id);
    const User = await databaseUtils.user.findOneOrCreate(message.author.id);

    // If the message is the bot mention return the prefix
    if (message.content === `<@!${client.user.id}>`) return message.channel.send(`My prefix in this server is \`${Guild.prefix}\``);

    // If message doesn't start with prefix, ignore it
    if (!message.content.toLowerCase().startsWith(Guild.prefix)) return;

    /*   str   array                     Slice off the prefix      Split at one or more spaces*/
    let [cmd, ...args] = message.content.slice(Guild.prefix.length).split(/\s+/g);
    cmd = cmd.toLowerCase(); // Lowercase the cmd to match it with lowercase aliases

    // Looping through all available commands
    for (const { name, run, aliases, requiredPermissions, cooldown } of client.commands) {

        // If cmd in not in aliases skip this command or not in command name
        if (!aliases.includes(cmd) && name.toLowerCase() !== cmd) continue;

        // Checking both member and bot permissions before executing the command
        if (!checkPermissions(message, name, requiredPermissions)) return;

        if (cooldown && onCooldown(name, message.author.id, cooldown) === true) return message.channel.send('You are on cooldown');

        /*   ,    array                        Slice off the prefix      Split at spaces*/
        let [, ...cleanArgs] = message.content.slice(Guild.prefix.length).split(/\s/g);

        // Run the command
        return run({ message, cmd, client, args, cleanArgs: cleanArgs.join(' '), Guild, User }).catch(e => errorHandler(e, message));
    }
};
