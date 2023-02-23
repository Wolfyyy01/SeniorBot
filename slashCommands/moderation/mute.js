const { ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const {color} = require('../../botconfig/config.json')
const ms = require('ms')

module.exports = {
	name: 'mute',
	description: "Mute a user.",
	type: ApplicationCommandType.ChatInput,
	userPerms: ['ModerateMembers'],
	botPerms: ['SendMessages' , "ModerateMembers"],
    options: [
        {
            name: 'user',
            description: 'The user you want to mute.',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'time',
            description: 'Time for mute.',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'reason',
            description: 'Reason for mute.',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
	run: async (client, interaction) => {
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')
        const time = interaction.options.getString('time')

        const convertedTime = ms(time);

        const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {})
        if(member == interaction.user) {
           return interaction.reply({ content: `Are you BAKA?You can't muted yourself!!`})
        }
		const embed = new EmbedBuilder()
			.setTitle('Mute')
			.setDescription(`${member} has beed muted with successfuly!\n**Reason:** ${reason}\n**Time:** ${time}`)
			.setColor(color)
			.setTimestamp()
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter({ text: client.user.tag })
        const errorEmbed = new EmbedBuilder()
        .setTitle('Kick Error')
        .setDescription(`I don't have permission or this user has a higher rank than me`)
        .setColor(color)
        .setTimestamp()
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter({ text: client.user.tag })
        try { await member.timeout(convertedTime, reason)
        interaction.reply({ embeds: [embed] })
        } catch(err) {
            console.log(err)
            interaction.reply({embeds: [errorEmbed]}) 
        }
	}
};