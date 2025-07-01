console.clear(); // Thêm dòng này
// 📦 Import thư viện cần thiết
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');
require('dotenv').config();

// 🚀 Tạo client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ]
});

// 📁 Bộ sưu tập lệnh và tương tác
client.commands = new Collection();
client.buttons = new Collection();   // 👈 Thêm
client.modals = new Collection();    // 👈 Thêm

// 🔄 Đệ quy nạp tất cả các lệnh từ thư mục con
const loadCommandFiles = (dirPath, commandsCollection) => {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      loadCommandFiles(fullPath, commandsCollection); // tiếp tục đệ quy
    } else if (file.endsWith('.js')) {
      try {
        const command = require(fullPath);
        if ('data' in command && 'execute' in command) {
          commandsCollection.set(command.data.name, command);
          console.log(`✅ Đã nạp lệnh: ${command.data.name}`);
        } else {
          console.warn(`⚠️ Lệnh thiếu data hoặc execute: ${fullPath}`);
        }
      } catch (err) {
        console.error(`❌ Lỗi khi nạp lệnh ${fullPath}:`, err);
      }
    }
  }
};

// ▶️ Nạp tất cả lệnh
loadCommandFiles(path.join(__dirname, 'commands'), client.commands);

// 🔄 Load buttons và modals
const loadInteractionFiles = (folderPath, collection, type) => {
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const handler = require(filePath);
    if ('id' in handler && 'execute' in handler) {
      collection.set(handler.id, handler);
      console.log(`✅ Đã nạp ${type}: ${handler.id}`);
    } else {
      console.warn(`⚠️ Thiếu id hoặc execute trong ${type}: ${filePath}`);
    }
  }
};

loadInteractionFiles(path.join(__dirname, 'interactions', 'buttons'), client.buttons, 'Button');
loadInteractionFiles(path.join(__dirname, 'interactions', 'modals'), client.modals, 'Modal');

// ⚙️ Xử lý tương tác
client.on(Events.InteractionCreate, async interaction => {
  try {
    // Slash command
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return console.warn(`⚠️ Không tìm thấy lệnh: ${interaction.commandName}`);
      await command.execute(interaction);
    }

    // Button interaction
    else if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);
      if (button) await button.execute(interaction);
    }

    // Modal interaction
    else if (interaction.isModalSubmit()) {
      const modalIdPrefix = interaction.customId.split('_').slice(0, 2).join('_');
      const modal = client.modals.get(modalIdPrefix);
      if (modal) await modal.execute(interaction);
    }
  } catch (error) {
    console.error('❌ Lỗi xử lý tương tác:', error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: '⚠️ Có lỗi xảy ra.', ephemeral: true });
    } else {
      await interaction.reply({ content: '⚠️ Có lỗi xảy ra.', ephemeral: true });
    }
  }
});

// 📢 Xử lý thư mục events
const welcomeEvent = require('./events/welcome');
client.on(welcomeEvent.name, (...args) => welcomeEvent.execute(...args));

// 📢 Khi bot sẵn sàng
client.once(Events.ClientReady, client => {
  console.log(`✅ Bot đã sẵn sàng với tên: ${client.user.tag}`);
});

// 🔐 Đăng nhập bằng token từ file .env
(async () => {
  try {
    await client.login(process.env.TOKEN);
  } catch (error) {
    console.error('❌ Lỗi khi đăng nhập bot:', error);
    process.exit(1); // Thoát để Render tự khởi động lại
  }
})();

// 🛡️ Bắt lỗi không mong muốn để tự restart
process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1); // Render sẽ restart
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1); // Render sẽ restart
});

// 🌐 Giữ bot hoạt động 24/7 trên Render
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Bot is alive!'));
app.listen(process.env.PORT || 3000, () => console.log('🌐 Web server is running'));
