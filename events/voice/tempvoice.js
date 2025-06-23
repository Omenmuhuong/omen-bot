const { ChannelType, PermissionFlagsBits } = require('discord.js');

// 🔧 Tên kênh để tạo phòng và ID danh mục chứa kênh
const TEMP_VOICE_CHANNEL_NAME = '💞| Tạo couple room';
const CATEGORY_ID = '1383368008872886274'; // ← Thay bằng ID danh mục thật

// 🧠 Bộ nhớ tạm thời để chặn việc tạo trùng phòng
const activeRooms = new Set();

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState) {
    const member = newState.member;
    const guild = newState.guild;

    // 📌 Kiểm tra nếu người dùng vào đúng kênh tạo phòng
    if (
      newState.channel &&
      newState.channel.name === TEMP_VOICE_CHANNEL_NAME &&
      newState.channel.members.size === 1 &&
      !activeRooms.has(member.id)
    ) {
      activeRooms.add(member.id); // Đánh dấu là đang tạo phòng cho người này

      try {
        // 🏗️ Tạo kênh voice mới
        const newChannel = await guild.channels.create({
          name: `💞| I Love You 3000💗`,
          type: ChannelType.GuildVoice,
          parent: CATEGORY_ID,
          permissionOverwrites: [
  {
    id: guild.roles.everyone,
    allow: [PermissionFlagsBits.Connect], // ✅ Mọi người được vào
  },
  {
    id: member.id,
    allow: [
      PermissionFlagsBits.Connect,
      PermissionFlagsBits.ManageChannels,
      PermissionFlagsBits.MoveMembers,
      PermissionFlagsBits.MuteMembers,
    ],
  },
],

          userLimit: 2,
        });

        // 🚪 Di chuyển người dùng vào kênh mới
        await newState.setChannel(newChannel);
      } catch (err) {
        console.error('❌ Lỗi khi tạo hoặc move vào phòng mới:', err);
      } finally {
        setTimeout(() => activeRooms.delete(member.id), 5000); // Dọn dẹp sau 5 giây
      }
    }

    // 🧹 Tự xóa phòng khi không còn ai
    if (
      oldState.channel &&
      oldState.channel.parentId === CATEGORY_ID &&
      oldState.channel.members.size === 0 &&
      oldState.channel.name.startsWith('💞| I Love You')
    ) {
      try {
        await oldState.channel.delete();
      } catch (err) {
        console.error('❌ Lỗi khi xóa phòng:', err);
      }
    }
  },
};
