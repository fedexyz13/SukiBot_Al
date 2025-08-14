let handler = async (m, { conn, command, args, usedPrefix, isOwner, isROwner, isAdmin}) => {
  const chat = global.db.data.chats[m.chat];
  const bot = global.db.data.settings[conn.user.jid] || {};
  const config = command.toLowerCase();
  const isGroup = m.isGroup;
  let globalSetting = false;

  if (!args[0]) {
    const estado = chat[config]? '🟢 ACTIVO': '🔴 INACTIVO';
    return conn.reply(m.chat,
`🍓 *Panel de configuración de Suki_Bot_MD*

🧃 Comando: *${command}*
🎀 Estado actual: ${estado}

✨ Usa uno de estos para ajustar:
• *${usedPrefix + command} on* — Activar 🌈
• *${usedPrefix + command} off* — Desactivar 😴`, m);
}

  const activar = /on|activar|enable/i.test(args[0]);
  const desactivar = /off|desactivar|disable/i.test(args[0]);
  let valor = activar? true: desactivar? false: null;

  if (valor === null) throw `🌸 Usa: *${usedPrefix + command} on/off*`;

  // Validar permisos según el comando
  const permisosGrupo = isGroup &&!(isAdmin || isOwner);
  const permisosPrivado =!isGroup &&!isOwner;

  switch (config) {
    case 'welcome':
    case 'bv':
    case 'bienvenida':
    case 'reaction':
    case 'reaccion':
    case 'detect':
    case 'detect2':
    case 'nsfw':
      if (permisosGrupo || permisosPrivado) throw '⚠️ Solo admins pueden cambiar esto.';
      chat[config] = valor;
      break;

    case 'modoadmin':
    case 'soloadmin':
    case 'antisubbots':
    case 'antisub':
    case 'antilink':
    case 'antilink2':
    case 'antiprivado': // ✅ Nuevo comando agregado
      if (permisosGrupo) throw '⚠️ Solo admins pueden cambiar esto.';
      chat[config] = valor;
      break;

    case 'jadibotmd':
    case 'modejadibot':
      if (!isOwner) throw '⚠️ Solo el dueño del bot puede cambiar esto.';
      bot.jadibotmd = valor;
      globalSetting = true;
      break;

    default:
      return conn.reply(m.chat, '🧁 Esta configuración no existe en el mundo de Suki todavía...', m);
}

  const lugar = globalSetting? '🌐 Aplicado globalmente': '👑 Activado en este grupo';

  return conn.reply(m.chat,
`✨ *Encanto actualizado con éxito*

📌 Opción: *${command}*
📶 Estado: ${valor? '✅ ACTIVADO': '❌ DESACTIVADO'}
${lugar}

🌈 Suki ha lanzado el hechizo 🪄`, m);
};

handler.help = [
  'welcome', 'bv', 'bienvenida',
  'reaction', 'reaccion',
  'detect', 'detect2',
  'nsfw', 'modoadmin', 'soloadmin',
  'antisubbots', 'antisub', 'antilink', 'antilink2',
  'antiprivado', // ✅ Agregado aquí también
  'jadibotmd', 'modejadibot',
];
handler.tags = ['settings', 'group'];
handler.command = handler.help;
handler.register = true;

export default handler;
