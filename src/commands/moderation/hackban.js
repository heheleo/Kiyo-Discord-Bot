'use strict';

const createCase = require('../../utils/createCase');
const stripToID = require('../../utils/stripToID');
const Embed = require('../../classes/Embed');

module.exports = {
    name: 'hackban',
    description: 'Hackban a user who is not in the server',
    aliases: [],
    syntax: 'hackban <user id> [reason]',
    requiredPermissions: {
        user: ['BAN_MEMBERS'],
        client: ['BAN_MEMBERS']
    },
    cooldown: 5000,
    async run({ message, args, client }) {
        let userIDInput = args[0];
        if (!userIDInput) return;

        userIDInput = stripToID(userIDInput);

        const userToBan = await client.users.fetch(userIDInput, { cache: false });
        const reason = args.length > 1 ? args.slice(1).join(' ') : 'No reason provided';

        await message.guild.members.ban(userIDInput, { reason, days: 7 });
        userToBan && userToBan.send(`You have been banned from **${message.guild.name}** for: *${reason}*`).catch(() => null);

        await createCase(message.guild.id, userIDInput, message.author.id, reason, 'hackban');

        const e = new Embed().setDescription(`**${userToBan?.tag || userIDInput} has been hackbanned**`).isSuccess();
        await message.channel.send({ embeds: [e] });
    }
};
