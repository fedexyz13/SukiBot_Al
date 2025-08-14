let handler = async (m, { args}) => {
  let code = args[0]
  if (!code ||!/^\d{4}-\d{4}$/.test(code)) {
    return m.reply('⚠️ No se recibió un código válido.')
}

  await m.reply(`📋 Cᴏ́ᴅɪɢᴏ ᴄᴏᴘɪᴀᴅᴏ:\n\n*${code}*`)

  // Opcional: enviar como sticker (requiere sticker lib)
  // await conn.sendImageAsSticker(m.chat, `https://fakeimg.pl/300x100/?text=${code}`, m)

  // Opcional: guardar en base de datos
  global.db.data.users[m.sender].lastCode = code
}

handler.help = ['copiar']
handler.tags = ['tools']
handler.command = ['copiar']
export default handler
