'use strict';

const { SlashCommandBuilder } = require('@discordjs/builders');
const Perms = require('../../classes/Permissions');
const Embed = require('../../classes/Embed');

module.exports = {
    name: 'help',
    description: 'Show all commands and information about the bot, or information about an individual command or module',
    aliases: [],
    syntax: 'help [command name]',
    requiredPermissions: {
        user: [],
        client: []
    },
    slashCommand: true,
    cooldown: 3000,
    selfPopulate() {
        this.data = new SlashCommandBuilder().setName('help').setDescription('Show all commands and information about the bot')
            .addStringOption(o => o.setName('command').setDescription('The command to get information about'));
    },
    async run(client, interaction, Guild) {
        const commandNameArg = interaction.options.getString('command');

        // If no command option passed, show the general help embed
        if (!commandNameArg) {
            const e = new Embed()
                .setColor(interaction.guild.members.me.roles.color?.hexColor || 0xffffff)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .addDescription('[ɪɴᴠɪᴛᴇ ᴍᴇ](https://discord.com/api/oauth2/authorize?client_id=794989015765483571&permissions=0&scope=bot%20applications.commands) ┃ [ꜱᴜᴘᴘᴏʀᴛ ꜱᴇʀᴠᴇʀ](https://discord.gg/ypEBGHB) \n')
                .addDescription(`Hey! I'm ${client.user.username} and I'm Open Source. You can find me [here](https://github.com/StrawHatHacker/Kiyo-Discord-Bot).`)
                .addDescription(`My prefix in this server is \`${Guild.prefix}\`\n\u200B`)
                .addDescription('Type `/help moduleName` to see all commands of that module.')
                .addDescription('Type `/help commandName` to see all information of that command.')
                .addField('Prefix Modules', Object.keys(client.modulesWithCommands).map(m => `\`${m}\``).join(', '))
                .addField('Slash Modules', Object.keys(client.modulesWithSlashCommands).map(m => `\`${m}\``).join(', '))
                .addField('Referrals', 'Cloud servers: [DigitalOcean](https://m.do.co/c/f51cd516e684), [Hetzner](https://hetzner.cloud/?ref=0fswF9Kv99Av)\nCDN: [BunnyCDN](https://bunnycdn.com/?ref=1dqicv581x)')
                .addField('Donate', '[Ko-fi](https://ko-fi.com/skillers3)');

            return await interaction.reply({ embeds: [e] });
        }

        // Search throught modules
        if (Object.keys(client.modulesWithCommands).includes(commandNameArg)) {
            const moduleCommands = client.modulesWithCommands[commandNameArg].map(c => c.name);
            return await sendModuleHelp(interaction, moduleCommands, commandNameArg);
        }

        if (Object.keys(client.modulesWithSlashCommands).includes(commandNameArg)) {
            let moduleCommands = [];

            if (commandNameArg === 'reactions') moduleCommands = client.modulesWithSlashCommands['reactions'][0].aliases;
            else moduleCommands = client.modulesWithSlashCommands[commandNameArg].map(c => c.name);

            return await sendModuleHelp(interaction, moduleCommands, commandNameArg);
        }

        // Search throught command names
        const cmd = client.commands.find(c => c.name.toLowerCase() === commandNameArg || c.aliases.includes(commandNameArg));
        if (cmd) return await sendCommandHelp(interaction, cmd);

        const slashCmd = client.slashCommands.find(c => c.name.toLowerCase() === commandNameArg);
        if (slashCmd) return await sendCommandHelp(interaction, slashCmd);

        await interaction.reply({ content: 'Command not found', ephemeral: true })
    }
};

const sendModuleHelp = async (interaction, moduleCommands, arg) => {
    const e = new Embed()
        .setColor(interaction.guild.members.me.roles.color?.hexColor || 0xffffff)
        .setTitle(`Module: ${arg}`)
        .addField('Commands', moduleCommands.sort().map(c => `\`${c}\``).join(', '));
    await interaction.reply({ embeds: [e] });
};

const sendCommandHelp = async (interaction, cmd) => {
    const e = new Embed()
        .setColor(interaction.guild.members.me.roles.color?.hexColor || 0xffffff)
        .setTitle(`Command: ${cmd.name}`)
        .addDescription(`Syntax: \`${cmd.syntax}\``)
        .addDescription(`Module: ${cmd.module}`);

    if (cmd.aliases?.length > 0) e.addDescription(`Aliases: ${cmd.aliases.map(c => `\`${c}\``).join(', ')}`);
    if (cmd.cooldown) e.addDescription(`Cooldown: ${Math.round(cmd.cooldown / 1000)} seconds`);

    e.addDescription(`User Permissions: ${cmd.requiredPermissions.user.length === 0 ? '`None`' : new Perms(cmd.requiredPermissions.user).formatToReadableCode()}`)
        .addDescription(`Bot Permissions: ${cmd.requiredPermissions.client.length === 0 ? '`None`' : new Perms(cmd.requiredPermissions.client).formatToReadableCode()}`)
        .addDescription('\n' + cmd.description);
    return await interaction.reply({ embeds: [e] });
};
