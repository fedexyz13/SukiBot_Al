import { sticker} from '../lib/sticker.js'
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png} from '../lib/webp2mp4.js'

let handler = async (m, { conn, args, usedPrefix, command}) => {
  let stiker = false
  try {
    let q = m.quoted? m.quoted: m
    let mime = (q.msg || q).mimetype || q.mediaType || ''

    if (/webp|image|video/g.test(mime)) {
      if (/video/g.test(mime) && (q.msg || q).seconds> 15) {
        return m.reply('❌ El video es muy largo~ solo acepto hasta 15 segunditos mágicos ✨')
}

      let img = await q.download?.()
      if (!img) {
        return conn.reply(m.chat, '🩷 Envía una imagen o video cortito para crear tu sticker encantado~', m)
}

      let out
      try {
        let userId = m.sender
        let packstickers = global.db.data.users[userId] || {}
        let texto1 = packstickers.text1 || global.packsticker
        let texto2 = packstickers.text2 || global.packsticker2

        stiker = await sticker(img, false, texto1, texto2)
} finally {
        if (!stiker) {
          if (/webp/g.test(mime)) out = await webp2png(img)
          else if (/image/g.test(mime)) out = await uploadImage(img)
          else if (/video/g.test(mime)) out = await uploadFile(img)
          if (typeof out!== 'string') out = await uploadImage(img)
          stiker = await sticker(false, out, global.packsticker, global.packsticker2)
}
}
} else if (args[0]) {
      if (isUrl(args[0])) {
        stiker = await sticker(false, args[0], global.packsticker, global.packsticker2)
} else {
        return m.reply('❌ La URL que me diste no es válida~ Intenta con una dirección correcta 🌐')
}
}
} finally {
    if (stiker) {
      await conn.sendFile(m.chat, stiker, 'suki_sticker.webp', '', m)
} else {
      return conn.reply(m.chat,
`🧃 ¡Sticker no generado!

💖 Envíame:
• Una imagen (.jpg,.png,.webp)
• Un video cortito (máx. 10-15 segundos)
• O una URL con imagen directa

✨ Ejemplo mágico:
${usedPrefix}${command} https://i.imgur.com/cute-anime.png

🍓 Consejo: usa fotos claras, kawaii y con buena calidad 🪄`, m)
}
}
}

handler.help = ['sticker <imagen|video|url>']
handler.tags = ['sticker']
handler.command = ['sticker', 'stiker', 's']

export default handler

const isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
}
