const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require('discord.js');
const { manager } = require('../../events/giveaway')

module.exports = {
    name: 'giveaway-end',
    description: "End a giveaway",
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    options: [
        {
            name: 'messageid',
            description: 'Giveaway Message Id',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, interaction) => {
        let messageId = interaction.options.getString("messageid", true);
        let ended = await manager.endGiveaway(messageId);
        if (ended) {
            interaction.reply({
                content: `Giveaway Ended`,
            });
        } else {
            interaction.reply({
                content: `Invalid Giveaway`,
            });
        }
    }
};
