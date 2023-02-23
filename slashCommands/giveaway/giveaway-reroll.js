const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require('discord.js');
const { manager } = require('../../events/giveaway')

module.exports = {
    name: 'giveaway-reroll',
    description: "Reroll winers from a giveaway",
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
        let rerolled = await manager.rerollGiveaway(messageId);
        if (rerolled) {
            interaction.reply({
                content: `Giveaway Rerolled`,
            });
        } else {
            interaction.reply({
                content: `Invalid Giveaway`,
            });
        }
    }
};
