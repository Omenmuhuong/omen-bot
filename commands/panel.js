const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('confesspanel')
    .setDescription('Gửi bảng confession'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x00BFFF)
      .setTitle('📨 Gửi Confession đến cộng đồng 👻Những bóng ma lạc lối')
      .setDescription(`> Chia sẻ suy nghĩ, tâm sự hoặc bất kỳ điều gì bạn muốn gửi đến mọi người!

📌 Lưu ý khi gửi:
• ✍️ Nội dung không được để trống
• 🚫 Không chứa thông tin nhạy cảm, riêng tư
• ✅ Nội dung lịch sự, văn minh

🧭 Chọn cách gửi confession bằng cách nhấn nút bên dưới:`)
      .setColor(0x2F3136);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('confess_public')
        .setLabel('Công Khai')
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId('confess_anon')
        .setLabel('Ẩn Danh')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
