const jobs = ["👮Police", "👩‍⚕️Nurse", "👨‍🚒Fireman", "🧙‍♂️Mage"];

const ms = require("ms");

const { ApplicationCommandType, EmbedBuilder } = require("discord.js");
const { color } = require("../../botconfig/config.json");
const { User } = require("../../models/user");

module.exports = {
  name: "work",
  description: "Work to earn Money.",
  type: ApplicationCommandType.ChatInput,
  userPerms: [],
  botPerms: ["SendMessages"],
  cooldown: 1000 * 60 * 60,
  run: async (client, interaction) => {
    const user = interaction.user;

    const userData =
      (await User.findOne({ discordId: user.id })) ||
      new User({ discordId: user.id });

    if (userData.cooldowns.work > Date.now()) {
      const cooldown = new EmbedBuilder()
        .setTitle(user.username + " Work")
        .setDescription(
          `⏳You can work again in **${ms(
            userData.cooldowns.work - Date.now()
          )}**`
        )
        .setColor(color)
        .setTimestamp()
        .setThumbnail(user.displayAvatarURL())
        .setFooter({ text: client.user.tag });
      return interaction.reply({ embeds: [cooldown] });
    }

    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const amount = Math.floor(Math.random() * (200 - 10 + 1)) + 10;

    userData.wallet += amount;
    userData.cooldowns.work = Date.now() + 1000 * 60 * 60;
    userData.save();

    const embed = new EmbedBuilder()
      .setTitle(user.username + " Work")
      .addFields([
        {
          name: `Worked`,
          value: `${job}`,
          inline: true,
        },
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
