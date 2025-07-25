import { xpRange} from '../lib/levelling.js';
import fetch from 'node-fetch';

const textbot = '💖 SUKI_BOT_MD BY FEDEXYZ ✨️';
const banner = 'https://files.catbox.moe/3ee3ib.jpg';
const redes = 'https://whatsapp.com/channel/0029VajUPbECxoB0cYovo60W';

const textSuki = (text) => {
  const charset = {
    a:'ᴀ', b:'ʙ', c:'ᴄ', d:'ᴅ', e:'ᴇ', f:'ꜰ', g:'ɢ',
    h:'ʜ', i:'ɪ', j:'ᴊ', k:'ᴋ', l:'ʟ', m:'ᴍ', n:'ɴ',
    o:'ᴏ', p:'ᴘ', q:'ǫ', r:'ʀ', s:'ꜱ', t:'ᴛ', u:'ᴜ',
    v:'ᴠ', w:'ᴡ', x:'ˣ', y:'ʏ', z:'ᴢ'
};
  return text.toLowerCase().split('').map(c => charset[c] || c).join('');
};

let tags = {
  main: textSuki('🌸 menú principal'),
  group: textSuki('🤍 grupo de amor'),
  serbot: textSuki('💫 energía suki'),
  util: textSuki('🔧 utilidades mágicas'),
  fun: textSuki('🎠 diversión kawaii'),
  power: textSuki('⛩️ poder espiritual')
};

const welcomeBanner = `
╭︿︿︿︿︿︿︿╮
(｡>﹏<｡)っ 💌 ｡･ﾟ･｡
╰︶︶︶︶︶︶╯

🌸 Bienvenida a *Suki_Bot_MD* 🌸
✨ Donde cada comando es una chispa de ternura.

『 ✦ ✦ ✦ 』`.trim();

const defaultMenu = {
  before: `
${welcomeBanner}

╭─♡ 状態 de Usuario ♡─╮
│ 🌈 Nombre: \`%name\`
│ ⭐ Nivel: %level
│ ⚡ Exp: %exp/%maxexp
│ 🎀 Modo: %mode
│ 🧃 Usuarios: %totalreg
│ 🕰️ Tiempo activo: %muptime
╰───────────────────╯

✨ ¡Que tu magia fluya, %name!
%readmore`.trimStart(),

  header: '\n🌺 %category\n',
  body: '🍡 ➤ %cmd %iscorazones %isPremium',
  footer: '\n',
  after: '\n꒰🌙꒱━━━━━━━━━━━━━━━━━━'
};

let handler = async (m, { conn, usedPrefix: _p}) => {
  try {
    const { exp = 0, level = 0} = global.db.data.users[m.sender];
    const { min, xp} = xpRange(level, global.multiplier);
    const name = await conn.getName(m.sender);
    const _uptime = process.uptime() * 1000;
    const muptime = clockString(_uptime);
    const totalreg = Object.keys(global.db.data.users).length;
    const mode = global.opts['self']? 'Privado 🔒': 'Público 🌐';

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
      readmore: String.fromCharCode(8206).repeat(4001)
};

    const text = _text.replace(/%(\w+)/g, (_, key) => replace[key] || '');

    await conn.sendMessage(m.chat, {
      video: { url: 'https://files.catbox.moe/n9hkux.mp4'},
      caption: text,
      mimetype: 'video/mp4',
      contextInfo: {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardingScore: 999,
        externalAdReply: {
          title: '🌸 SUKI_BOT_MD 🌸',
          body: '© Powered By fedexyz',
          thumbnailUrl: banner,
          sourceUrl: redes,
          mediaType: 1,
          renderLargerThumbnail: true
}
}
}, { quoted: m});

} catch (e) {
    console.error('[❌] Error en menú Suki:', e);
    conn.reply(m.chat, '💢 Ups! Suki se tropezó en el bosque mágico. Intenta de nuevo, porfis~', m);
}
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'suki', 'suki_bot_md'];
handler.register = false;
export default handler;

function clockString(ms) {
  let h = isNaN(ms)? '--': Math.floor(ms / 3600000);
  let m = isNaN(ms)? '--': Math.floor(ms / 60000) % 60;
  let s = isNaN(ms)? '--': Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}
