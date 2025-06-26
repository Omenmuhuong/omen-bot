// events/voice/tempvoice.js

const { ChannelType, PermissionFlagsBits } = require('discord.js');

// ID cấu hình
const NORMAL_TEMP_GENERATOR_ID = '1387461758645571634';
const COUPLE_TEMP_GENERATOR_ID = '1383375854905851934';
const CATEGORY_ID = '1383368008872886274';

// Bộ nhớ tạm để lưu ID phòng couple
const coupleRooms = new Set();

async function sendVoiceDashboard(systemChannel, member, channelId) {
  if (!systemChannel) return;

  await systemChannel.send({
    content: `🎛️ **Voice Dashboard** cho <@${member.id}>`,
    embeds: [
      {
        title: `${member.user.username}'s Trò chuyện riêng tư`,
        description: `Chào mừng <@${member.id}> đến với cuộc trò chuyện của bạn!\nBạn có thể chỉnh sửa kênh bằng các nút bên dưới.`,
        color: 0x00bfff,
        fields: [
          { name: '🔒', value: 'Private', inline: true },
          { name: '👻', value: 'Hide', inline: true },
          { name: '📝', value: 'Rename', inline: true },
          { name: '❌', value: 'Kick', inline: true },
          { name: '⛔', value: 'Ban', inline: true },
          { name: '🧑‍🤝‍🧑', value: 'Invite', inline: true },
          { name: '👑', value: 'Change Owner', inline: true }
        ],
        footer: {
          text: `Voice ID: ${channelId} • Dùng các nút để chỉnh sửa`
        }
      }
    ],
    components: [
      {
        type: 1,
        components: [
          { type: 2, label: 'Private', emoji: { name: '🔒' }, style: 2, custom_id: `voice_private_${channelId}` },
          { type: 2, label: 'Hide', emoji: { name: '👻' }, style: 2, custom_id: `voice_hide_${channelId}` },
          { type: 2, label: 'Rename', emoji: { name: '📝' }, style: 1, custom_id: `voice_rename_${channelId}` },
          { type: 2, label: 'Kick', emoji: { name: '❌' }, style: 4, custom_id: `voice_kick_${channelId}` },
          { type: 2, label: 'Ban', emoji: { name: '⛔' }, style: 4, custom_id: `voice_ban_${channelId}` },
          { type: 2, label: 'Invite', emoji: { name: '🧑‍🤝‍🧑' }, style: 3, custom_id: `voice_invite_${channelId}` },
          { type: 2, label: 'Change Owner', emoji: { name: '👑' }, style: 1, custom_id: `voice_owner_${channelId}` }
        ]
      }
    ]
  });
}

module.exports = async (oldState, newState) => {
  const member = newState.member;
  let newChannel;

  if (!oldState.channel && newState.channel) {
    const joinedChannel = newState.channel;

    if (joinedChannel.id === NORMAL_TEMP_GENERATOR_ID) {
      newChannel = await newState.guild.channels.create({
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
      await sendVoiceDashboard(newState.guild.systemChannel, member, newChannel.id);
    }

    else if (joinedChannel.id === COUPLE_TEMP_GENERATOR_ID) {
      newChannel = await newState.guild.channels.create({
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

      coupleRooms.add(newChannel.id);
      await member.voice.setChannel(newChannel);

      if (newChannel && newChannel.isTextBased?.()) {
        await newChannel.send({
          embeds: [
            {
              title: `Room 2 người vừa đc tạo!!`,
              description: `Chào <@${member.id}>, đây là phòng riêng của bạn.`,
              color: 0xff69b4,
              footer: {
                text: `Room sẽ tự động ẩn đi nếu như có 2 người đang trong voice để tránh làm phiền.\nRoom sẽ hiện lại khi số lượng người không phải là 2.\nHave fun!`
              }
            }
          ]
        });
      }
    }
  }

  const tempChannel = oldState.channel ?? newState.channel;

  if (
    tempChannel &&
    tempChannel.parentId === CATEGORY_ID &&
    tempChannel.id !== NORMAL_TEMP_GENERATOR_ID &&
    tempChannel.id !== COUPLE_TEMP_GENERATOR_ID
  ) {
    const members = tempChannel.members;

    if (members.size === 0) {
      coupleRooms.delete(tempChannel.id);
      tempChannel.delete().catch(() => {});
      return;
    }

    if (coupleRooms.has(tempChannel.id)) {
      const nonBotMembers = [...members.values()].filter(m => !m.user.bot);

      if (nonBotMembers.length === 2) {
        await tempChannel.permissionOverwrites.set([
          { id: tempChannel.guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
          ...nonBotMembers.map(m => ({
            id: m.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect]
          }))
        ]);
      } else {
        await tempChannel.permissionOverwrites.set([
          { id: tempChannel.guild.roles.everyone.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect] },
          ...nonBotMembers.map(m => ({
            id: m.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect]
          }))
        ]);
      }
    }
  }
};
