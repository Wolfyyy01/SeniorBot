const { ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const { color } = require('../../botconfig/config.json')

const Ticket = require('../../models/ticket')

module.exports = {
    name: 'ticket-disable',
    description: "Disable Tickets",
    type: ApplicationCommandType.ChatInput,
    userPerms: ['Administrator'],
    botPerms: ['SendMessages', "KickMembers"],
    run: async (client, interaction) => {
        Ticket.deleteMany({ GuildId: interaction.guild.id }, async (err, data) => {
            await interaction.reply({
                content: `Your Ticket system has been removed`,
                ephemeral: true
            })
        })
    }
};