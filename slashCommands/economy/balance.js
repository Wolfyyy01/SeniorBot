const {
  ApplicationCommandType,
  EmbedBuilder,
  ApplicationCommandOptionType,
} = require("discord.js");
const { color } = require("../../botconfig/config.json");
const { User } = require("../../models/user");
const { compactFormat } = require("cldr-compact-number");

module.exports = {
  name: "balance",
  description: "Check balance.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "Person whose balance you want to check.",
      type: ApplicationCommandOptionType.User,
    },
  ],
  userPerms: [],
  botPerms: ["SendMessages"],
  run: async (client, interaction) => {
    const user1 = interaction.options.get("user")?.user || interaction.user;

    const userData =
      (await User.findOne({ discordId: user1.id })) ||
      new User({ discordId: user1.id });

    const embed = new EmbedBuilder()
      .setTitle(user1.username + " Balance")
      .addFields([
        {
          name: `Wallet`,
          value: `${compactFormat(userData.wallet, "en", {
            significantDigits: 1,
            minimumFractionDigits: 1,
            maximumFractionDigits: 2,
          })} 🪙`,
          inline: true,
        },
      ])
      .setColor(color)
      .setTimestamp()
      .setThumbnail(user1.displayAvatarURL())
      .setFooter({ text: client.user.tag });

    interaction.reply({ embeds: [embed] });
  },
};
