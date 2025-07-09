const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Gửi một ticket ẩn danh cho admin'),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('ticket_modal') // ✅ Phải khớp với id trong ticketmodal.js
      .setTitle('Gửi Ticket');

    const titleInput = new TextInputBuilder()
      .setCustomId('ticketTitle')
      .setLabel('Tiêu đề')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const contentInput = new TextInputBuilder()
      .setCustomId('ticketContent')
      .setLabel('Nội dung chi tiết')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const firstRow = new ActionRowBuilder().addComponents(titleInput);
    const secondRow = new ActionRowBuilder().addComponents(contentInput);

    modal.addComponents(firstRow, secondRow);

    await interaction.showModal(modal);
  }
};
