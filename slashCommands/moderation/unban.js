const { ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const {color} = require('../../botconfig/config.json')

module.exports = {
	name: 'unban',
	description: "Unban a user.",
	type: ApplicationCommandType.ChatInput,
	userPerms: ['KickMembers'],
	botPerms: ['SendMessages' , "BanMembers"],
    options: [
        {
            name: 'userid',
            description: 'The user id you want to unban.',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
	run: async (client, interaction) => {
        const user = interaction.options.getString('userid')
		const embed = new EmbedBuilder()
			.setTitle('Unbanned')
			.setDescription(`**${user}** has beed unbanned with successfuly!`)
			.setColor(color)
			.setTimestamp()
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter({ text: client.user.tag })
        const errorEmbed = new EmbedBuilder()
        .setTitle('Unban Error')
        .setDescription(`Please provide a valid member's ID.`)
        .setColor(color)
        .setTimestamp()
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter({ text: client.user.tag })
        try { await interaction.guild.bans.remove(user)
        interaction.reply({ embeds: [embed] })
        } catch(err) {interaction.reply({embeds: [errorEmbed]}) }
	}
};