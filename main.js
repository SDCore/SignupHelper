const {
	Client,
	GatewayIntentBits,
	ApplicationCommandType,
	ActivityType,
} = require("discord.js");
const { token, guildID } = require("./config.json");

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
	],
});

client.on("ready", async () => {
	console.log(`${client.user.username} is Online.`);

	client.user.setPresence({
		activities: [
			{ type: ActivityType.Watching, name: `your hiding spot ;)` },
		],
	});

	let guild = client.guilds.cache.get(guildID);

	if (guild) {
		await guild.commands.set([
			{
				name: "ping",
				description: "Test bot up-ness.",
				type: ApplicationCommandType.ChatInput,
			},
			{
				name: "setup",
				description: "Set up the bot to do things and stuff.",
				type: ApplicationCommandType.ChatInput,
			},
		]);
	}

	// Load Submission Handler
	require("./submissions.js")(client);
});

client.login(token);
