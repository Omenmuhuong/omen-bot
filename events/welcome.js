// events/welcome.js
const { Events, EmbedBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
  name: Events.GuildMemberAdd,

  async execute(member) {
    const channelId = process.env.WELCOME_CHANNEL_ID;
    const channel = member.guild.channels.cache.get(channelId);

    if (!channel || !channel.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setColor(0x0066cc) // Xanh đậm
      .setDescription(`🎉 **Ô có người mới à**\nChào ${member}, bạn vừa ăn mù của omen rồi đi lạc vào đây, chơi vui vẻ 😈`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

    channel.send({ embeds: [embed] }).catch(console.error);
  },
};
