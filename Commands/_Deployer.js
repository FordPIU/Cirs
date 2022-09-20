const { SlashCommandBuilder, Routes, PermissionFlagsBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, token } = require('../Config.json');

async function Init() {
const commands = [
	//		ADMINISTARTIVE COMMANDS		\\

	// Warn Command
	new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warn a user.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addUserOption(option => option
			.setName('target')
			.setDescription('Person to warn.')
			.setRequired(true))
		.addStringOption(option => option
			.setName('reason')
			.setDescription('Reason for the warn.')
			.setRequired(true)),

	// Mute Command
	new SlashCommandBuilder()
	.setName('mute')
	.setDescription('Mute a user.')
	.setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
	.addUserOption(option => option
		.setName('target')
		.setDescription('Person to mute.')
		.setRequired(true))
	.addStringOption(option => option
		.setName('reason')
		.setDescription('Reason for the mute.')
		.setRequired(true))
	.addStringOption(option => option
		.setName('type')
		.setDescription('What type of time to mute the user for.')
		.setRequired(true)
		.addChoices(
			{ name: 'Minutes', value: 'minutes' },
			{ name: 'Hours',   value: 'hours'   },
			{ name: 'Days',    value: 'days'    },
			{ name: 'Weeks',   value: 'weeks'   },
			{ name: 'Months',  value: 'months'  },
			{ name: 'Years',   value: 'years'   },
		))
	.addIntegerOption(option => option
		.setName('time')
		.setDescription('How long is the mute.')
		.setRequired(true))
	.addBooleanOption(option => option
		.setName('sync')
		.setDescription('Do we sync across all servers.')
		.setRequired(true)),

	// Unmute Command
	new SlashCommandBuilder()
	.setName('unmute')
	.setDescription('Unmute a user.')
	.setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
	.addUserOption(option => option
		.setName('target')
		.setDescription('Person to unmute.')
		.setRequired(true))
	.addStringOption(option => option
		.setName('reason')
		.setDescription('Reason for the unmute.')
		.setRequired(true))
	.addBooleanOption(option => option
		.setName('sync')
		.setDescription('Do we sync across all servers.')
		.setRequired(true)),

	// Kick Command
	new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick a user.')
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.addUserOption(option => option
			.setName('target')
			.setDescription('Person to kick.')
			.setRequired(true))
		.addStringOption(option => option
			.setName('reason')
			.setDescription('Reason for the kick.')
			.setRequired(true))
		.addBooleanOption(option => option
			.setName('sync')
			.setDescription('Do we sync across all servers.')
			.setRequired(true)),

	// Ban Command
	new SlashCommandBuilder()
	.setName('ban')
	.setDescription('Ban a user.')
	.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
	.addUserOption(option => option
		.setName('target')
		.setDescription('Person to ban.')
		.setRequired(true))
	.addStringOption(option => option
		.setName('reason')
		.setDescription('Reason for the ban.')
		.setRequired(true))
	.addStringOption(option => option
		.setName('type')
		.setDescription('What type of time to ban the user for.')
		.setRequired(true)
		.addChoices(
			{ name: 'Minutes', value: 'minutes' },
			{ name: 'Hours',   value: 'hours'   },
			{ name: 'Days',    value: 'days'    },
			{ name: 'Weeks',   value: 'weeks'   },
			{ name: 'Months',  value: 'months'  },
			{ name: 'Years',   value: 'years'   },
		))
	.addIntegerOption(option => option
		.setName('time')
		.setDescription('How long is the ban.')
		.setRequired(true))
	.addBooleanOption(option => option
		.setName('sync')
		.setDescription('Do we sync across all servers.')
		.setRequired(true)),

	// Unban Command
	new SlashCommandBuilder()
	.setName('unban')
	.setDescription('Unban a user.')
	.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
	.addUserOption(option => option
		.setName('target')
		.setDescription('Person to unban.')
		.setRequired(true))
	.addStringOption(option => option
		.setName('reason')
		.setDescription('Reason for the unban.')
		.setRequired(true))
	.addBooleanOption(option => option
		.setName('sync')
		.setDescription('Do we sync across all servers.')
		.setRequired(true)),

]
.map(command => command.toJSON());

// Reset Command List, Thanks discord, doesn't work. Like always.
const rest = new REST({ version: '10' }).setToken(token);

await rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Deleted Previously Registered Commands.'))
	.catch(console.error);

await rest.put(
	Routes.applicationCommands(clientId),
	{ body: commands },
);

// Log.
console.log("Registerd " + commands.length + " Commands.");
}
Init();


/*
	>	node Commands/_Deployer.js
*/