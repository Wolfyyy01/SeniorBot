Install:

`npm install` or `npm i`

How to use:

Create a `.env` file for:

```
PREFIX=/
TOKEN=key
CLIENT_ID=ID
CLIENT_SECRET=Secret
GUILD_ID=ID
```


If you want slash commands, see use the SlashCommands folder in which you will create a new folder for each category and inside it a `.js` file in which you will use the following template:

```
const { ApplicationCommandType } = require('discord.js')
module.exports = {
	name: 'name', //name for command
	description: "description", //description for command
	type: ApplicationCommandType.ChatInput, //command type
  options: [
    {
      name: "option_name", //name for option
      description: "option_description", //description for option
      type: ApplicationCommandOptionType.String, /option type "Attachment", "Boolean", "Channel", "Integer", "Mentionable", "Number", "Role", "Role", "Subcommand", "SubcommandGroup"
    },
  ],
  userPerms: [], //user permissions
  botPerms: ["SendMessages"], //bot permissions
	cooldown: cooldown, //cooldown time in ms
	run: async (client, interaction) => {
		//command
	}
};
```
