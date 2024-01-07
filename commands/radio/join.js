const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer } = require('@discordjs/voice');
const libsodium = require('libsodium-wrappers');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Joins the user\'s voice channel.'),

  async execute(interaction) {
    // Initialize libsodium
    await libsodium.ready;

    const logData = {
      guildId: interaction.guild?.id,
      channelId: interaction.channel?.id,
      userId: interaction.user?.id,
    };

    console.log(JSON.stringify(logData, (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString(); // Convert BigInt to string
      }
      return value;
    }, 2));

    const member = interaction.guild.members.cache.get(interaction.user.id);
    const channel = member?.voice.channel;

    console.log('Selected Channel:', channel);

    if (!channel) {
      const embed = {
        color: 0xff0000, // Red color for error
        title: interaction.client.user.username,
        fields: [
          {
            name: 'Status',
            value: 'Error.',
          },
          {
            name: 'Error:',
            value: 'You are not in a voice channel.',
          },
        ],
        footer: {
          text: interaction.client.user.username,
          icon_url: interaction.client.user.displayAvatarURL(),
        },
      };

      return interaction.reply({ embeds: [embed] });
    }

    // make the bot join voice
    try {
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false, // undeafened
      });

      // radio audio link from config
      const resource = createAudioResource(config.RadioMP3url, {
        inlineVolume: true,
      });

      // radio audio player
      const player = createAudioPlayer();
      connection.subscribe(player);
      player.play(resource);

      const embed = {
        color: 0x00ff00, // Green color for success
        title: interaction.client.user.username,
        fields: [
          {
            name: 'Status',
            value: 'Success.',
          },
          {
            name: 'Voice Channel',
            value: 'Successfully joined ' + channel.name,
          },
        ],
        footer: {
          text: interaction.client.user.username,
          icon_url: interaction.client.user.displayAvatarURL(),
        },
      };

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);

      const embed = {
        color: 0xff0000, // Red color for error
        title: interaction.client.user.username,
        fields: [
          {
            name: 'Status',
            value: 'Error.',
          },
          {
            name: 'Error:',
            value: 'Error while joining ' + channel.name,
          },
        ],
        footer: {
          text: interaction.client.user.username,
          icon_url: interaction.client.user.displayAvatarURL(),
        },
      };

      await interaction.reply({ embeds: [embed] });
    }
  },
};
