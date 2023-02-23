const ms = require("ms");

const {
  ApplicationCommandType,
  EmbedBuilder,
} = require("discord.js");
const { color } = require("../../botconfig/config.json");
const { User } = require("../../models/user");

module.exports = {
  name: "daily",
  description: "Daily free Money.",
  type: ApplicationCommandType.ChatInput,
  userPerms: [],
  botPerms: ["SendMessages"],
  cooldown: 1000 * 60 * 60 * 24,
  run: async (client, interaction) => {
    const user = interaction.user;

    const userData =
      (await User.findOne({ discordId: user.id })) ||
      new User({ discordId: user.id });

    if (userData.cooldowns.daily > Date.now()) {
      const cooldown = new EmbedBuilder()
        .setTitle(user.username + " Work")
        .setDescription(
          `⏳You can get daily moeny again in **${ms(
            userData.cooldowns.daily - Date.now()
          )}**`
        )
        .setColor(color)
        .setTimestamp()
        .setThumbnail(user.displayAvatarURL())
        .setFooter({ text: client.user.tag });
      return interaction.reply({ embeds: [cooldown] });
    }

    const amount = 500

    userData.wallet += amount;
    userData.cooldowns.daily = Date.now() + 1000 * 60 * 60 * 24;
    userData.save();

    const embed = new EmbedBuilder()
      .setTitle(user.username + " Daily")
      .addFields([
        {
          name: `Earn`,
          value: `${amount}🪙`,
          inline: true,
        },
      ])
      .setColor(color)
      .setTimestamp()
      .setThumbnail(user.displayAvatarURL())
      .setFooter({ text: client.user.tag });

    interaction.reply({ embeds: [embed] });
  },
};
