// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');

const { token } = require('./Config.json');

const { CheckBanDurations, GetServerStringFromIsSync } = require('./Utilities/Cmd_Moderation');
const { GetEpochMinutesFromParams } = require('./Utilities/Time');
const { logcommand } = require('./Utilities/Cmd')

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages
	]
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Bot Logged In.');
});

// Command Passer
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	// Compiler
	let { commandName } 	= interaction;
	let Exector 			= interaction.user;
	let Target 				= interaction.options.getUser('target');
	let Reason 				= interaction.options.getString('reason');
    let Type   				= interaction.options.getString('type');
    let Time   				= interaction.options.getInteger('time');
	let Sync   				= interaction.options.getBoolean('sync');
    let SyncString 			= await GetServerStringFromIsSync(Sync, interaction);
	let TimeDuration		= await GetEpochMinutesFromParams(Type, Time)
	let commandData = {
		"Exector": 		Exector,
		"Target": 		Target,
		"Reason":		Reason,
		"TimeType": 	Type,
		"TimeInt": 		Time,
		"IsSync": 		Sync,
		"SyncString": 	SyncString,
		"Duration":		TimeDuration,
	}

	require('./Commands/' + commandName)(interaction, commandData);
	logcommand(commandName, Target, Exector, SyncString, Reason, TimeDuration);
});

// Duration Checker
client.on('messageCreate', async message => {
	CheckBanDurations();
});

// Login to Discord with your client's token
client.login(token);

// Export Client
module.exports = function() { return client; }