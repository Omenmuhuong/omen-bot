const { Events, EmbedBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
  name: Events.GuildMemberAdd,

  async execute(member) {
    try {
      const channelId = process.env.WELCOME_CHANNEL_ID;
      const channel = member.guild.channels.cache.get(channelId);

      if (!channel || !channel.isTextBased()) return;

      const embed = new EmbedBuilder()
        .setColor(0x00BFFF)
        .setTitle('🎉 Ô có người mới à')
        .setDescription(`Chào <@${member.id}>, bạn vừa ăn mù của omen rồi đi lạc vào đây, chơi vui vẻ 😈`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

      await channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn chào mừng:', error);
    }
  }
};
