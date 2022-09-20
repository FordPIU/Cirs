// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');
const { checkBans } = require('./Profiles/_Handler');
const { token } = require('./Config.json');

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

	const { commandName } = interaction;

	require('./Commands/' + commandName)(interaction);
});

// Duration Checker
client.on('messageCreate', async message => {
	checkBans();
});

// Login to Discord with your client's token
client.login(token);

// Export Client
module.exports = function() { return client; }