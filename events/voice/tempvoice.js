// events/voice/tempvoice.js

const { ChannelType, PermissionFlagsBits } = require('discord.js');

// ID cấu hình
const NORMAL_TEMP_GENERATOR_ID = '1387461758645571634';
const COUPLE_TEMP_GENERATOR_ID = '1383375854905851934';
const CATEGORY_ID = '1383368008872886274';

// Bộ nhớ tạm để lưu ID phòng couple
const coupleRooms = new Set();

module.exports = async (oldState, newState) => {
  const member = newState.member;

  // ===== Vào voice mới =====
  if (!oldState.channel && newState.channel) {
    const joinedChannel = newState.channel;

    // ===== 1. TEMP VOICE THƯỜNG =====
    if (joinedChannel.id === NORMAL_TEMP_GENERATOR_ID) {
      const newChannel = await newState.guild.channels.create({
        name: `👥| ${member.user.username}'s Voice`,
        type: ChannelType.GuildVoice,
        parent: CATEGORY_ID,
        permissionOverwrites: [
          {
            id: member.id,
            allow: [
              PermissionFlagsBits.Connect,
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.ManageChannels
            ]
          },
          {
            id: newState.guild.roles.everyone.id,
            allow: [PermissionFlagsBits.Connect, PermissionFlagsBits.ViewChannel]
          }
        ]
      });

      await member.voice.setChannel(newChannel);
    }

    // ===== 2. TEMP VOICE COUPLE =====
    else if (joinedChannel.id === COUPLE_TEMP_GENERATOR_ID) {
      const newChannel = await newState.guild.channels.create({
        name: `💗| I love you 3000`,
        type: ChannelType.GuildVoice,
        parent: CATEGORY_ID,
        permissionOverwrites: [
          {
            id: member.id,
            allow: [
              PermissionFlagsBits.Connect,
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.ManageChannels
            ]
          },
          {
            id: newState.guild.roles.everyone.id,
            allow: [PermissionFlagsBits.Connect, PermissionFlagsBits.ViewChannel]
          }
        ]
      });

      coupleRooms.add(newChannel.id); // ✅ Ghi nhớ ID phòng couple

      await member.voice.setChannel(newChannel);
    }
  }

  // ===== XỬ LÝ PHÒNG TẠM =====
  const tempChannel = oldState.channel ?? newState.channel;

  if (
    tempChannel &&
    tempChannel.parentId === CATEGORY_ID &&
    tempChannel.id !== NORMAL_TEMP_GENERATOR_ID &&
    tempChannel.id !== COUPLE_TEMP_GENERATOR_ID
  ) {
    const members = tempChannel.members;

    // ===== Nếu phòng trống → xoá kênh =====
    if (members.size === 0) {
      coupleRooms.delete(tempChannel.id); // ❌ Xoá ID khỏi danh sách nếu là couple
      tempChannel.delete().catch(() => {});
      return;
    }

    // ===== Nếu là kênh couple → xử lý ẩn/hiện =====
    if (coupleRooms.has(tempChannel.id)) {
      const nonBotMembers = [...members.values()].filter(m => !m.user.bot);

      if (nonBotMembers.length === 2) {
        // Ẩn phòng khỏi @everyone
        await tempChannel.permissionOverwrites.set([
          {
            id: tempChannel.guild.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel]
          },
          ...nonBotMembers.map(m => ({
            id: m.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect]
          }))
        ]);
      } else {
        // Hiện lại phòng cho @everyone
        await tempChannel.permissionOverwrites.set([
          {
            id: tempChannel.guild.roles.everyone.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect]
          },
          ...nonBotMembers.map(m => ({
            id: m.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect]
          }))
        ]);
      }
    }
  }
};
