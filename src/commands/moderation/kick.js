'use strict';

const hasModeratorPerms = require('../../utils/hasModeratorPerms');
const safeFindMember = require('../../utils/safeFindMember');
const createCase = require('../../utils/createCase');
const sendLog = require('../../utils/sendLog');
const Embed = require('../../classes/Embed');
const Err = require('../../classes/Err');

module.exports = {
    name: 'kick',
    description: 'Kick a member from the server',
    aliases: [],
    syntax: 'kick <member> [reason]',
    requiredPermissions: {
        user: ['KICK_MEMBERS'],
        client: ['KICK_MEMBERS']
    },
    cooldown: 2000,
    async run({ message, args, Guild }) {
        const memberInput = args[0];
        if (!memberInput) return;

        const memberToKick = await safeFindMember(message, memberInput);
        if (!memberToKick) throw new Err().inputErr().memberNotFound();

        if (!memberToKick.kickable) throw new Err(400).inputErr().setMessage('Member is higher in the role hierarchy');
        if (hasModeratorPerms(memberToKick)) throw new Err(400).inputErr().setMessage('Member has moderation permissions');

        const reason = args.length > 1 ? args.slice(1).join(' ') : 'No reason provided';

        await memberToKick.send(`You have been kicked from **${message.guild.name}** for: *${reason}*`).catch(() => null);
        await memberToKick.kick(reason);

        const e = new Embed().setDescription(`**${memberToKick.user.tag} has been kicked**`).isSuccess();
        await message.channel.send({ embeds: [e] });

        const NewCase = await createCase(message.guild.id, memberToKick.id, message.author.id, reason, 'kick');
        await sendLog('kick', Guild, message.guild, [memberToKick, NewCase], message.member, reason);
    }
};
