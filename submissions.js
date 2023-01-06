const {
	Client,
	EmbedBuilder,
	ModalBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
	TextInputBuilder,
	TextInputStyle,
} = require("discord.js");

const config = require("./config.json");

/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
	client.on("interactionCreate", async (interaction) => {
		if (interaction.isCommand()) {
			// Ping
			if (interaction.commandName == "ping") {
				if (interaction.user.id != config.admin) {
					return interaction.reply({
						content:
							"You cannot use that command because you are not the admin of the bot.",
						ephemeral: true,
					});
				} else {
					return interaction.reply({
						content: `> Pong! ${client.ws.ping}ms`,
					});
				}
			} else if (interaction.commandName == "setup") {
				if (interaction.user.id != config.admin) {
					return interaction.reply({
						content:
							"You cannot use that command because you are not the admin of the bot.",
						ephemeral: true,
					});
				} else {
					let signupChannel = interaction.guild.channels.cache.get(
						config.signupChannel
					);
					if (!signupChannel) return console.log("Error");

					let signupEmbed = new EmbedBuilder()
						.setTitle("Sign Up Here!")
						.setDescription(
							"Use the button below to enter your info!\n\nWe need your Apex Legends username, platform you're playing on, and your Twitch username. This is so we can find you and get in contact with you in case something happens."
						)
						.setThumbnail("https://i.sdcore.dev/95v93bqrh.png");

					let signupButtons = new ActionRowBuilder().addComponents([
						new ButtonBuilder()
							.setCustomId("signup_modal")
							.setStyle(ButtonStyle.Success)
							.setLabel("Tournament Sign Up")
							.setEmoji("✏️"),
					]);

					await signupChannel.send({
						embeds: [signupEmbed],
						components: [signupButtons],
					});

					return interaction.reply({
						content: "Sign Up embed added.",
						ephemeral: true,
					});
				}
			}
		}

		if (interaction.isButton()) {
			if (interaction.customId == "signup_modal") {
				const signupModal = new ModalBuilder()
					.setTitle("Sign Up")
					.setCustomId("signup_modal");

				const apexName = new TextInputBuilder()
					.setCustomId("signup_apex")
					.setLabel("Apex Username")
					.setMinLength(3)
					.setMaxLength(100)
					.setRequired(true)
					.setStyle(TextInputStyle.Short);

				const platform = new TextInputBuilder()
					.setCustomId("signup_platform")
					.setLabel("Platform (Steam/Origin, Xbox, or PlayStation)")
					.setMinLength(4)
					.setMaxLength(11)
					.setRequired(true)
					.setStyle(TextInputStyle.Short);

				const twitchName = new TextInputBuilder()
					.setCustomId("signup_twitch")
					.setLabel("Twitch Username")
					.setMinLength(4)
					.setMaxLength(75)
					.setRequired(true)
					.setStyle(TextInputStyle.Short);

				const rowApexName = new ActionRowBuilder().addComponents(
					apexName
				);

				const rowPlatform = new ActionRowBuilder().addComponents(
					platform
				);

				const rowTwitchName = new ActionRowBuilder().addComponents(
					twitchName
				);

				signupModal.addComponents(
					rowApexName,
					rowPlatform,
					rowTwitchName
				);

				await interaction.showModal(signupModal);
			}
		}

		if (interaction.isModalSubmit()) {
			const apexName =
				interaction.fields.getTextInputValue("signup_apex");
			const platform =
				interaction.fields.getTextInputValue("signup_platform");
			const twitchName =
				interaction.fields.getTextInputValue("signup_twitch");

			let submissionChannel = interaction.guild.channels.cache.get(
				config.submissionChannel
			);

			let submissionEmbed = new EmbedBuilder()
				.setTitle("New Signup Submission")
				.setDescription(
					`<@${interaction.user.id}> playing on ${platform}`
				)
				.addFields(
					{
						name: "Apex Username",
						value: apexName,
					},
					{
						name: "Platform",
						value: platform,
						inline: true,
					},
					{
						name: "Twitch Username",
						value: twitchName,
						inline: true,
					}
				)
				.setThumbnail(interaction.user.avatarURL())
				.setTimestamp();

			await submissionChannel.send({
				embeds: [submissionEmbed],
			});

			const guild = client.guilds.cache.get(interaction.guild.id);

			const member = guild.members.cache.find(
				(m) => m.id === interaction.user.id
			);

			if (member.roles.cache.has(config.tourneyRole)) {
				// if they already have the role
				// Do nothing

				return interaction.reply({
					content: `Your information has been submitted! Thanks!\n\n**You can now view the private match code in <#${config.tourneyCodeChannel}>. Please make sure to follow the rules and pay attention to stream while playing!**`,
					ephemeral: true,
				});
			} else {
				// if they don't have the role
				member.roles.add(config.tourneyRole); // add it

				return interaction.reply({
					content: `Your information has been submitted! Thanks!\n\n**You can now view the private match code in <#${config.tourneyCodeChannel}>. Please make sure to follow the rules and pay attention to stream while playing!**`,
					ephemeral: true,
				});
			}
		}
	});
};
