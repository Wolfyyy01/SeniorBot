const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require('discord.js');
const { manager } = require('../../events/giveaway')

module.exports = {
    name: 'giveaway-start',
    description: "Create a giveaway",
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    options: [
        {
            name: 'channel',
            description: 'Channel fro giveaway',
            type: ApplicationCommandOptionType.Channel,
            required: true
        },
        {
            name: 'prize',
            description: 'Giveaway prize',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'winnercount',
            description: 'Giveaway prize',
            type: ApplicationCommandOptionType.Number,
            required: true
        },
        {
            name: 'duration',
            description: 'Giveaway duration',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const channel = interaction.options.getChannel("channel");
        const prize = interaction.options.getString("prize");
        const winnerCount = interaction.options.getNumber("winnercount");
        const duration = interaction.options.getString("duration");
        interaction.reply({
            content: `Giveaway Started`,
            ephemeral: true,
        });
        manager
            .start(interaction, {
                channel: channel,
                duration: duration,
                prize: prize,
                winnerCount: winnerCount,
            })
            .catch((e) => {
                console.log(e);
            });
    }
};
