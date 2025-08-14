export async function before(m, { conn, isOwner, isROwner}) {
  if (m.isBaileys || m.fromMe || m.isGroup ||!m.message) return!0;

  const bot = global.db.data.settings[conn.user.jid] || {};
  const forbiddenCommands = ['.menu', '.code', '.serbot', '.qr', '.apk', 'serbot', 'jadibot'];

  if (bot.antiPrivate &&!isOwner &&!isROwner) {
    const text = m.text?.toLowerCase();
    if (text && forbiddenCommands.some(cmd => text.includes(cmd))) {
      await m.reply(
        `${emoji} ʜᴏʟᴀ @${m.sender.split`@`[0]}, ʟᴏs ᴄᴏᴍᴀɴᴅᴏs ᴇɴ ᴄʜᴀᴛs ᴘʀɪᴠᴀᴅᴏs ᴇsᴛᴀ́ɴ ʀᴇsᴛʀɪɴɢɪᴅᴏs.\n\nꜱɪ ǫᴜɪᴇʀᴇꜱ ᴜꜱᴀʀ ᴇʟ ʙᴏᴛ, ᴜ́ɴᴇᴛᴇ ᴀʟ ɢʀᴜᴘᴏ ᴏꜰɪᴄɪᴀʟ:\n${gp1}`,
        false,
        { mentions: [m.sender]}
);
      await conn.updateBlockStatus(m.chat, 'block');
}
}

  return!1;
}
