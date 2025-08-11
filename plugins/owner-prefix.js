const handler = async (m, { conn, text}) => {
  const emoji = '🌸';
  const done = '✅';

  if (!text) throw `${emoji} No se encontró ningún prefijo. Por favor, escribe uno.\n> Ejemplo: *prefix!*`;

  global.prefix = new RegExp('^[' + (text || global.opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']');

  const mensaje = `
╭─❀ 𝖲ᴜᴋ𝗂Bot_MD ❀─╮
┃ ${done} Prefijo actualizado con éxito
┃ ✨ Nuevo prefijo: *${text}*
╰─────────────────╯`;

  conn.fakeReply(m.chat, mensaje.trim(), '0@s.whatsapp.net', '🌟 PREFIJO NUEVO 🌟');
};

handler.customPrefix = /^prefix [símbolo]$/i;
handler.command = new RegExp;
handler.owner = true;
handler.register = true;

export default handler;
