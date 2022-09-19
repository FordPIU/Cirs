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
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.addUserOption(option => option
			.setName('target')
			.setDescription('Person to warn.')
			.setRequired(true))
		.addStringOption(option => option
			.setName('reason')
			.setDescription('Reason for the warn.')
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