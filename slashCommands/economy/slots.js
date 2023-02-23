const {
  ApplicationCommandType,
  EmbedBuilder,
  ApplicationCommandOptionType,
} = require("discord.js");
const { color } = require("../../botconfig/config.json");
const { User } = require("../../models/user");

module.exports = {
  name: "slots",
  description: "Bet your money for more.",
  type: ApplicationCommandType.ChatInput,
  cooldown: 1000 * 10,
  options: [
    {
      name: "amount",
      description: "Amount to bet.",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
  userPerms: [],
  botPerms: ["SendMessages"],
  run: async (client, interaction) => {
    const user = interaction.user;

    const userData =
      (await User.findOne({ discordId: user.id })) ||
      new User({ discordId: user.id });

    const amountToBet = interaction.options.get("amount")?.value;

    let amountWin;

    try {
      if (userData.wallet < amountToBet) {
        let noMoney = new EmbedBuilder()
          .setTitle(`${interaction.user.username}'s slots game`)
          .setDescription(`Insufficient money`)
          .setColor(color)
          .addFields([
            {
              name: `Your Wallet:`,
              value: `${userData.wallet}🪙`,
              inline: true,
            },
          ])
          .setTimestamp()
          .setThumbnail(user.displayAvatarURL())
          .setFooter({ text: client.user.tag });
        interaction.reply({ embeds: [noMoney] });
      } else if (amountToBet < 10) {
        let amountToBetLow = new EmbedBuilder()
          .setTitle(`${interaction.user.username}'s slots game`)
          .setDescription(`The minimum amount for the bet is: 10🪙`)
          .setColor(color)
          .setTimestamp()
          .setThumbnail(user.displayAvatarURL())
          .setFooter({ text: client.user.tag });
        interaction.reply({ embeds: [amountToBetLow] });
      } else {
        const slotItems = ["❤️", "🍉", "🍒", "🍓"];

        let win = false;
        let number = [];
        let text;

        for (let i = 0; i < 4; i++) {
          number[i] = Math.floor(Math.random() * slotItems.length);
        }

        if (number[0] == number[1] && number[1] == number[2]) {
          win = true;
          amountWin = amountToBet * 10;
          text = "YOU GOT IT 3!";
        }

        if (number[0] == number[1] && number[1] == number[3]) {
          win = true;
          amountWin = amountToBet * 10;
          text = "YOU GOT IT 3!";
        }

        if (number[0] == number[2] && number[2] == number[3]) {
          win = true;
          amountWin = amountToBet * 10;
          text = "YOU GOT IT 3!";
        }

        if (
          number[0] == number[1] &&
          number[1] == number[2] &&
          number[2] == number[3]
        ) {
          win = true;
          amountWin = amountToBet * 10 * 5;
          text = "YOU GOT IT 4!";
        }

        if (win) {
          let slotsEmbed1 = new EmbedBuilder()
            .setTitle(`${interaction.user.username}'s slots game`)
            .setDescription(
              `► ${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]
              } | ${slotItems[number[3]]} ◄\n\n**${text} YOU WON!!**`
            )
            .setColor("Green")
            .addFields([
              {
                name: `You Win`,
                value: `${amountWin}🪙`,
                inline: true,
              },
            ])
            .setTimestamp()
            .setThumbnail(user.displayAvatarURL())
            .setFooter({ text: client.user.tag });
          interaction.reply({ embeds: [slotsEmbed1] });
          userData.wallet += amountWin;
        } else {
          let slotsEmbed = new EmbedBuilder()
            .setTitle(`${interaction.user.username}'s slots game`)
            .setDescription(
              `► ${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]
              } | ${slotItems[number[3]]} ◄\n\nKeep trying!`
            )
            .setColor("Red")
            .addFields([
              {
                name: `Lost`,
                value: `${amountToBet}🪙`,
                inline: true,
              },
            ])
            .setTimestamp()
            .setThumbnail(user.displayAvatarURL())
            .setFooter({ text: client.user.tag });
          interaction.reply({ embeds: [slotsEmbed] });
          userData.wallet -= amountToBet;
        }
      }
      userData.save();
    } catch (err) {
      let error = new EmbedBuilder()
        .setTitle(`${interaction.user.username}'s slots game`)
        .setDescription(`Something went wrong`)
        .setColor("Red")
        .setTimestamp()
        .setThumbnail(user.displayAvatarURL())
        .setFooter({ text: client.user.tag });
      interaction.reply({ embeds: [error] });

      console.log(err);
    }
  },
};
