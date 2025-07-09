const { EmbedBuilder } = require('discord.js');

// ID Discord của bạn
const OWNER_ID = '740414975704825857';

module.exports = {
  id: 'ticket_modal', // ✅ Phải khớp với customId trong ticket.js

  async execute(interaction) {
    try {
      const title = interaction.fields.getTextInputValue('ticketTitle');
      const content = interaction.fields.getTextInputValue('ticketContent');
      const sender = interaction.user;

      const embed = new EmbedBuilder()
        .setTitle(`📩 Ticket mới từ ${sender.tag}`)
        .addFields(
          { name: '📝 Tiêu đề', value: title, inline: false },
          { name: '📄 Nội dung', value: content, inline: false },
          { name: '👤 Người gửi', value: `${sender.tag} (${sender.id})`, inline: false }
        )
        .setColor(0x00BFFF)
        .setTimestamp();

      const ownerUser = await interaction.client.users.fetch(OWNER_ID);
      await ownerUser.send({ embeds: [embed] });

      await interaction.reply({
        content: '✅ Bạn đã gửi ticket thành công!',
        ephemeral: false
      });
    } catch (err) {
      console.error('❌ Lỗi khi gửi ticket:', err);
      await interaction.reply({
        content: '❌ Không thể gửi ticket, vui lòng thử lại sau.',
        ephemeral: true
      });
    }
  }
};
