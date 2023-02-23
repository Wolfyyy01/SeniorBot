const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ComponentType } = require("discord.js");
const { color, prefix } = require('../../botconfig/config.json')
const helpemoji = require("../../botconfig/help.json");
const fs = require('fs')

module.exports = {
    name: "help",
    description: "See all commands!",
    userPerms: [],
    botPerms: ['SendMessages'],
    run: async (client, interaction, args) => {
        const dirs = [];
        const categories = [];

        fs.readdirSync('./slashCommands/').forEach((dir) => {
            let commands = fs.readdirSync(`./slashCommands/${dir}`).filter((file) => file.endsWith('.js')); // read each "category" folders inside "commands" folder and then filter out js files
            const cmds = commands.map((command) => { // map the commands files
                let file = require(`../../slashCommands/${dir}/${command}`);
                return { // return an object with properties
                    name: dir, // category name,
                    commands: { // command object with name, description and aliases properties
                        name: file.name, // command name
                        description: file.description, // command description
                        aliases: file.aliases // command aliases
                    }
                }
            });

            categories.push(cmds.filter(cat => cat.name === dir)); // push the categories of commands to the "categories" array
        });



        let page = 0; // define the page variable as 0
        const emojis = require('../../botconfig/help.json')

        const description = { // an object which stores the description for each category for the embed
            "info": "Commands that provide you information",
            "fun": "Fun & Games commands",
            "moderation": "Commands that moderate the server",
        }

        const menuOptions = [ // an array for the options of the dropdown menu (will push other options objects into it later)
            {
                label: 'home',
                description: 'Home page',
                emoji: '🏠',
                value: 'home'
            }
        ]

        categories.forEach(cat => {
            dirs.push(cat[0].name);
        });

        /* Help Embed */
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle('Help Menu')
            .setDescription(`My prefix: \`${prefix}\`\nSelect a category to view the commands`)
            .setThumbnail('https://cdn.discordapp.com/attachments/807991132021063710/1012442722063364147/Peeking-Zero-Two-Sticker.png')

        dirs.forEach((dir) => { // for each dir in the dirs array
            embed.addFields([{
                name: `${emojis[dir] || ''} ${dir.charAt(0).toUpperCase() + dir.slice(1).toLowerCase()}`, // field name included emoji and category name with first letter capitalized
                value: `${description[dir] ? description[dir] : `${dir.charAt(0).toUpperCase() + dir.slice(1).toLowerCase()} Commands`}` // description taken from the description object, if the category isn't in the description object, then it will be a default text that we set
            }]) // add a field to the help menu home page.

            menuOptions.push({ // push the menu select options for each category into the "menuOptions" array
                label: `${dir}`, // label of the select menu option
                description: `${dir} commands page`, // description of the select menu option
                emoji: `${emojis[dir] || ''}`, // emoji of the select menu option
                value: `${page++}` // the value of the select menu option which increase one for every select menu option using the ++ operator
            })
        });

        const row = new ActionRowBuilder().addComponents( // create a new ActionRowBuilder and add components
            new SelectMenuBuilder() // make a new SelectMenuBuilder
                .setCustomId('selectHelp') // custom id of the select menu
                .setPlaceholder('Click to see my category') // the placeholder of the select menu
                .addOptions(menuOptions) // add the "menuOptions" array which includes all categories of select menu options
        );

        var msg1 = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true }); // send the embed with await for edit embed later

        const filter = i => !i.user.bot; // filter bot from using the dropdown menu
        const collector = interaction.channel.createMessageComponentCollector({
            filter, // apply the filter
            componentType: ComponentType.SelectMenu,
            time: 30000
        });
        collector.on('collect', async (i) => {
            if (i.user.id !== interaction.user.id) return i.reply({ content: `This help page is not for you! Use the command \`${prefix}help\` yourself!`, ephemeral: true }); // if click menu user is not the message author then return an ephemeral message
            i.deferUpdate(); // use this so your select menu won't load slowly when u select an option

            const value = i.values[0];

            if (i.customId !== 'selectHelp') return; // if collected value's component custom id is not equals to "select" then return

            if (value && value !== 'home') { // if there is value collected and the value is not equals to "home"

                const embed2 = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`${emojis[categories[value][0].name] ? emojis[categories[value][0].name] : ''} Help Menu | ${categories[value][0].name}`)
                    .setDescription(
                        "" + categories[value].map((cmd) => `<a:ZeroTwo_HeartArrow:1012445176716865566> | \`${cmd.commands.name}\`\n (*${cmd.commands.description}*)`).join("\n ")
                    )
                    .setThumbnail('https://cdn.discordapp.com/attachments/807991132021063710/1012442722063364147/Peeking-Zero-Two-Sticker.png')
                msg1 = await msg1.edit({ embeds: [embed2], components: [row], fetchReply: true }); // edit the embed
            }

            if (value === 'home') { // if the collected value is equals to "home"
                const embed3 = new EmbedBuilder()
                    .setColor(color)
                    .setTitle('Help Menu')
                    .setDescription(`My prefix: \`${prefix}\`\nSelect a category to view the commands`)
                    .setThumbnail('https://cdn.discordapp.com/attachments/807991132021063710/1012442722063364147/Peeking-Zero-Two-Sticker.png')

                dirs.forEach((dir) => { // for each dir in the dirs array
                    embed3.addFields([{
                        name: `${emojis[dir] || ''} ${dir.charAt(0).toUpperCase() + dir.slice(1).toLowerCase()}`, // field name included emoji and category name with first letter capitalized
                        value: `${description[dir] ? description[dir] : `${dir.charAt(0).toUpperCase() + dir.slice(1).toLowerCase()} Commands`}` // description taken from the description object, if the category isn't in the description object, then it will be a default text that we set
                    }])
                })

                msg1 = await msg1.edit({ embeds: [embed3], components: [row], fetchReply: true }); // edit the embed
            }

        });

        collector.on('end', async () => {
            msg1 = await msg1.edit({ embeds: [embed], components: [], fetchReply: true }); // remove the select menu from the embed
        });
    },
};
