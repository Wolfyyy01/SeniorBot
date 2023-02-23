const { ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { color } = require('../../botconfig/config.json')

const Welcome = require('../../models/welcome')

module.exports = {
    name: 'welcome-disable',
    description: "Disable Welcome Channel",
    type: ApplicationCommandType.ChatInput,
    userPerms: ['Administrator'],
    botPerms: ['SendMessages', "KickMembers"],
    run: async (client, interaction) => {
        Welcome.deleteMany({ GuildId: interaction.guild.id }, async (err, data) => {
            await interaction.reply({
                content: `Your Welcome channel has been removed`,
                ephemeral: true
            })
        })
    }
};