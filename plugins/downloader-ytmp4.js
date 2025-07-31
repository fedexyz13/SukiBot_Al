// Código creado y mejorado por fedexyz 🍁
// no quites los créditos 🍂

import fetch from "node-fetch";
import axios from 'axios';
import yts from 'yt-search';

const channelRD = "https://whatsapp.com/channel/0029VbApe6jG8l5Nv43dsC2N"; // Nuevo canal oficial

const handler = async (m, { conn, text, usedPrefix, command, args}) => {
  try {
    if (!text) return conn.reply(m.chat, `🌾 *Ingresa un link de YouTub'e*`, m);

    m.react('⏱️');

    const isYoutubeUrl = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(text);
    let videoInfo, urlYt;

    if (isYoutubeUrl) {
      const id = text.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^\s&]+)/)?.[1];
      if (!id) return m.reply(`⚠️ No se pudo extraer el ID del video.`);
      const result = await yts({ videoId: id});
      videoInfo = result;
      urlYt = text;
} else {
      const search = await yts(text);
      if (!search?.videos?.length) return conn.reply(m.chat, `⚠️ No se encontraron resultados para: *${text}*`, m);
      videoInfo = search.videos[0];
      urlYt = videoInfo.url;
}

    const {
      title = 'Sin título',
      timestamp = 'Desconocido',
      author = {},
      views = 0,
      ago = 'Desconocido',
      url = urlYt,
      thumbnail
} = videoInfo;

    const vistas = views.toLocaleString('es-PE');
    const canal = author.name || 'Desconocido';
    const { data} = await axios.get(`https://dark-core-api.vercel.app/api/download/YTMP4?key=api&url=${url}`);
    if (!data?.status ||!data?.data?.dl) throw new Error("No se pudo obtener el enlace de descarga.");
    const videoUrl = data.data.dl;
    const size = await getSize(videoUrl);
    const sizeStr = size? await formatSize(size): 'Desconocido';

    const textoInfo =
      ` ⬣ *🎲  \`YOUTUBE - MP4\` 🇯🇵* ⬣\n\n` +
      `> 📌 *Título:* ${title}\n` +
      `> ⏱️ *Duración:* ${timestamp}\n` +
      `> 👩‍🎓 *Canal:* ${canal}\n` +
      `> 👁️ *Vistas:* ${vistas}\n` +
      `> 🗓️ *Publicado:* ${ago}\n` +
      `> 💾 *Tamaño:* ${sizeStr}\n` +
      `> 🔗 *Link:* ${url}\n\n` +
      `*🎐 Enviado por Suki_Bot_MD ✨*\n*🔔 Únete a nuestro canal:* ${channelRD}\n*👒 Imagen: Suki na Ko ga Megane wo Wasureta — edición mística 🔥*`;

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail}, // Puedes reemplazar con 'imagen.jpg' si es local
      caption: textoInfo
}, { quoted: m});

    const videoBuffer = await fetch(videoUrl).then(res => res.buffer());
    await conn.sendFile(m.chat, videoBuffer, `${title}.mp4`, '\n🖍️ Aquí está tu video, cortesía de Suki_Bot_MD~ 💕', m);

    m.react('✅');
} catch (e) {
    console.error(e);
    m.reply(`❌ Ocurrió un error:\n${e.message}`);
}
};

export default handler;

// Utilidades
async function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  if (!bytes || isNaN(bytes)) return 'Desconocido';
  while (bytes>= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
}
  return `${bytes.toFixed(2)} ${units[i]}`;
}

async function getSize(url) {
  try {
    const response = await axios.head(url);
    return response.headers['content-length']
? parseInt(response.headers['content-length'], 10)
: null;
} catch (error) {
    console.error("Error al obtener el tamaño:", error.message);
    return null;
}
}
