const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require('discord.js');
const { manager } = require('../../events/giveaway')

module.exports = {
    name: 'giveaway-delete',
    description: "Delete a giveaway",
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
        let deleted = await manager.deleteGiveaway(messageId);
        interaction.reply({
            content: `Giveaway ${deleted ? "Deleted" : "Not Deleted"}`,
        });
    }
};
