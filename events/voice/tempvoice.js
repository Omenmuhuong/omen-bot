// events/voice/tempvoice.js

const { ChannelType, PermissionFlagsBits } = require('discord.js');

// ID cấu hình
const NORMAL_TEMP_GENERATOR_ID = '1387461758645571634';
const COUPLE_TEMP_GENERATOR_ID = '1383375854905851934';
const CATEGORY_ID = '1383368008872886274';

module.exports = async (oldState, newState) => {
  const member = newState.member;

  // Vào một voice mới
  if (!oldState.channel && newState.channel) {
    const joinedChannel = newState.channel;

    // ===== 1. TEMP VOICE THƯỜNG =====
    if (joinedChannel.id === NORMAL_TEMP_GENERATOR_ID) {
      const newChannel = await newState.guild.channels.create({
        name: `Voice của ${member.user.username}`,
        type: ChannelType.GuildVoice,
        parent: CATEGORY_ID,
        permissionOverwrites: [
  {
    id: member.id,
    allow: [
      PermissionFlagsBits.Connect,
      PermissionFlagsBits.ViewChannel,
      PermissionFlagsBits.ManageChannels // 👈 quyền chỉnh sửa voice
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
        name: `Couple của ${member.user.username}`,
        type: ChannelType.GuildVoice,
        parent: CATEGORY_ID,
        permissionOverwrites: [
  {
    id: member.id,
    allow: [
      PermissionFlagsBits.Connect,
      PermissionFlagsBits.ViewChannel,
      PermissionFlagsBits.ManageChannels // 👈 quyền chỉnh sửa voice
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
  }

  // ===== 3. XỬ LÝ PHÒNG TẠM =====
  const tempChannel = oldState.channel ?? newState.channel;
  if (
    tempChannel &&
    tempChannel.parentId === CATEGORY_ID &&
    tempChannel.id !== NORMAL_TEMP_GENERATOR_ID &&
    tempChannel.id !== COUPLE_TEMP_GENERATOR_ID
  ) {
    const members = tempChannel.members;

    // ===== Nếu không còn ai → xoá kênh =====
    if (members.size === 0) {
      tempChannel.delete().catch(() => {});
      return;
    }

    // ===== Nếu là kênh couple =====
    if (tempChannel.name.startsWith('Couple của')) {
      const nonBotMembers = [...members.values()].filter(m => !m.user.bot);

      if (nonBotMembers.length === 2) {
        // Ẩn kênh khỏi @everyone, chỉ để 2 người thấy
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
        // Hiện lại kênh cho @everyone
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
