const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  id: 'confess_public',
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('confess_modal_public')
      .setTitle('Confession Công Khai');

    const input = new TextInputBuilder()
      .setCustomId('confess_content')
      .setLabel('Nội dung confession')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMaxLength(1000);

    const row = new ActionRowBuilder().addComponents(input);
    modal.addComponents(row);

    await interaction.showModal(modal);
  }
};
