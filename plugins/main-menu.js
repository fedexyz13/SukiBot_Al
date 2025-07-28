import { promises} from 'fs';
import { join} from 'path';
import { xpRange} from '../lib/levelling.js';

const channelRD = 'https://whatsapp.com/channel/0029VbApe6jG8l5Nv43dsC2N'; // Canal decorativo

const text = [
  "*Etiqueta General X SukiBot*",
  "⊹˚₊‧ 𝖲𝗎𝗄𝗂𝖡𝗈𝗍-𝖬𝖣 𝖮𝖿𝗂𝖼𝗂𝖺𝗅 ‧₊˚⊹",
  "⊹˚₊‧ 𝖲𝗎𝗄𝗂𝖡𝗈𝗍_MD 𝖡𝗒 𝖣𝖾𝗏_fedexyz.13 ‧₊˚⊹"
].sort(() => 0.5 - Math.random())[0]; // selección aleatoria

const imgRandom = [
  "https://files.catbox.moe/rkvuzb.jpg",
  "https://files.catbox.moe/rkvuzb.jpg"
].sort(() => 0.5 - Math.random())[0]; // imagen kawaii

const handler = async (m, { conn, usedPrefix: _p, __dirname}) => {
  try {
    await conn.sendMessage(m.chat, {
      image: { url: imgRandom},
      caption: `🌸 Enviando menú de *Suki_Bot_MD*...\n${text}\n🔗 Canal pastelcore: ${channelRD}`
});

    const packageInfo = JSON.parse(await promises.readFile(join(__dirname, '../package.json')));
    const { exp, level} = global.db.data.users[m.sender];
    const { min, xp} = xpRange(level, global.multiplier);
    const name = await conn.getName(m.sender);
    const uptime = clockString(process.uptime() * 1000);
    const totalreg = Object.keys(global.db.data.users).length;

    const pastelHeader = `
🩷︵₊˚⊹ Bienvenid@ al universo encantado de *Suki_Bot_MD* ˚₊⊹︵

╭─❀ INFO DE USUARIO ❀─╮
🌸 Nombre: ${name}
🍡 Nivel: ${level}
💫 Experiencia: ${exp}
╰─────────────────────╯

╭─❀ INFO DEL BOT ❀─╮
🎀 Plataforma: Baileys MD
🕒 Tiempo activo: ${uptime}
👥 Usuarios mágicos: ${totalreg}
╰────────────────────╯

✨ Comandos disponibles:
`;

    const categories = {
      juegos: '🎲 Juegos kawaii',
      anime: '🎌 Anime encantado',
      sticker: '🧁 Stickers mágicos',
      img: '📸 Imágenes visuales',
      downloader: '📥 Descargas pastel',
      group: '👑 Gestión grupal',
      search: '🔍 Buscador adorable',
      tools: '🧰 Herramientas suaves',
      rpg: '🎮 RPG brillante',
      fun: '🎈 Diversión ligera',
      premium: '💎 Opciones premium',
      owner: '🪄 Contacto creador',
      serbot: '🌪 Subbots mágicos'
};

    const help = Object.values(global.plugins)
.filter(p =>!p.disabled)
.map(p => ({
        help: Array.isArray(p.help)? p.help: [p.help],
        tags: Array.isArray(p.tags)? p.tags: [p.tags],
        prefix: 'customPrefix' in p
}));

    let commands = '';
    for (const [key, label] of Object.entries(categories)) {
      const filtered = help.filter(h => h.tags.includes(key));
      if (!filtered.length) continue;

      commands += `\n🌷 *${label}*\n`;
      for (const item of filtered) {
        for (const cmd of item.help) {
          commands += `⪼ ${_p}${cmd}\n`;
}
}
}

    const menuText = `
${pastelHeader.trim()}
${commands.trim()}

𓆩♡𓆪 *Suki_Bot_MD* powered by Dev_fedexyz13 💖
Tu compañer@ digital en el universo pastelcore 🌈🧋
`;

    await conn.sendMessage(
      m.chat,
      {
        image: { url: imgRandom},
        caption: menuText.trim()
},
      { quoted: m}
);
} catch (e) {
    console.error(e);
    conn.reply(m.chat, '😿 Ups~ ocurrió un error al mostrar el menú pastel...', m);
}
};

handler.command = ['menu', 'allmenu', 'ayuda', 'help'];
handler.help = ['menu'];
handler.tags = ['main'];
handler.register = true;

export default handler;

function clockString(ms) {
  const h = Math.floor(ms / 3600000),
        m = Math.floor(ms / 60000) % 60,
        s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}
