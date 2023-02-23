const { ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const {color} = require('../../botconfig/config.json')

module.exports = {
	name: 'ban',
	description: "Ban a user.",
	type: ApplicationCommandType.ChatInput,
	userPerms: ['BanMembers'],
	botPerms: ['SendMessages' , "BanMembers"],
    options: [
        {
            name: 'user',
            description: 'The user you want to ban.',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: 'Reason for ban.',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
	run: async (client, interaction) => {
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')
        const userToKick = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {})
        if(userToKick == interaction.user) {
           return interaction.reply({ content: `Are you BAKA?you can't ban yourself!!`})
        }
		const embed = new EmbedBuilder()
			.setTitle('Banned')
			.setDescription(`${userToKick} has beed banned with successfuly!\n**Reason:** ${reason}`)
			.setColor(color)
			.setTimestamp()
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter({ text: client.user.tag })
        const errorEmbed = new EmbedBuilder()
        .setTitle('Ban Error')
        .setDescription(`I don't have permission or this user has a higher rank than me`)
        .setColor(color)
        .setTimestamp()
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter({ text: client.user.tag })
        try { await userToKick.ban({
            reason: reason || " " 
        })
        interaction.reply({ embeds: [embed] })
        } catch(err) {interaction.reply({embeds: [errorEmbed]}) }
	}
};