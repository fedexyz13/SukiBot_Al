import { readdirSync, unlinkSync, existsSync, promises as fs} from 'fs';
import path from 'path';

const handler = async (m, { conn}) => {
  if (global.conn.user.jid!== conn.user.jid) {
    return conn.reply(m.chat, '🚩 *𝖤𝗌𝗍𝖾 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 𝗌𝗈𝗅𝗈 𝗉𝗎𝖾𝖽𝖾 𝗎𝗌𝖺𝗋𝗌𝖾 𝖾𝗇 𝖾𝗅 𝗇𝗎́𝗆𝖾𝗋𝗈 𝗉𝗋𝗂𝗇𝖼𝗂𝗉𝖺𝗅 𝖽𝖾𝗅 𝖡𝗈𝗍.*', m);
}

  const chatIds = m.isGroup? [m.chat, m.sender]: [m.sender];
  const sessionPath = './sessions/';
  let filesDeleted = 0;

  try {
    const files = await fs.readdir(sessionPath);

    for (const file of files) {
      for (const id of chatIds) {
        if (file.includes(id.split('@')[0])) {
          await fs.unlink(path.join(sessionPath, file));
          filesDeleted++;
          break;
}
}
}

    if (filesDeleted === 0) {
      await conn.reply(m.chat, '🚩 *𝖭𝗈 𝗌𝖾 𝖾𝗇𝖼𝗈𝗇𝗍𝗋𝗈́ 𝗇𝗂𝗇𝗀𝗎𝗇 𝖺𝗋𝖼𝗁𝗂𝗏𝗈 𝖼𝗈𝗇 𝗍𝗎 𝖨𝖣.*', m);
} else {
      await conn.reply(m.chat, `✅ *𝖲𝖾 𝖾𝗅𝗂𝗆𝗂𝗇𝖺𝗋𝗈𝗇 ${filesDeleted} 𝖺𝗋𝖼𝗁𝗂𝗏𝗈𝗌 𝖽𝖾 𝗌𝖾𝗌𝗂𝗈𝗇.*`, m);
      await conn.reply(m.chat, '🌷 *¡𝖧𝗈𝗅𝖺! ¿𝗅𝗈𝗀𝗋𝖺𝗌 𝗏𝖾𝗋𝗆𝖾 𝖺𝗁𝗈𝗋𝖺?*', m);
}
} catch (err) {
    console.error('❌ Error al leer o eliminar archivos de sesión:', err);
    await conn.reply(m.chat, '💥 *𝖮𝖼𝗎𝗋𝗋𝗂𝗈́ 𝗎𝗇 𝖿𝖺𝗅𝗅𝗈 𝖾𝗇 𝗅𝖺 𝖾𝗅𝗂𝗆𝗂𝗇𝖺𝖼𝗂𝗈𝗇.*', m);
}
};

handler.help = ['fixmsgespera', 'ds', 'limpiar'];
handler.tags = ['info'];
handler.command = ['fixmsgespera', 'ds', 'limpiar'];
handler.register = true;

export default handler;
