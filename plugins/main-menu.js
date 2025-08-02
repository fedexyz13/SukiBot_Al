// Código creado y mejorado por fedexyz 🍁
// no quites los créditos ⚔

import { xpRange} from '../lib/levelling.js';
import fetch from 'node-fetch';

const channelRD = {
  id: '120363402097425674@newsletter',
  name: '🌸 Suki_Bot_MD Canal Oficial'
};

// Función para texto pastel
const textSuki = (text) => {
  const charset = {
    a:'ᴀ', b:'ʙ', c:'ᴄ', d:'ᴅ', e:'ᴇ', f:'ꜰ', g:'ɢ',
    h:'ʜ', i:'ɪ', j:'ᴊ', k:'ᴋ', l:'ʟ', m:'ᴍ', n:'ɴ',
    o:'ᴏ', p:'ᴘ', q:'ǫ', r:'ʀ', s:'ꜱ', t:'ᴛ', u:'ᴜ',
    v:'ᴠ', w:'ᴡ', x:'ˣ', y:'ʏ', z:'ᴢ'
};
  return text.toLowerCase().split('').map(c => charset[c] || c).join('');
};

// Categorías decoradas con texto suave
let tags = {
  main: textSuki('Menú principal'),
  group: textSuki('Comandos grupales'),
  serbot: textSuki('Función clon'),
  tools: textSuki('Herramientas mágicas'),
  kawaii: textSuki('Anime encantado'),
  descargas: textSuki('Descargas pastel')
};

// Menú decorado
const defaultMenu = {
  before: `
╔══ ❖•ೋ 🌸 ᴘᴇʀғɪʟ ᴅᴇ ꜱᴜᴋɪ •ೋ🌸 ❖══╗

👋 ᴄᴏɴɴɪᴄʜɪᴡᴀ \`%name\`!
🎀 ᴛᴜ ᴘᴇʀꜱᴏɴᴀ ᴍᴀɢɪᴄᴀ ʜᴀ ꜱɪᴅᴏ ʀᴇᴄᴏɴᴏᴄɪᴅᴀ:

╭───┤✨ ꜱᴜᴋɪ ꜱᴛᴀᴛꜱ ✨├───╮
│ 💖 Nombre: *%name*
│ 🧁 Edad: *${user.age}* años kawaii
│ 🍓 País: *${user.country || 'Desconocido'}*
│ 🔒 Modo: *%mode*
│ 🔥 Tiempo activo: *%muptime*
│ 🌍 Registro global: *%totalreg*
╰────────────────────────╯

%readmore
`.trim(),

  header: '\n┌─「 🌷 %category 」\n',
  body: '│ 🍡 %cmd %iscorazones %isPremium',
  footer: '└─────♡',
  after: `
╰═♡ Gracias por usar *Suki_Bot_MD* ♡═╯
🪄 Creado con ternura por: *fedexyz.13*
📡 Canal mágico: https://whatsapp.com/channel/0029VbApe6jG8l5Nv43dsC2N
📬 Contacto directo: wa.me/5491156178758
`.trim()
};

let handler = async (m, { conn, usedPrefix: _p}) => {
  try {
    const { exp = 0, level = 0} = global.db.data.users[m.sender];
    const { min, xp} = xpRange(level, global.multiplier);
    const name = await conn.getName(m.sender);
    const muptime = clockString(process.uptime() * 1000);
    const totalreg = Object.keys(global.db.data.users).length;
    const mode = global.opts["self"]? "Privado 🔒": "Público 🌐";

    await conn.sendMessage(m.chat, {
      text: '🌸 Enviando el menú de *SukiBot_MD*\nhttps://whatsapp.com/channel/0029VbApe6jG8l5Nv43dsC2N'
}, { quoted: m});

    // Capturar comandos activos
    let help = Object.values(global.plugins)
.filter(p =>!p.disabled)
.map(p => ({
        help: Array.isArray(p.help)? p.help: [p.help],
        tags: Array.isArray(p.tags)? p.tags: [p.tags],
        prefix: 'customPrefix' in p,
        limit: p.limit,
        premium: p.premium,
        enabled:!p.disabled
}));

    for (const plugin of help) {
      if (plugin.tags) {
        for (const t of plugin.tags) {
          if (!(t in tags) && t) tags[t] = textSuki(t);
}
}
}

    const { before, header, body, footer, after} = defaultMenu;

    let _text = [
      before,
...Object.keys(tags).map(tag => {
        const cmds = help
.filter(menu => menu.tags.includes(tag))
.map(menu =>
            menu.help.map(cmd => body.replace(/%cmd/g, menu.prefix? cmd: _p + cmd)).join('\n')
).join('\n');
        return `${header.replace(/%category/g, tags[tag])}${cmds}${footer}`;
}),
      after
    ].join('\n');

    let replace = {
      '%': '%',
      name,
      level,
      exp: exp - min,
      maxexp: xp,
      totalreg,
      mode,
      muptime,
      channelName: channelRD.name,
      readmore: String.fromCharCode(8206).repeat(4001)
};

    const text = _text.replace(/%(\w+)/g, (_, key) => replace[key] || '');

    // Imagen decorada del menú
    const imageURL = 'https://files.catbox.moe/cvpwkk.jpg';
    const imgBuffer = await fetch(imageURL).then(res => res.buffer());

    await conn.sendMessage(m.chat, {
      image: imgBuffer,
      caption: text,
      contextInfo: {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardingScore: 888,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          serverMessageId: 120,
          newsletterName: channelRD.name
}
}
}, { quoted: m});

} catch (e) {
    console.error('[❌] Error en menú decorado:', e);
    conn.reply(m.chat, '❎ Suki se tropezó entre pétalos 🌸. Inténtalo otra vez, porfa.', m);
}
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'help', 'menucompleto'];
handler.register = false;

export default handler;

function clockString(ms) {
  let h = isNaN(ms)? '--': Math.floor(ms / 3600000);
  let m = isNaN(ms)? '--': Math.floor(ms / 60000) % 60;
  let s = isNaN(ms)? '--': Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}
