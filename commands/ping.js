const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Gọi xem bot còn thở không'),
  async execute(interaction) {
    try {
      console.log('🔔 Ping command executed');

      // Kiểm tra xem interaction đã được phản hồi chưa
      if (!interaction.replied) {
        // Gửi phản hồi
        await interaction.reply('Gọi cái giề đang ngủ😪'); // Sửa phản hồi ở đây
      }
    } catch (error) {
      console.error('❌ Lỗi khi thực hiện lệnh ping:', error);

      // Nếu chưa gửi phản hồi thì dùng followUp, nếu đã gửi thì bỏ qua
      if (!interaction.replied && !interaction.deferred) {
        try {
          await interaction.reply({ content: '❌ Lỗi khi xử lý lệnh ping!', ephemeral: true });
        } catch (e) {
          console.warn('⚠️ Không thể gửi phản hồi lỗi.');
        }
      }
    }
  },
};