// 🌸 𝖢𝗈́𝖽𝗂𝗀𝗈 𝖼𝗋𝖾𝖺𝖽𝗈 𝗉𝗈𝗋 𝖿𝖾𝖽𝖾𝗑𝗒𝗓 🍁
// 𝖭𝗈 𝗊𝗎𝗂𝗍𝖾𝗌 𝗅𝗈𝗌 𝖼𝗋𝖾𝖽𝗂𝗍𝗈𝗌 ⚔️

import { xpRange} from '../lib/levelling.js';
import fetch from 'node-fetch';
import moment from 'moment-timezone';

const toSerifBold = (text) => {
  const map = {
    a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴',
    h: '𝗵', i: '𝗶', j: '𝗷', k: '𝗸', l: '𝗹', m: '𝗺', n: '𝗻',
    o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿', s: '𝘀', t: '𝘁', u: '𝘂',
    v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇',
    A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', E: '𝗘', F: '𝗙', G: '𝗚',
    H: '𝗛', I: '𝗜', J: '𝗝', K: '𝗞', L: '𝗟', M: '𝗠', N: '𝗡',
    O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥', S: '𝗦', T: '𝗧', U: '𝗨',
    V: '𝗩', W: '𝗪', X: '𝗫', Y: '𝗬', Z: '𝗭'
};
  return text.split('').map(c => map[c] || c).join('');
};

let tags = {
  main: toSerifBold('🌸 𝖬𝖾𝗇𝗎 𝖾𝗇𝖼𝖺𝗇𝗍𝖺𝖽𝗈'),
  group: toSerifBold('👥 𝖬𝖺𝗀𝗂𝖺 𝗀𝗋𝗎𝗉𝖺𝗅'),
  serbot: toSerifBold('🪄 𝖲𝗎𝖻 𝖡𝗈𝗍𝗌 & 𝖢𝗅𝗈𝗇𝖾𝗌'),
  tools: toSerifBold('🔧 𝖧𝖾𝖈𝗁𝗂𝗓𝗈𝗌 𝗎́𝗍𝗂𝗅𝗂𝗌'),
  kawaii: toSerifBold('🎀 𝖠𝗇𝗂𝗆𝖾 & 𝖪𝖺𝗐𝖺𝗂𝗂'),
  descargas: toSerifBold('📥 𝖣𝖾𝗌𝖼𝖺𝗋𝗀𝖺𝗌 𝗆𝖺́𝗀𝗂𝖼𝖺𝗌')
};

const defaultMenu = {
  before: `
❀───────𓆩♡𓆪───────❀
「🍁」 ¡𝖧𝗈𝗅𝖺, *%name*~! ${ucapan()} ˎˊ˗

🌸『 𝖨𝖭𝖥𝖮 - 𝖴𝖲𝖤𝖱 』🌸
👤 𝖭𝗈𝗆𝖻𝗋𝖾: *%name*
🎀 𝖭𝗂𝗏𝖾𝗅: *%level* | ✨ 𝖤𝗑𝗉: *%exp/%maxexp*
🔓 𝖬𝗈𝖽𝗈: *%mode*
📈 𝖱𝖾𝗀𝗂𝗌𝗍𝗋𝗈 𝗀𝗅𝗈𝖻𝖺𝗅: *%totalreg*
🕐 𝖳𝗂𝖾𝗆𝗉𝗈 𝖺𝖼𝗍𝗂𝗏𝗈: *%muptime*

╰─🍓𓆩 𝖲𝗎𝗄𝗂_𝖡𝗈𝗍_𝖬𝖣 𓆪🍰─╯
%readmore`.trim(),

  header: '\n` %category 乂`\n',
  body: '.🍂.𖦹˙ %cmd %iscorazones %isPremium',
  footer: '\n',
  after: ``,
};

let handler = async (m, { conn, usedPrefix: _p}) => {
  try {
    const { exp = 0, level = 0} = global.db.data.users[m.sender];
    const { min, xp} = xpRange(level, global.multiplier);
    const name = await conn.getName(m.sender);
    const muptime = clockString(process.uptime() * 1000);
    const totalreg = Object.keys(global.db.data.users).length;
    const mode = global.opts["self"]? "𝖯𝗋𝗂𝗏𝖺𝖽𝗈 🔒": "𝖯𝗎́𝖻𝗅𝗂𝖼𝗈 🌐";

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
          if (!(t in tags) && t) tags[t] = toSerifBold(t);
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
    console.error('[❌] 𝖤𝗋𝗋𝗈𝗋 𝖾𝗇 𝗆𝖾𝗇𝗎 𝖽𝖾𝖼𝗈𝗋𝖺𝖽𝗈:', e);
    conn.reply(m.chat, '❎ 𝖲𝗎𝗄𝗂 𝗌𝖾 𝗍𝗋𝗈𝗉𝖾𝗓𝗈́ 𝖾𝗇𝗍𝗋𝖾 𝗉𝖾́𝗍𝖺𝗅𝗈𝗌 🌸. 𝖨𝗇𝗍𝖾𝗇𝗍𝖺𝗅𝗈 𝗈𝗍𝗋𝖺 𝗏𝖾𝗓, 𝗉𝗈𝗋𝖿𝖺.', m);
    }
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'menukawaii', 'menucompleto'];
handler.register = false;

export default handler;

function ucapan() {
    const time = moment.tz('America/Lima').format('HH')
    let res = "Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌉"
    if (time >= 5) {
        res = "Bᴜᴇɴᴀ Mᴀᴅʀᴜɢᴀᴅᴀ 🏙️"
    }
    if (time > 10) {
        res = "Bᴜᴇɴ Dɪ́ᴀ 🏞️"
    }
    if (time >= 12) {
        res = "Hᴇʀᴍᴏsᴀ Tᴀʀᴅᴇ 🌆"
    }
    if (time >= 19) {
        res = "Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃"
    }
    return res
}

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
function clockString(ms) {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')}
