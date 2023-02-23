const { Events, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js')
const { client } = require('..');
const Welcome = require('../models/welcome')
const { color } = require('../botconfig/config.json');

client.on(Events.GuildMemberAdd, async (member) => {
    const channelId = await Welcome.findOne({ GuildId: member.guild.id })
    const channel = member.guild.channels.cache.get(channelId.Channel)

    const embed = new EmbedBuilder()
        .setTitle(`Welcome to ${member.guild.name}`)
        .setColor(color)
        .setDescription(`${member} tocmai sa alaturat Serverului`)
        .addFields([
            {
                name: `Rules`,
                value: `Te invitam sa citesti regulamentul!`,
                inline: true,
            }])
        .setFooter({ text: `${member.guild.name} welcome` })
        .setThumbnail(member.displayAvatarURL())

    if (channelId == null) return

    channel.send({ embeds: [embed] })

})