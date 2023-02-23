const { ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { color } = require('../../botconfig/config.json')

const Welcome = require('../../models/welcome')

module.exports = {
    name: 'welcome-setup',
    description: "Setup Welcome Channel",
    type: ApplicationCommandType.ChatInput,
    userPerms: ['Administrator'],
    botPerms: ['SendMessages', "KickMembers"],
    options: [
        {
            name: 'channel',
            description: 'The channel you want to send welcome message.',
            type: ApplicationCommandOptionType.Channel,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const channel = interaction.options.getChannel('channel')

        if (channel.type !== 0) {
            interaction.reply('Channel is not a text channel')
        }

        Welcome.findOne({ GuildId: interaction.guild.id }, async (err, data) => {
            if (data) {
                return interaction.reply({
                    content: 'You alreadey have a welcome channel set up. You can run `/welcome-disable` to remove it.',
                    ephemeral: true
                })
            } else {
                const embed = new EmbedBuilder()
                    .setTitle("Welcome Channel Set Up")
                    .setColor(color)
                    .setDescription(`Yor welcome channel has been set in ${channel}`)
                    .setFooter({ text: `${interaction.guild.name} welcome` })

                await Welcome.create({
                    GuildId: interaction.guild.id,
                    Channel: channel.id
                })

                interaction.reply({ embeds: [embed], ephemeral: true })
            }
        })
    }
};