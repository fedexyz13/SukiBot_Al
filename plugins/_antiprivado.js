export async function before(m, {conn, isAdmin, isBotAdmin, isOwner, isROwner}) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;
  if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') || m.text.includes('serbot') || m.text.includes('jadibot')) return !0;
  const chat = global.db.data.chats[m.chat];
  const bot = global.db.data.settings[this.user.jid] || {};
if (m.chat === '120363402097425674@newsletter) return !0
  if (bot.antiPrivate && !isOwner && !isROwner) {
    await m.reply(`${emoji} һ᥆ᥣᥲ @${m.sender.split`@`[0]}, mі ᥴrᥱᥲძ᥆r ᥲ ძᥱsᥲᥴ𝗍і᥎ᥲძ᥆ ᥣ᥆s ᥴ᥆mᥲᥒძ᥆s ᥱᥒ ᥣ᥆s ᥴһᥲ𝗍s ⍴rі᥎ᥲძᥲs ᥱ́ᥣ ᥴᥙᥲ́ᥣ sᥱrᥲ́s ᑲᥣ᥆𝗊ᥙᥱᥲძ᥆, sі 𝗊ᥙіᥱrᥱs ᥙsᥲr ᥣ᥆s ᥴ᥆mᥲᥒძ᥆s ძᥱᥣ ᑲ᥆𝗍 𝗍ᥱ іᥒ᥎і𝗍᥆ ᥲ 𝗊ᥙᥱ 𝗍ᥱ ᥙᥒᥲs ᥲᥣ grᥙ⍴᥆ ⍴rіᥒᥴі⍴ᥲᥣ ძᥱᥣ ᑲ᥆𝗍.\n\n${gp1}`, false, {mentions: [m.sender]});
    await this.updateBlockStatus(m.chat, 'block');
  }
  return !1;
}
