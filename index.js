const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

// Khởi tạo client Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Tạo collection chứa các lệnh
client.commands = new Collection();

// Đường dẫn đến folder "commands"
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`[WARNING] The command at ${filePath} is missing "data" or "execute".`);
  }
}

// Khi bot sẵn sàng
client.once(Events.ClientReady, readyClient => {
  console.log(`✅ Ready! Logged in as ${readyClient.user.tag}`);
});

// Xử lý slash command
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`❌ No command matching ${interaction.commandName} found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`💥 Error in command ${interaction.commandName}:`, error);
    await interaction.reply({
      content: '❌ There was an error executing that command.',
      ephemeral: true,
    });
  }
});

// Đăng nhập
client.login(process.env.TOKEN);
//Giữ chạy 24/7
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Bot is alive!'));
app.listen(3000, () => console.log('Web server is running on port 3000'));
