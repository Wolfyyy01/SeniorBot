const { ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const { color } = require('../../botconfig/config.json')

const Ticket = require('../../models/ticket')

module.exports = {
    name: 'ticket-setup',
    description: "Setup Tickets",
    type: ApplicationCommandType.ChatInput,
    userPerms: ['Administrator'],
    botPerms: ['SendMessages', "KickMembers"],
    options: [
        {
            name: 'channel',
            description: 'The channel you want to send ticket message.',
            type: ApplicationCommandOptionType.Channel,
            required: true
        },
        {
            name: 'category',
            description: 'The category you want the ticket to be sent in..',
            type: ApplicationCommandOptionType.Channel,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const channel = interaction.options.getChannel('channel')
        const category = interaction.options.getChannel('category')

        if (channel.type !== 0) {
            interaction.reply('Channel is not a text channel')
        }
        if (category.type !== 4) {
            interaction.reply('Category is not a cattegory channel')
        }


        Ticket.findOne({ GuildId: interaction.guild.id }, async (err, data) => {
            if (!data) {
                Ticket.create({
                    GuildId: interaction.guild.id,
                    Channel: category.id,
                    Ticket: 'first'
                })
            } else {
                return interaction.reply('You alreadey have a ticket message set up. You can run `/ticket-disable` to remove it.')
            }

            const embed = new EmbedBuilder()
                .setTitle("Ticket Set Up")
                .setColor(color)
                .setDescription("If you have a problem, open a ticket to talk to staff.")
                .setFooter({ text: `${interaction.guild.name} tickets` })

            const menu = new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId('select-ticket')
                        .setMaxValues(1)
                        .setPlaceholder('Select a topic ...')
                        .addOptions(
                            {
                                label: '🌏 General Support',
                                value: 'Subject: General Support'
                            },
                            {
                                label: '👮 Moderation Support',
                                value: 'Subject: Moderation Support'
                            },
                            {
                                label: '❤️ Server Support',
                                value: 'Subject: Server Support'
                            },
                            {
                                label: '🌚 Other',
                                value: 'Subject: Other'
                            }
                        )
                )
            await channel.send({ embeds: [embed], components: [menu] })
            await interaction.reply({
                content: `Your Ticket system has been set up in ${channel}`,
                ephemeral: true
            })
        })
    }
};