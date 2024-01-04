const { SlashCommandBuilder } = require('discord.js');
const { RadioAPIurl } = require('../../config.json');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Shows song currently playing.'),
  async execute(interaction) {
    try {
      // get data from the radio API
      const response = await fetch(RadioAPIurl);
      const radioData = await response.json();

      if (!radioData || !radioData.now_playing || !radioData.now_playing.song) {
        await interaction.reply('Unable to fetch now playing information.');
        return;
      }

      // make an embed with the now playing
      const embed = {
        color: 0x0099ff,
        title: 'Now Playing',
        fields: [
          {
            name: 'Title',
            value: radioData.now_playing.song.title,
          },
          {
            name: 'Artist',
            value: radioData.now_playing.song.artist,
          },
        ],
        timestamp: new Date(),
        footer: {
          text: interaction.client.user.username, 
          icon_url: interaction.client.user.displayAvatarURL(), 
        },
      };

      // Reply
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching data from radio API:', error);
      await interaction.reply('Error fetching now playing information.');
    }
  },
};
