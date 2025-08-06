// 🌸 Código creado por fedexyz 🍁
// No quites créditos ⚔️

import { xpRange} from '../lib/levelling.js';
import fetch from 'node-fetch';

const textSuki = (text) => {
  const charset = {
    a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ',
    h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ',
    o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ', u: 'ᴜ',
    v: 'ᴠ', w: 'ᴡ', x: 'ˣ', y: 'ʏ', z: 'ᴢ'
};
  return text.toLowerCase().split('').map(c => charset[c] || c).join('');
};

// 🌷 Emojis pastelcore únicos por categoría
const pastelEmojis = ['ᰨ',🍀'ᰍ', 'ׅ💖', '🌱', '᪲', '᤻', 'ׄ🍒', 🍁'᎒', '᎓'];
let emojiIndex = 0;
const tags = {};

const categorias = [
  ['main', 'Menú principal'],
  ['group', 'Comandos grupales'],
  ['serbot', 'Función clon'],
  ['tools', 'Herramientas mágicas'],
  ['kawaii', 'Anime encantado'],
  ['descargas', 'Descargas pastel']
];

for (const [id, nombre] of categorias) {
  const emoji = pastelEmojis[emojiIndex % pastelEmojis.length];
  tags[id] = `${emoji} ${textSuki(nombre)}`;
  emojiIndex++;
}

const defaultMenu = {
  before: `
❀───────𓆩♡𓆪───────❀
˗ˏˋ こんにちは \`%name\` ˎˊ˗
🧋 Bienvenid@ a *Suki_Bot_MD*
🎀 Tu guía pastelcore con comandos encantadores

🌸『 𝗜𝗡𝗙𝗢 - 𝗨𝗦𝗘𝗥 』🌸
> 👤 Nombre: *%name*
> 🎀 Nivel: *%level* | ✨ Exp: *%exp/%maxexp*
> 🔓 Modo: *%mode*
> 📈 Registro global: *%totalreg*
> 🕐 Tiempo activo: *%muptime*

╰─🍓𓆩 𝑺𝒖𝒌𝒊_𝑩𝒐𝒕_𝑴𝑫 𓆪🍰─╯
%readmore`.trim(),

  header: '\n꒰꒰ 🍁̸̶ֻ   `%category` 🍥̸̶ֻ   ꒱꒱\n',
  body: '┃ ⊹ %cmd %iscorazones %isPremium',
  footer: '\n',
  after: `╰─𓆩♡𓆪─⬣`
};

let handler = async (m, { conn, usedPrefix: _p}) => {
  try {
    const { exp = 0, level = 0} = global.db.data.users[m.sender];
    const { min, xp} = xpRange(level, global.multiplier);
    const name = await conn.getName(m.sender);
    const muptime = clockString(process.uptime() * 1000);
    const totalreg = Object.keys(global.db.data.users).length;
    const mode = global.opts["self"]? "Privado 🔒": "Público 🌐";

    const help = Object.values(global.plugins)
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
            menu.help
.map(cmd => body.replace(/%cmd/g, menu.prefix? cmd: _p + cmd))
.join('\n')
).join('\n');
        return `${header.replace(/%category/g, tags[tag])}${cmds}${footer}`;
}),
      after
    ].join('\n');

    const replace = {
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

    const imageURL = 'https://files.catbox.moe/rkvuzb.jpg';
    const imgBuffer = await fetch(imageURL).then(res => res.buffer());

    const menuMessage = await conn.sendMessage(m.chat, {
      image: imgBuffer,
      caption: text,
      contextInfo: {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardingScore: 888
}
}, { quoted: m});

    await conn.sendMessage(m.chat, {
      react: { text: '🌷', key: menuMessage.key}
});

} catch (e) {
    console.error('[❌] Error en menú decorado:', e);
    conn.reply(m.chat, '❎ Suki se tropezó entre pétalos 🌸. Inténtalo otra vez, porfa.', m);
}
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'menukawaii', 'menucompleto'];
handler.register = false;

export default handler;

function clockString(ms) {
  const h = isNaN(ms)? '--': Math.floor(ms / 3600000);
  const m = isNaN(ms)? '--': Math.floor((ms / 60000) % 60);
  const s = isNaN(ms)? '--': Math.floor((ms / 1000) % 60);
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}
