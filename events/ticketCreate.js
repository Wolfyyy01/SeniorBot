const { ModalBuilder, TextInputBuilder, ActionRowBuilder, EmbedBuilder } = require('@discordjs/builders');
const { Events, TextInputStyle, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js')
const { client } = require('..');
const Ticket = require('../models/ticket')
const { color } = require('../botconfig/config.json')

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isButton()) return
    if (interaction.isChatInputCommand()) return
    if (interaction.customId === 'selectHelp') return

    const ticketModal = new ModalBuilder()
        .setTitle('Provide us with more information')
        .setCustomId('ticketModal')

    const username = new TextInputBuilder()
        .setCustomId('username')
        .setRequired(true)
        .setLabel("Provide us with your username")
        .setPlaceholder('This is your username')
        .setStyle(TextInputStyle.Short)

    const reason = new TextInputBuilder()
        .setCustomId('reason')
        .setRequired(true)
        .setLabel("The reason for this ticket")
        .setPlaceholder('Give us a reason for opening this ticket')
        .setStyle(TextInputStyle.Short)

    const ActionRow1 = new ActionRowBuilder().addComponents(username)
    const ActionRow2 = new ActionRowBuilder().addComponents(reason)

    ticketModal.addComponents(ActionRow1, ActionRow2)

    let choices

    if (interaction.isSelectMenu()) {
        choices = interaction.values

        const result = choices.join('')

        Ticket.findOne({ GuildId: interaction.guild.id }, async (err, data) => {
            const filter = { GuildId: interaction.guild.id }
            const update = { Ticket: result }

            Ticket.updateOne(filter, update, {
                new: true
            }).then(value => {
                console.log(value)
            })
        })
    }

    if (!interaction.isModalSubmit()) {
        interaction.showModal(ticketModal)
    }
})

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isModalSubmit()) {
        if (interaction.customId == 'ticketModal') {
            Ticket.findOne({ GuildId: interaction.guild.id }, async (err, data) => {
                const username = interaction.fields.getTextInputValue('username')
                const reason = interaction.fields.getTextInputValue('reason')

                const posChannel = await interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.id}`)
                if (posChannel) return interaction.reply({
                    content: `You already have a ticket open - ${posChannel}`,
                    ephemeral: true
                })

                const category = data.Channel
                const embed = new EmbedBuilder()
                    .setTitle(`${interaction.user.username}'s Ticket`)
                    .setDescription(`Welcome to your ticket! Please wait while the staff review your informations`)
                    .addFields({ name: 'Username', value: `${username}` })
                    .addFields({ name: 'Reason', value: `${reason}` })
                    .addFields({ name: 'Type', value: `${data.Ticket}` })
                    .setFooter({ text: `${interaction.guild.name} tickets` })

                const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('ticket')
                            .setLabel('🗑️ Close Ticket')
                            .setStyle(ButtonStyle.Danger)
                    )

                let channel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.id}`,
                    type: ChannelType.GuildText,
                    parent: `${category}`,
                    value: 'test'
                })

                let msg = await channel.send({ embeds: [embed], components: [button] })
                await interaction.reply({ content: `Your Ticket is now open in ${channel}`, ephemeral: true })

                const collector = msg.createMessageComponentCollector()

                collector.on('collect', async i => {
                    (await channel).delete()

                    const dmEmbed = new EmbedBuilder()
                        .setTitle('Your ticket has beed closed')
                        .setDescription('Thanks for contacting us! If you need anything else, feel free to create another ticket')
                        .setTimestamp()
                        .setFooter({ text: `${interaction.guild.name} tickets` })

                    await interaction.member.send({ embeds: [dmEmbed] }).catch(err => {
                        return
                    })
                })

            })
        }
    }
})