const {
  ApplicationCommandType,
  EmbedBuilder,
} = require("discord.js");
const { color } = require("../../botconfig/config.json");
const { User } = require("../../models/user");

module.exports = {
  name: "leaderboard",
  description: "Show top members of the world who owns most money.",
  type: ApplicationCommandType.ChatInput,
  userPerms: [],
  botPerms: ["SendMessages"],
  run: async (client, interaction) => {

    const users = await User.find();

    const sortedUsers = users
      .sort((a, b) => {
        return b.wallet - (a.wallet);
      })
      .slice(0, 10);

    const embed = new EmbedBuilder()
      .setTitle("Leaderboard")
      .setDescription(
        sortedUsers
          .map((user, index) => {
            return `⟪${index + 1}⟫: **${client.users.cache.get(user.discordId).username}#${client.users.cache.get(user.discordId).discriminator}** → **${user.wallet
              } 🪙**`;
          })
          .join("\n")
      )
      .setColor(color)
      .setTimestamp()
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({ text: client.user.tag });

    interaction.reply({ embeds: [embed] });
  },
};
