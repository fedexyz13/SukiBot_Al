import { useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion} from "@whiskeysockets/baileys"
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from "pino"
import chalk from "chalk"
import * as ws from "ws"
import { makeWASocket} from "../lib/simple.js"
import { fileURLToPath} from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const emoji = "🍓"
const emoji2 = "🧁"

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
  const mcode = args.some(arg => /(--code|code)/.test(arg?.trim()))
  args = args.map(arg => arg.replace(/^--code$|^code$/, "").trim()).filter(Boolean)

  const pathCreds = path.join(pathblackJadiBot, "creds.json")
  if (!fs.existsSync(pathblackJadiBot)) fs.mkdirSync(pathblackJadiBot, { recursive: true})

  try {
    if (args[0]) {
      const decoded = Buffer.from(args[0], "base64").toString("utf-8")
      fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(decoded), null, "\t"))
}
} catch {
    conn.reply(m.chat, `${emoji} Usa correctamente el comando » ${usedPrefix + command} code`, m)
    return
}

  const { version} = await fetchLatestBaileysVersion()
  const msgRetry = () => {}
  const msgRetryCache = new NodeCache()
  const { state, saveCreds} = await useMultiFileAuthState(pathblackJadiBot)

  const connectionOptions = {
    logger: pino({ level: "fatal"}),
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent"}))
},
    msgRetry,
    msgRetryCache,
    browser: mcode? ["Ubuntu", "Chrome", "110.0.5585.95"]: ["SubBot", "Chrome", "2.0.0"],
    version,
    generateHighQualityLinkPreview: true
}

  let sock = makeWASocket(connectionOptions)
  sock.isInit = false
  let isInit = true

  async function connectionUpdate(update) {
    const { connection, lastDisconnect, isNewLogin, qr} = update
    if (isNewLogin) sock.isInit = false

    if (qr &&!mcode && m?.chat) {
      const txtQR = await conn.sendMessage(m.chat, {
        image: await qrcode.toBuffer(qr, { scale: 8}),
        caption: rtx
}, { quoted: m})
      if (txtQR?.key) setTimeout(() => conn.sendMessage(m.sender, { delete: txtQR.key}), 30000)
}

    if (qr && mcode) {
      let secret = await sock.requestPairingCode(m.sender.split("@")[0])
      secret = secret.match(/.{1,4}/g)?.join("-")
      const txtCode = await conn.sendMessage(m.chat, { text: rtx2}, { quoted: m})
      const codeBot = await m.reply(secret)
      if (txtCode?.key) setTimeout(() => conn.sendMessage(m.sender, { delete: txtCode.key}), 30000)
      if (codeBot?.key) setTimeout(() => conn.sendMessage(m.sender, { delete: codeBot.key}), 30000)
}

    if (connection === "open") {
    const userName = sock.authState.creds.me.name || "SubBot"
      const userJid = sock.authState.creds.me.jid || `${path.basename(pathblackJadiBot)}@s.whatsapp.net`
      console.log(chalk.cyanBright(`🟢 ${userName} conectado como SubBot (${userJid})`))
      sock.isInit = true
      global.conns.push(sock)

      if (m?.chat) {
        await conn.sendMessage(m.chat, {
          text: `@${m.sender.split("@")[0]}, ¡ya estás conectado como SubBot!`,
          mentions: [m.sender]
}, { quoted: m})
}
}
}

  let handler = await import("../handler.js")
  async function creloadHandler(restartConn) {
    try {
      const Handler = await import(`../handler.js?update=${Date.now()}`)
      if (Object.keys(Handler || {}).length) handler = Handler
} catch (e) {
      console.error("⚠️ Error al recargar handler:", e)
}

    if (restartConn) {
      try { sock.ws.close()} catch {}
      sock.ev.removeAllListeners()
      sock = makeWASocket(connectionOptions)
      isInit = true
}

    if (!isInit) {
      sock.ev.off("messages.upsert", sock.handler)
      sock.ev.off("connection.update", sock.connectionUpdate)
      sock.ev.off("creds.update", sock.credsUpdate)
}

    sock.handler = handler.handler.bind(sock)
    sock.connectionUpdate = connectionUpdate.bind(sock)
    sock.credsUpdate = saveCreds.bind(sock, true)
    sock.ev.on("messages.upsert", sock.handler)
    sock.ev.on("connection.update", sock.connectionUpdate)
    sock.ev.on("creds.update", sock.credsUpdate)
    isInit = false
    return true
}

  creloadHandler(false)

  setInterval(() => {
    if (!sock.user) {
      try { sock.ws.close()} catch {}
      sock.ev.removeAllListeners()
      const i = global.conns.indexOf(sock)
      if (i>= 0) {
        delete global.conns[i]
        global.conns.splice(i, 1)
}
}
}, 60000)
}

// ✅ Exportación para usar desde otros archivos
export const nakanoJadiBot = blackJadiBot
