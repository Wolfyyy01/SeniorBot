const { ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const {color} = require('../../botconfig/config.json')

module.exports = {
	name: 'kick',
	description: "Kick a user.",
	type: ApplicationCommandType.ChatInput,
	userPerms: ['KickMembers'],
	botPerms: ['SendMessages' , "KickMembers"],
    options: [
        {
            name: 'user',
            description: 'The user you want to kick.',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: 'Reason for kick.',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
	run: async (client, interaction) => {
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')
        const userToKick = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {})
        if(userToKick == interaction.user) {
           return interaction.reply({ content: `Are you BAKA?You can't kick yourself!!`})
        }
		const embed = new EmbedBuilder()
			.setTitle('Kicked')
			.setDescription(`${userToKick} has beed kicked with successfuly!\n**Reason:** ${reason}`)
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
        try { await userToKick.kick({
            reason: reason || " " 
        })
        interaction.reply({ embeds: [embed] })
        } catch(err) {interaction.reply({embeds: [errorEmbed]}) }
	}
};