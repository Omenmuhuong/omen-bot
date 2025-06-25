const { EmbedBuilder, Events } = require('discord.js');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const welcomeChannelId = process.env.WELCOME_CHANNEL_ID; // thêm biến này vào file .env
    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel) return;

    // Lời chào text
    const messageContent = `Chào ${member}, bạn vừa ăn mù của omen rồi đi lạc vào đây, chơi vui vẻ`;

    // Tạo embed giống hình bạn gửi
    const embed = new EmbedBuilder()
      .setColor(0x00FFFF)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`${member.user.tag} just joined the server\nMember #${member.guild.memberCount}`)
      .setTimestamp();

    await channel.send({ content: messageContent, embeds: [embed] });
  }
};
