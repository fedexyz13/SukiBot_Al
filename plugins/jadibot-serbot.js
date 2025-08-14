import { useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion} from "@whiskeysockets/baileys"
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from "pino"
import chalk from "chalk"
import * as ws from "ws"
import { makeWASocket} from "../lib/simple.js"

const emoji = "🍓"
const emoji2 = "🧁"
const jadi = "jadibot-sessions"

const rtx = `🌸 SubBot — Vinculo por QR 💠

🪄 Vincúlate como SubBot temporal:

1 » Abre WhatsApp y toca los ⋮ tres puntos
2 » Selecciona *Dispositivos vinculados*
3 » Pulsa *Vincular dispositivo*
4 » Escanea el QR encantado en pantalla

⏱️ Este hechizo dura 45 segundos. ¡Activa rápido!

📡 Estado: [ QR pastel activo ]`

const rtx2 = `🌙 SubBot — Vinculo por Código ✧

🔐 Vinculación manual por código:

1 » Abre WhatsApp y toca los ⋮ pétalos mágicos
2 » Ve a *Dispositivos vinculados*
3 » Elige *Vincular con número de teléfono*
4 » Ingresa el código otorgado por el bot

⚠️ Usa una cuenta secundaria (no tu principal)

📡 Estado: [ Código pastel listo ]`

export async function blackJadiBot(options) {
  let { pathblackJadiBot, m, conn, args, usedPrefix, command} = options
  const mcode = command === 'code'

  const pathCreds = path.join(pathblackJadiBot, "creds.json")
  if (!fs.existsSync(pathblackJadiBot)) fs.mkdirSync(pathblackJadiBot, { recursive: true})

  const { version} = await fetchLatestBaileysVersion()
  const msgRetryCache = new NodeCache()
  const { state, saveCreds} = await useMultiFileAuthState(pathblackJadiBot)

  const connectionOptions = {
    logger: pino({ level: "fatal"}),
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent"}))
},
    msgRetry: () => {},
    msgRetryCache,
    browser: mcode? ["Ubuntu", "Chrome", "110.0.5585.95"]: ["SubBot", "Chrome", "2.0.0"],
    version
}

  let sock = makeWASocket(connectionOptions)
  sock.isInit = false

  sock.ev.on("connection.update", async (update) => {
    const { connection, qr} = update

    if (qr &&!mcode) {
      const txtQR = await conn.sendMessage(m.chat, {
        image: await qrcode.toBuffer(qr, { scale: 8}),
        caption: rtx
}, { quoted: m})
      if (txtQR?.key) setTimeout(() => conn.sendMessage(m.sender, { delete: txtQR.key}), 30000)
}

    if (qr && mcode) {
      try {
        let rawCode = await sock.requestPairingCode(m.sender.split("@")[0])
        let formattedCode = rawCode.match(/.{1,4}/g)?.join("-") || rawCode

        await conn.sendMessage(m.chat, { text: rtx2}, { quoted: m})
        await conn.sendMessage(m.chat, {
          text: `🔐 Tu código de vinculación es:\n\n*${formattedCode}*\n\n⏱️ Este código expira en pocos minutos.`,
          quoted: m
})
        console.log(`Código generado para ${m.sender}: ${formattedCode}`)
} catch (e) {
        console.error("❌ Error al generar código:", e)
        await conn.reply(m.chat, "⚠️ No se pudo generar el código. Intenta más tarde.", m)
}
}

    if (connection === "open") {
      global.conns.push(sock)
      await conn.sendMessage(m.chat, {
        text: `@${m.sender.split("@")[0]}, ¡ya estás conectado como SubBot!`,
        mentions: [m.sender]
}, { quoted: m})
}
})

  sock.ev.on("creds.update", saveCreds)
}

// ✅ Handler que responde a.qr y.code
async function handler(m, { conn, args, usedPrefix, command}) {
  const botSettings = global.db.data.settings[conn.user.jid] ||= {}
  if (!botSettings.jadibotmd) return m.reply('⚠️ El comando está desactivado temporalmente.')

  const cooldown = 10000
  const now = Date.now()
  const lastTime = global.db.data.users[m.sender]?.Subs || 0
  if (now - lastTime < cooldown) {
    const wait = msToTime(cooldown - (now - lastTime))
    return conn.reply(m.chat, `⏳ Espera ${wait} antes de volver a vincular un SubBot.`, m)
}

  const activeBots = global.conns.filter(conn => conn.user && conn.ws.socket && conn.ws.socket.readyState!== ws.CLOSED)
  if (activeBots.length>= 40) {
    return conn.reply(m.chat, `${emoji2} No hay espacios disponibles para nuevos SubBots.`, m)
}

  const id = m.sender.split('@')[0]
  const sessionPath = path.join(`./${jadi}`, id)
  if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true})

  const options = {
    pathblackJadiBot: sessionPath,
    m,
    conn,
    args,
    usedPrefix,
    command,
    fromCommand: true
}

  await blackJadiBot(options)
  global.db.data.users[m.sender] ||= {}
  global.db.data.users[m.sender].Subs = now
}

// ✅ Registro del plugin
handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']
handler.register = true

export default handler

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  const parts = []
  if (hours) parts.push(`${hours}h`)
  if (minutes) parts.push(`${minutes}m`)
  parts.push(`${seconds}s`)
  return parts.join(' ')
}
