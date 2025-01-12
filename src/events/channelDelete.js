'use strict';

const GuildModel = require('../models/guild');
const sendLog = require('../utils/sendLog');

module.exports = async (_client, channel) => {
    if (channel.type === 'DM' || channel.type === 'GROUP_DM ') return;

    // If guild is not available because of outage return
    if (!channel.guild.available) return;

    const Guild = await GuildModel.findById(channel.guild.id);
    if (!Guild) return;

    await sendLog('channelDelete', Guild, channel.guild, channel);
};
