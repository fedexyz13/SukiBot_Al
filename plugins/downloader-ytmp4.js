// Código creado y mejorado por fedexyz 🍁
// no quites los créditos 🍂

import fetch from "node-fetch";
import axios from "axios";
import yts from "yt-search";

const channelRD = "https://whatsapp.com/channel/0029VbApe6jG8l5Nv43dsC2N"; // Tu canal oficial

const handler = async (m, { conn, text}) => {
  try {
    if (!text) {
      return conn.reply(m.chat, `🌾 *Ingresa un link o nombre de video en YouTube*`, m);
}

    m.react("⏱️");

    let videoInfo, urlYt;
    const isYoutubeUrl = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(text);

    if (isYoutubeUrl) {
      const id = text.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^\s&]+)/)?.[1];
      if (!id) return m.reply(`⚠️ No se pudo extraer el ID del video.`);
      const result = await yts({ videoId: id});
      videoInfo = result;
      urlYt = text;
} else {
      const search = await yts(text);
      if (!search?.videos?.length) {
        return conn.reply(m.chat, `⚠️ No se encontraron resultados para: *${text}*`, m);
}
      videoInfo = search.videos[0];
      urlYt = videoInfo.url;
}

    const {
      title = "Sin título",
      timestamp = "Desconocido",
      author = {},
      views = 0,
      ago = "Desconocido",
      url = urlYt
} = videoInfo;

    const canal = author.name || "Desconocido";
    const vistas = views.toLocaleString("es-PE");

    const response = await axios.get(`https://dark-core-api.vercel.app/api/download/YTMP4?key=api&url=${url}`);
    if (!response?.data?.status ||!response.data.data?.dl) {
      return m.reply(`🚫 *No se pudo generar el enlace de descarga.*\n🔁 *Intenta más tarde o prueba otro video.*`);
}

    const videoUrl = response.data.data.dl;
    const size = await getSize(videoUrl);
    const sizeStr = size? await formatSize(size): "Desconocido";

    const caption =
      `✨ *SukiBot_MD invoca tu video con estilo anime* ✨\n\n` +
      `🎬 *Título:* ${title}\n` +
      `⏱️ *Duración:* ${timestamp}\n` +
      `📺 *Canal:* ${canal}\n` +
      `👁️ *Vistas:* ${vistas}\n` +
      `🗓️ *Publicado:* ${ago}\n` +
      `💾 *Tamaño:* ${sizeStr}\n` +
      `🔗 *Link:* ${url}\n\n` +
      `🪄 *Enviado por SukiBot_MD*\n📢 *Únete al canal:* ${channelRD}`;

    await conn.sendMessage(m.chat, {
      image: { url: "imagen.jpg"}, // Coloca aquí tu imagen personalizada estilo Suki anime
      caption
}, { quoted: m});

    const videoBuffer = await fetch(videoUrl).then(res => res.buffer());
    await conn.sendFile(m.chat, videoBuffer, `${title}.mp4`, `🎁 *Aquí está tu video, cortesía de SukiBot_MD* 🌸`, m);

    m.react("✅");

} catch (e) {
    console.error("Error:", e);
    m.reply(`❌ Error inesperado:\n${e.message}`);
}
};

handler.help = ['ytmp4 <link o nombre>'];
handler.command = ['ytmp4'];
handler.tags = ['descargas'];

export default handler;

async function formatSize(bytes) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  if (!bytes || isNaN(bytes)) return "Desconocido";
  while (bytes>= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
}
  return `${bytes.toFixed(2)} ${units[i]}`;
}

async function getSize(url) {
  try {
    const response = await axios.head(url);
    return response.headers["content-length"]
? parseInt(response.headers["content-length"], 10)
: null;
} catch (error) {
    console.error("Error al obtener tamaño:", error.message);
    return null;
}
}
