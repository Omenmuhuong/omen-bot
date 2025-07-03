const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const channelId = '1387308465164390480'; // 👉 Thay bằng ID kênh chào mừng
    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return;

    const avatarURL = member.user.displayAvatarURL({ dynamic: true, size: 1024 });
    const gifURL = 'https://cdn.discordapp.com/attachments/1389141558879588455/1390398811855126559/0704-ezgif.com-video-to-gif-converter.gif';

    const embed = new EmbedBuilder()
      .setColor(0x00ccff)
      .setTitle('🎉 Ồ có người mới à')
      .setDescription(`Chào ${member}, bạn vừa ăn mù của omen rồi đi lạc vào đây, chơi vui vẻ 😈`)
      .setThumbnail(avatarURL)
      .setImage(gifURL)
      .setTimestamp();

    channel.send({
      content: `${member}`, // tag người mới
      embeds: [embed],
    });
  },
};
