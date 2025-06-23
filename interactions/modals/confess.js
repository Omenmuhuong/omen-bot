require('dotenv').config(); // Đảm bảo load biến môi trường

const { EmbedBuilder } = require('discord.js');

module.exports = {
  id: 'confess_modal', // Modal ID (phải khớp với ID khi tạo modal)

  async execute(interaction) {
    try {
      const confession = interaction.fields.getTextInputValue('confess_content');
      const isAnonymous = interaction.customId === 'confess_modal_anon';

      const embed = new EmbedBuilder()
        .setColor(isAnonymous ? 0x808080 : 0x00BFFF)
        .setTitle('📨 Confession Mới')
        .setDescription(confession)
        .setTimestamp();

      embed.setFooter(
        isAnonymous
          ? { text: 'Từ một bạn nào đó' }
          : { text: `Từ: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() }
      );

      const confessChannelId = process.env.CONFESSION_CHANNEL_ID;

      if (!confessChannelId) {
        console.error('❌ CONFESSION_CHANNEL_ID không được thiết lập trong .env');
        return interaction.reply({
          content: '⚠️ Thiếu cấu hình kênh confession. Vui lòng báo admin.',
          ephemeral: true,
        });
      }

      const channel = interaction.guild.channels.cache.get(confessChannelId);

      if (!channel) {
        console.warn('⚠️ Không tìm thấy kênh với ID:', confessChannelId);
        return interaction.reply({
          content: '⚠️ Không tìm thấy kênh để gửi confession.',
          ephemeral: true,
        });
      }

      await channel.send({ embeds: [embed] });
      await interaction.reply({
        content: '✅ Đã gửi confession!',
        ephemeral: true,
      });
    } catch (err) {
      console.error('❌ Lỗi khi xử lý confession:', err);
      await interaction.reply({
        content: '❌ Đã xảy ra lỗi khi gửi confession.',
        ephemeral: true,
      });
    }
  }
};
