const { Manager } = require("real-giveaways");
const { EmbedBuilder, Colors } = require('discord.js');
const { client } = require('..')

class CustomManager extends Manager {
    GiveawayStartEmbed(giveaway) {
        let embed = new EmbedBuilder()
            .setColor(this.embedColor)
            .setTitle(`Giveaway Started`)
            .setTimestamp(Date.now())
            .setDescription(`Click on Join Button To Enter in Giveaway`)
            .setFooter({
                text: `0 Users Joined`,
            })
            .addFields([
                {
                    name: `Prize`,
                    value: `> \`${giveaway.prize}\``,
                    inline: true,
                },
                {
                    name: `Ends In`,
                    // value: `> <t:${giveaway.endTime}:R>`,
                    value: `> <t:${Math.floor(giveaway.endTime / 1000)}:R>`,

                    inline: true,
                },
                {
                    name: `Winners`,
                    value: `> \`${giveaway.winCount}\``,
                    inline: true,
                },
                {
                    name: `Hosted By`,
                    value: `> <@${giveaway.hostedBy}>`,
                    // inline: true,
                },
            ]);
        return embed;
    }
    GiveawayEndNoWinnerEmbed(giveaway) {
        let embed = new EmbedBuilder().setColor(this.embedColor)
            .setTitle(`Real Giveaways`)
            .setTimestamp(Date.now())
            .setDescription(`Giveaway Ended , No One Joined`)
            .setFooter({
                text: `${giveaway.entered} Users Joined`,
            })
            .addFields([
                {
                    name: `Ended At`,
                    value: `> <t:${Math.floor(Date.now() / 1000)}:R>`,
                    inline: true,
                },
                {
                    name: `Hosted By`,
                    value: `> <@${giveaway.hostedBy}>`,
                    inline: true,
                },
                {
                    name: `Prize`,
                    value: `> \`${giveaway.prize}\``,
                    inline: true,
                },
            ]);
        return embed;
    }
    GiveawayEndWinnerEmbed(giveaway) {
        let embed = new EmbedBuilder().setColor(this.embedColor)
            .setTitle(`Real Giveaways`)
            .setTimestamp(Date.now())
            .setDescription(
                `Giveaway Ended , ${giveaway.winners
                    .map((u) => `<@${u.userID}>`)
                    .join(", ")} are Winners`
            )
            .setFooter({
                text: `${giveaway.entered} Users Joined`,
            })
            .addFields([
                {
                    name: `Ended At`,
                    value: `> <t:${Math.floor(Date.now() / 1000)}:R>`,
                    inline: true,
                },
                {
                    name: `Hosted By`,
                    value: `> <@${giveaway.hostedBy}>`,
                    inline: true,
                },
                {
                    name: `Prize`,
                    value: `> \`${giveaway.prize}\``,
                    inline: true,
                },
            ]);
        return embed;
    }
}

const manager = new CustomManager(client, {
    embedColor: Colors.Blurple,
    pingEveryone: false,
    emoji: "🎁",
});

client.on("ready", () => {
    manager.connect(`mongodb+srv://EMS:${process.env.MONGO_PASS}@cluster0.18hzup7.mongodb.net/test`);
});

module.exports = { manager };


let embed = new EmbedBuilder().setColor("Blurple");

manager.on("GiveawayStarted", (message, giveaway) => {
    // console.log("GiveawayStarted");
    message.reply({
        embeds: [embed.setDescription(`Giveaway Started ` + giveaway.prize)],
    });
});
manager.on("GiveawayWinner", (message, giveaway) => {
    // console.log("GiveawayWinner");
    let Gwinners = giveaway.winners
        .map((winner) => `<@${winner.userID}>`)
        .join(", ");
    message.channel?.send({
        content: Gwinners,
        embeds: [
            embed.setDescription(
                `${Gwinners} Won The \`${giveaway.prize}\` Giveaway Prize. Hosted By <@${giveaway.hostedBy}>`
            ),
        ],
    });

    giveaway.winners.map(async (user) => {
        const u = await message.guild.members.fetch(user.userID);
        u.send({
            embeds: [
                embed.setDescription(
                    `You Won The Giveaway [\`Giveaway Link\`](${message.url})`
                ),
            ],
        });
    });
});
manager.on("GiveawayRerolled", (message, giveaway) => {
    // console.log("GiveawayRerolled");
    message.reply({
        embeds: [embed.setDescription(`\`${giveaway.prize}\` Giveaway Rerolled`)],
    });
});
manager.on("NoWinner", (message, giveaway) => {
    message.reply({
        embeds: [embed.setDescription(`No One Won ${giveaway.prize}`)],
    });
});
manager.on("InvalidGiveaway", (member, giveaway) => {
    member.send({
        embeds: [embed.setDescription(`You are Joining in Ended Giveaway`)],
    });
});
manager.on("UserJoinGiveaway", (member, giveaway) => {
    member.send({
        embeds: [embed.setDescription(`You Joined ${giveaway.prize} Giveaway`)],
    });
});
manager.on("UserLeftGiveaway", (member, giveaway) => {
    member.send({
        embeds: [embed.setDescription(`You Left ${giveaway.prize} Giveaway`)],
    });
});