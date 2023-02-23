const { ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { color } = require('../../botconfig/config.json')

module.exports = {
    name: 'clear',
    description: "Delete message from a channel.",
    type: ApplicationCommandType.ChatInput,
    userPerms: ['ManageChannels'],
    botPerms: ['SendMessages', "KickMembers"],
    options: [
        {
            name: 'amount',
            description: 'Amount of messages to delete',
            type: ApplicationCommandOptionType.Number,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const amount = interaction.options.getNumber('amount')
        const channel = interaction.channel

        if (amount > 100 || amount < 1) {
            return interaction.reply({ content: `Please select a number between  100 and 1`, ephemeral: true })
        }

        await interaction.channel.bulkDelete(amount).catch(err => {
            return
        })
        const embed = new EmbedBuilder()
            .setTitle('Clear')
            .setDescription(`You cleared ${amount} messages from ${channel}`)
            .setColor(color)
            .setTimestamp()
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({ text: client.user.tag })

        interaction.reply({ embeds: [embed] }).catch(err => {
            return
        })
    }
};