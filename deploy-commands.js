require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

// Mảng chứa tất cả lệnh
const commands = [];

// Hàm đệ quy để lấy tất cả file .js trong commands và các thư mục con
const getAllCommandFiles = (dirPath, arrayOfFiles = []) => {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllCommandFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.js')) {
      arrayOfFiles.push(fullPath);
    }
  }

  return arrayOfFiles;
};

const commandsPath = path.join(__dirname, 'commands');
let commandFiles = getAllCommandFiles(commandsPath);

// Lọc bỏ các lệnh liên quan đến nối từ
commandFiles = commandFiles.filter(file => !file.includes('wordplay'));

// Đẩy các lệnh vào mảng `commands`
for (const file of commandFiles) {
  const command = require(file);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`[WARNING] The command at ${file} is missing "data" or "execute".`);
  }
}

// Tạo REST client
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Gửi lệnh lên Discord (cho server cụ thể)
(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('✅ Registered slash commands!');
  } catch (error) {
    console.error('❌ Failed to register commands:', error);
  }
})();