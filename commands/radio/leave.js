const { SlashCommandBuilder } = require('discord.js');
const { voice, getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leaves the current voice channel.'),

  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
      const embedNotInVoice = {
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

      return interaction.reply({ embeds: [embedNotInVoice] });
    }

    try {
      connection.destroy();

      const embedLeftVoice = {
        color: 0x00ff00,
        title: interaction.client.user.username,
        fields: [
          {
            name: 'Status',
            value: 'Success.',
          },
          {
            name: 'RadioHit',
            value: 'Left the voice channel.',
          },
        ],
        footer: {
          text: interaction.client.user.username,
          icon_url: interaction.client.user.displayAvatarURL(),
        },
      };

      await interaction.reply({ embeds: [embedLeftVoice] });
    } catch (error) {
      console.error(error);

      const embedError = {
        color: 0xff0000,
        title: interaction.client.user.username,
        fields: [
          {
            name: 'Status',
            value: 'Error.',
          },
          {
            name: 'Error:',
            value: 'Failed to leave voice channel.',
          },
        ],
        footer: {
          text: interaction.client.user.username,
          icon_url: interaction.client.user.displayAvatarURL(),
        },
      };

      await interaction.reply({ embeds: [embedError] });
    }
  },
};
