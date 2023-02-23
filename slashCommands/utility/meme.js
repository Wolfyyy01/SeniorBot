const { ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const {color} = require('../../botconfig/config.json')
const axios = require('axios')

module.exports = {
	name: 'meme',
	description: "Send a meme.",
	type: ApplicationCommandType.ChatInput,
	userPerms: [],
	botPerms: ['SendMessages' ],
	run: async (client, interaction) => {
        const { guild, options, member } = interaction;

        const platform = options.getString("platform");

        const embed = new EmbedBuilder();

        async function redditMeme() {
            await axios('https://www.reddit.com/r/memes/random/.json').then(async res => {
                let meme = await res.data;

                let title = meme[0].data.children[0].data.title;
                let url = meme[0].data.children[0].data.url;

                return interaction.reply({ embeds: [
                    embed
                    .setTitle(title)
                    .setImage(url)
                    .setURL(url)
                    .setColor(color)
                    .setTimestamp()
                    .setFooter({ text: client.user.tag, images: [`${client.user.displayAvatarURL()}`]})
                ] });
            });
        }



        if (platform === "reddit") {
            redditMeme();
        }

        //generating a random meme from any platform
        if (!platform) {
            let memes = [redditMeme];
            memes[Math.floor(Math.random() * memes.length)]();
        }
	}
};