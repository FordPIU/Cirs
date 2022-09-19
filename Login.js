// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./Config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Bot Logged In.');
});

// Init External Files
require('./Commands/_Deployer');

// Command Passer
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;
	console.log(commandName)
	require('./Commands/' + commandName)(interaction);
});

// Login to Discord with your client's token
client.login(token);

// Export Client
module.exports = function() { return client; }