process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
import './config.js'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts'
import {createRequire} from 'module'
import {fileURLToPath, pathToFileURL} from 'url'
import {platform} from 'process'
import * as ws from 'ws'
import fs, {readdirSync, statSync, unlinkSync, existsSync, mkdirSync, readFileSync, rmSync, watch} from 'fs'
import yargs from 'yargs';
import {spawn} from 'child_process'
import lodash from 'lodash'
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import {tmpdir} from 'os'
import {format} from 'util'
import boxen from 'boxen'
import P from 'pino'
import pino from 'pino'
import Pino from 'pino'
import path, { join, dirname } from 'path'
import {Boom} from '@hapi/boom'
import {makeWASocket, protoType, serialize} from './lib/simple.js'
import {Low, JSONFile} from 'lowdb'
import {mongoDB, mongoDBV2} from './lib/mongoDB.js'
import store from './lib/store.js'

const {proto} = (await import('@whiskeysockets/baileys')).default
import pkg from 'google-libphonenumber'
const { PhoneNumberUtil } = pkg
const phoneUtil = PhoneNumberUtil.getInstance()

const {DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser, Browsers} = await import('@whiskeysockets/baileys')
import readline, { createInterface } from 'readline'
import NodeCache from 'node-cache'

const {CONNECTING} = ws
const {chain} = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

let { say } = cfonts
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

// Variables globales
global.sessions = 'sessions'
global.jadi = 'JadiBots'
global.yukiJadibts = true

async function showBanner() {
    const title = `░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄░░░░░░░░░░░░░░░░░▄▀░░░░░░░░░░░░▄░░░░░░░▀▄░░░░░░░░░░░░░░░█░░▄░░░░▄░░░░░░░░░░░░░░█░░░░░░░░░░░░░░░█░░░░░░░░░░░░▄█▄▄░░▄░░░█░▄▄▄░░░░▄▄▄▄▄░░█░░░░░░▀░░░░▀█░░▀▄░░░░░█▀▀░██░░░██▄▀██▄█░░░▄░░░░░░░██░░░░▀▀▀▀▀░░░░██░░░░▀██▄▀██░░░░░░░░▀░██▀░░░░░░░░░░░░░▀██░░░░░▀████░▀░░░░▄░░░██░░░▄█░░░░▄░▄█░░██░░░░░░░░▀█░░░░▄░░░░░██░░░░▄░░░▄░░▄░░░██░░░░░░░░▄█▄░░░░░░░░░░░▀▄░░▀▀▀▀▀▀▀▀░░▄▀░░░░░░░░█▀▀█████████▀▀▀▀████████████▀░░░░░░░░░░████▀░░███▀░░░░░░▀███░░▀██▀░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    `.split('\n').map(line => chalk.hex('#ff00cc').bold(line)).join('\n')
    
    const subtitle = chalk.hex('#00eaff').bold('✦ Suki-Bot-MD ✦').padStart(40)
    const poweredMsg = chalk.hex('#00eaff').italic('powered by Brayan')
    const aiMsg = chalk.hex('#ffb300').bold('🤖 Suki-Bot-MD - Tu compañera virtual')
    
    const tips = [
        chalk.hex('#ffb300')('💡 Tip: Usa /help para ver los comandos disponibles.'),
        chalk.hex('#00eaff')('⭐ Síguenos en GitHub para actualizaciones.'),
        chalk.hex('#ff00cc')('✨ Disfruta de la experiencia premium de Suki-Bot-MD.')
    ]
    
    const loadingFrames = [
        chalk.magentaBright('⠋ Cargando módulos...'),
        chalk.magentaBright('⠙ Cargando módulos...'),
        chalk.magentaBright('⠹ Cargando módulos...'),
        chalk.magentaBright('⠸ Cargando módulos...'),
        chalk.magentaBright('⠼ Cargando módulos...'),
        chalk.magentaBright('⠴ Cargando módulos...'),
        chalk.magentaBright('⠦ Cargando módulos...'),
        chalk.magentaBright('⠧ Cargando módulos...'),
        chalk.magentaBright('⠇ Cargando módulos...'),
        chalk.magentaBright('⠏ Cargando módulos...')
    ]
    
    console.clear()
    
    console.log(
        boxen(
            title + '\n' + subtitle,
            {
                padding: 1,
                margin: 1,
                borderStyle: 'double',
                borderColor: 'whiteBright',
                backgroundColor: 'black',
                title: 'Suki-Bot-MD',
                titleAlignment: 'center'
            }
        )
    )
    
    say('Suki-Bot-MD', {
        font: 'block',
        align: 'center',
        colors: ['blue', 'cyan'],
        background: 'transparent',
        letterSpacing: 1,
        lineHeight: 1
    })
    
    say('powered by Fedexyz', {
        font: 'console',
        align: 'center',
        colors: ['blue'],
        background: 'transparent'
    })
    
    console.log('\n' + aiMsg + '\n')
    
    // Animación de carga
    for (let i = 0; i < 18; i++) {
        process.stdout.write('\r' + loadingFrames[i % loadingFrames.length])
        await sleep(70)
    }
    process.stdout.write('\r' + ' '.repeat(40) + '\r')
    
    // Mensaje de bienvenida
    console.log(
        chalk.bold.cyanBright(
            boxen(
                chalk.bold('¡Bienvenido a Suki-Bot-MD!\n') +
                chalk.hex('#00eaff')('La bot está arrancando, por favor espere...') +
                '\n' +
                tips.join('\n'),
                {
                    padding: 1,
                    margin: 1,
                    borderStyle: 'round',
                    borderColor: 'yellow'
                }
            )
        )
    )
    
    // Efecto de "sparkle" final
    const sparkles = [
        chalk.hex('#ff00cc')('✦'), chalk.hex('#00eaff')('✦'), chalk.hex('#ffb300')('✦'),
        chalk.hex('#00eaff')('✦'), chalk.hex('#ff00cc')('✦'), chalk.hex('#ffb300')('✦')
    ]
    let sparkleLine = ''
    for (let i = 0; i < 30; i++) {
        sparkleLine += sparkles[i % sparkles.length]
    }
    console.log('\n' + sparkleLine + '\n')
}

// Ejecutar el banner
await showBanner()

protoType()
serialize()

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
    return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
}

global.__dirname = function dirname(pathURL) {
    return path.dirname(global.__filename(pathURL, true))
}

global.__require = function require(dir = import.meta.url) {
    return createRequire(dir)
}

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({...query, ...(apikeyqueryname ? {[apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]} : {})})) : '');

global.timestamp = {start: new Date}

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[#/!.]')

global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile('./database.json'))
global.DATABASE = global.db

global.loadDatabase = async function loadDatabase() {
    if (global.db.READ) {
        return new Promise((resolve) => setInterval(async function() {
            if (!global.db.read) {
                clearInterval(this)
                resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
            }
        }, 1 * 1000))
    }
    if (global.db.data !== null) return
    global.db.READ = true
    await global.db.read().catch(console.error)
    global.db.READ = null
    global.db.data = {
        users: {},
        chats: {},
        stats: {},
        msgs: {},
        sticker: {},
        settings: {},
        ...(global.db.data || {}),
    }
    global.db.chain = chain(global.db.data)
}

loadDatabase()

const {state, saveState, saveCreds} = await useMultiFileAuthState(global.sessions)
const msgRetryCounterMap = (MessageRetryMap) => { };
const msgRetryCounterCache = new NodeCache()
const {version} = await fetchLatestBaileysVersion();

let phoneNumber = global.botNumber
const methodCodeQR = process.argv.includes("qr")
const methodCode = !!phoneNumber || process.argv.includes("code")
const MethodMobile = process.argv.includes("mobile")

const colores = chalk.bgMagenta.white
const opcionQR = chalk.bold.green
const opcionTexto = chalk.bold.cyan

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver))

let opcion
if (methodCodeQR) {
    opcion = '1'
}

if (!methodCodeQR && !methodCode && !fs.existsSync(`./${global.sessions}/creds.json`)) {
    do {
        opcion = await question(`╭─────────────────────────────◉
│ ${chalk.red.bgBlueBright.bold('    ⚙ MÉTODO DE CONEXIÓN BOT    ')}
│「 💡 」${chalk.yellow('Selecciona cómo quieres conectarte')}
│「 📲 」${chalk.yellow.bgRed.bold('1. Escanear Código QR')}
│「 🔑 」${chalk.red.bgGreenBright.bold('2. Código de Emparejamiento')}
│
│「 ℹ️ 」${chalk.gray('Usa el código si tienes problemas con el QR')}
│「 🚀 」${chalk.gray('Ideal para la primera configuración')}
│
│ ${chalk.bold.bgGreen.bold('📦 COMANDOS DISPONIBLES')}
│「 🛠️ 」${chalk.bold('npm run qr')}     ${chalk.gray('# Inicia con QR')}
│「 🛠️ 」${chalk.bold('npm run code')}   ${chalk.gray('# Inicia con código')}
│「 🛠️ 」${chalk.bold('npm start')}      ${chalk.gray('# Inicia normalmente')}
╰─────────────────────────────◉
${chalk.magenta('--->')} ${chalk.bold('Elige (1 o 2): ')}`.trim());
        
        if (!/^[1-2]$/.test(opcion)) {
            console.log(chalk.redBright('✖ Opción inválida. Solo se permite 1 o 2.'));
        }
    } while (opcion !== '1' && opcion !== '2' || fs.existsSync(`./${global.sessions}/creds.json`))
}

console.info = () => {}
console.debug = () => {}

const connectionOptions = {
    logger: pino({ level: 'silent' }),
    printQRInTerminal: opcion == '1' ? true : methodCodeQR ? true : false,
    mobile: MethodMobile,
    browser: opcion == '1' ? Browsers.macOS("Desktop") : methodCodeQR ? Browsers.macOS("Desktop") : Browsers.macOS("Chrome"),
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, P({ level: "fatal" }).child({ level: "fatal" })),
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    autoTyping: true,
    readGroup: true,
    readPrivate: true,
    syncFullHistory: false,
    downloadHistory: false,
    getMessage: async (clave) => {
        let jid = jidNormalizedUser(clave.remoteJid)
        let msg = await store.loadMessage(jid, clave.id)
        return msg?.message || ""
    },
    msgRetryCounterCache,
    msgRetryCounterMap,
    defaultQueryTimeoutMs: undefined,
    version
}

global.conn = makeWASocket(connectionOptions);

if (!fs.existsSync(`./${global.sessions}/creds.json`)) {
    if (opcion === '2' || methodCode) {
        opcion = '2'
        if (!conn.authState.creds.registered) {
            let addNumber
            if (!!phoneNumber) {
                addNumber = phoneNumber.replace(/[^0-9]/g, '')
            } else {
                do {
                    phoneNumber = await question(`╭─────────────────────────────◉
│ ${chalk.black.bgGreenBright.bold('  📞 INGRESO DE NÚMERO WHATSAPP  ')}
│「 ✨ 」${chalk.whiteBright('Introduce tu número con prefijo de país')}
│「 🧾 」${chalk.yellowBright('Ejemplo: 57321XXXXXXX')}
╰─────────────────────────────◉
${chalk.magentaBright('--->')} ${chalk.bold.greenBright('Número: ')}`.trim());
                    
                    phoneNumber = phoneNumber.replace(/\D/g, '');
                    if (!phoneNumber.startsWith('+')) {
                        phoneNumber = `+${phoneNumber}`;
                    }
                    if (!await isValidPhoneNumber(phoneNumber)) {
                        console.log(chalk.redBright('✖ El número ingresado no es válido. Inténtalo nuevamente.\n'));
                    }
                } while (!await isValidPhoneNumber(phoneNumber));
                
                rl.close();
                const addNumber = phoneNumber.replace(/\D/g, '');
                
                setTimeout(async () => {
                    let codeBot = await conn.requestPairingCode(addNumber);
                    codeBot = codeBot?.match(/.{1,4}/g)?.join('-') || codeBot;
                    console.log(`╭─────────────────────────────◉
│ ${chalk.black.bgMagentaBright.bold('🔐 CÓDIGO DE VINCULACIÓN GENERADO')}
│「 📎 」${chalk.whiteBright('Ingresa este código')}
│「 🔐 」${chalk.bold.red(codeBot)}
╰─────────────────────────────◉\n`);
                }, 3000)
            }
        }
    }
}

conn.isInit = false;
conn.well = false;

if (!opts['test']) {
    if (global.db) setInterval(async () => {
        if (global.db.data) await global.db.write()
        if (opts['autocleartmp'] && (global.support || {}).find) (tmp = [tmpdir(), 'tmp', `${global.jadi}`], tmp.forEach((filename) => spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])));
    }, 30 * 1000);
}

async function connectionUpdate(update) {
    const {connection, lastDisconnect, isNewLogin} = update;
    global.stopped = connection;
    if (isNewLogin) conn.isInit = true;
    const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
    if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
        await global.reloadHandler(true).catch(console.error);
        global.timestamp.connect = new Date;
    }
    if (global.db.data == null) loadDatabase();
    if (update.qr != 0 && update.qr != undefined || methodCodeQR) {
        if (opcion == '1' || methodCodeQR) {
            console.log(chalk.bold.yellow(`\n❐ ESCANEA EL CÓDIGO QR EXPIRA EN 45 SEGUNDOS`))
        }
    }
    if (connection == 'open') {
        console.log(chalk.bold.green('\n✨️ Suki-Bot-MD ya esta conectada ✨️'))
    }
    let reason = new Boom(lastDisconnect?.error)?.output?.statusCode
    if (connection === 'close') {
        if (reason === 429) {
            console.log(chalk.bold.redBright(`\n⚠︎ LÍMITE DE TASA EXCEDIDO, ESPERANDO 30 SEGUNDOS ANTES DE RECONECTAR...`))
            await new Promise(resolve => setTimeout(resolve, 30000))
            await global.reloadHandler(true).catch(console.error)
        } else if (reason === DisconnectReason.badSession) {
            console.log(chalk.bold.cyanBright(`\n⚠︎ SIN CONEXIÓN, BORRE LA CARPETA ${global.sessions} Y ESCANEA EL CÓDIGO QR ⚠︎`))
        } else if (reason === DisconnectReason.connectionClosed) {
            console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ☹\n┆ ⚠︎ CONEXION CERRADA, RECONECTANDO....\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ☹`))
            await global.reloadHandler(true).catch(console.error)
        } else if (reason === DisconnectReason.connectionLost) {
            console.log(chalk.bold.blueBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ☂\n┆ ⚠︎ CONEXIÓN PERDIDA CON EL SERVIDOR, RECONECTANDO....\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ☂`))
            await global.reloadHandler(true).catch(console.error)
        } else if (reason === DisconnectReason.connectionReplaced) {
            console.log(chalk.bold.yellowBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✗\n┆ ⚠︎ CONEXIÓN REEMPLAZADA, SE HA ABIERTO OTRA NUEVA SESION, POR FAVOR, CIERRA LA SESIÓN ACTUAL PRIMERO.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✗`))
        } else if (reason === DisconnectReason.loggedOut) {
            console.log(chalk.bold.redBright(`\n⚠︎ SIN CONEXIÓN, BORRE LA CARPETA ${global.sessions} Y ESCANEA EL CÓDIGO QR ⚠︎`))
            await global.reloadHandler(true).catch(console.error)
        } else if (reason === DisconnectReason.restartRequired) {
            console.log(chalk.bold.cyanBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✓\n┆ ✧ CONECTANDO AL SERVIDOR...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✓`))
            await global.reloadHandler(true).catch(console.error)
        } else if (reason === DisconnectReason.timedOut) {
            console.log(chalk.bold.yellowBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ▸\n┆ ⧖ TIEMPO DE CONEXIÓN AGOTADO, RECONECTANDO....\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ▸`))
            await global.reloadHandler(true).catch(console.error)
        } else {
            console.log(chalk.bold.redBright(`\n⚠︎！ RAZON DE DESCONEXIÓN DESCONOCIDA: ${reason || 'No encontrado'} >> ${connection || 'No encontrado'}`))
        }
    }
}

process.on('uncaughtException', console.error)

let isInit = true;
let handler = await import('./handler.js')

global.reloadHandler = async function(restatConn) {
    try {
        const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
        if (Object.keys(Handler || {}).length) handler = Handler
    } catch (e) {
        console.error(e);
    }
    if (restatConn) {
        const oldChats = global.conn.chats
        try {
            global.conn.ws.close()
        } catch { }
        conn.ev.removeAllListeners()
        global.conn = makeWASocket(connectionOptions, {
            chats: oldChats,
            retryRequestDelayMs: 10000,
            maxRetries: 3
        })
        isInit = true
    }
    if (!isInit) {
        conn.ev.off('messages.upsert', conn.handler)
        conn.ev.off('connection.update', conn.connectionUpdate)
        conn.ev.off('creds.update', conn.credsUpdate)
    }
    
    conn.handler = handler.handler ? handler.handler.bind(conn) : conn.handler
    conn.connectionUpdate = connectionUpdate.bind(global.conn)
    conn.credsUpdate = saveCreds.bind(global.conn, true)
    
    const currentDateTime = new Date()
    const messageDateTime = new Date(conn.ev)
    if (currentDateTime >= messageDateTime) {
        const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0])
    } else {
        const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0])
    }
    
    // Manejar eventos de mensajes
    conn.ev.on('messages.upsert', async (m) => {
        if (m.messages && m.messages[0] && m.messages[0].key && m.messages[0].key.remoteJid) {
            const jid = m.messages[0].key.remoteJid;
            await conn.sendPresenceUpdate('composing', jid);
            await conn.handler(m);
            await conn.readMessages([m.messages[0].key]);
            await conn.sendPresenceUpdate('paused', jid);
        }
    });
    
    conn.ev.on('connection.update', conn.connectionUpdate)
    conn.ev.on('creds.update', conn.credsUpdate)
    isInit = false
    return true
};

// Función para asegurar que el directorio existe
function ensureDirectoryExists(dirPath) {
    if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
        console.log(chalk.bold.cyan(`Carpeta creada: ${dirPath}`));
    }
}

// Arranque nativo para subbots
global.rutaJadiBot = join(__dirname, './JadiBots')
if (global.yukiJadibts) {
    ensureDirectoryExists(global.rutaJadiBot);
    
    const readRutaJadiBot = readdirSync(global.rutaJadiBot)
    if (readRutaJadiBot.length > 0) {
        const creds = 'creds.json'
        for (const gjbts of readRutaJadiBot) {
            const botPath = join(global.rutaJadiBot, gjbts)
            if (existsSync(botPath) && statSync(botPath).isDirectory()) {
                const readBotPath = readdirSync(botPath)
                if (readBotPath.includes(creds)) {
                    // yukiJadiBot({pathYukiJadiBot: botPath, m: null, conn, args: '', usedPrefix: '/', command: 'serbot'})
                }
            }
        }
    }
}

// Configuración de plugins
const pluginFolder = global.__dirname(join(__dirname, './plugins'))
const pluginFilter = (filename) => /\.js$/.test(filename)
global.plugins = {}

// Asegurar que la carpeta plugins existe
ensureDirectoryExists(pluginFolder);

async function filesInit() {
    if (!existsSync(pluginFolder)) {
        console.log(chalk.bold.yellow(`Carpeta plugins no encontrada, creando: ${pluginFolder}`));
        mkdirSync(pluginFolder, { recursive: true });
        return;
    }

    const files = readdirSync(pluginFolder).filter(pluginFilter);
    
    if (files.length === 0) {
        console.log(chalk.bold.yellow('No se encontraron plugins para cargar'));
        return;
    }

    for (const filename of files) {
        try {
            const file = global.__filename(join(pluginFolder, filename))
            const module = await import(file)
            global.plugins[filename] = module.default || module
        } catch (e) {
            console.error(`Error cargando plugin ${filename}:`, e)
            delete global.plugins[filename]
        }
    }
}

filesInit().then((_) => {
    console.log(chalk.bold.green(`Plugins cargados: ${Object.keys(global.plugins).length}`));
}).catch(console.error);

global.reload = async (_ev, filename) => {
    if (pluginFilter(filename)) {
        const dir = global.__filename(join(pluginFolder, filename), true);
        if (filename in global.plugins) {
            if (existsSync(dir)) console.log(chalk.bold.cyan(`Plugin actualizado: ${filename}`))
            else {
                console.log(chalk.bold.yellow(`Plugin eliminado: ${filename}`))
                return delete global.plugins[filename]
            }
        } else console.log(chalk.bold.green(`Nuevo plugin: ${filename}`));
        
        const err = syntaxerror(readFileSync(dir), filename, {
            sourceType: 'module',
            allowAwaitOutsideFunction: true,
        });
        
        if (err) console.error(`Error de sintaxis en '${filename}'\n${format(err)}`)
        else {
            try {
                const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`));
                global.plugins[filename] = module.default || module;
            } catch (e) {
                console.error(`Error cargando plugin '${filename}'\n${format(e)}`)
            } finally {
                global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
            }
        }
    }
}

Object.freeze(global.reload)

// Solo hacer watch si la carpeta existe
if (existsSync(pluginFolder)) {
    watch(pluginFolder, global.reload)
} else {
    console.log(chalk.bold.yellow('Carpeta plugins no existe, el watch no se iniciará hasta que se cree'))
}

await global.reloadHandler()

async function _quickTest() {
    const test = await Promise.all([
        spawn('ffmpeg'),
        spawn('ffprobe'),
        spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
        spawn('convert'),
        spawn('magick'),
        spawn('gm'),
        spawn('find', ['--version']),
    ].map((p) => {
        return Promise.race([
            new Promise((resolve) => {
                p.on('close', (code) => {
                    resolve(code !== 127);
                });
            }),
            new Promise((resolve) => {
                p.on('error', (_) => resolve(false));
            })
        ]);
    }));
    
    const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;
    const s = global.support = {ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find};
    Object.freeze(global.support);
}

function clearTmp() {
    const tmpDir = join(__dirname, 'tmp')
    if (existsSync(tmpDir)) {
        const filenames = readdirSync(tmpDir)
        filenames.forEach(file => {
            const filePath = join(tmpDir, file)
            try {
                unlinkSync(filePath)
            } catch (e) {
                console.error(`Error eliminando archivo temporal ${file}:`, e)
            }
        })
    }
}

function purgeSession() {
    let prekey = []
    const sessionDir = `./${global.sessions}`
    if (existsSync(sessionDir)) {
        let directorio = readdirSync(sessionDir)
        let filesFolderPreKeys = directorio.filter(file => {
            return file.startsWith('pre-key-')
        })
        prekey = [...prekey, ...filesFolderPreKeys]
        filesFolderPreKeys.forEach(files => {
            try {
                unlinkSync(`${sessionDir}/${files}`)
            } catch (e) {
                console.error(`Error eliminando archivo de sesión ${files}:`, e)
            }
        })
    }
}

function purgeSessionSB() {
    try {
        const jadiDir = `./${global.jadi}/`
        if (!existsSync(jadiDir)) return;
        
        const listaDirectorios = readdirSync(jadiDir);
        let SBprekey = [];
        
        listaDirectorios.forEach(directorio => {
            const dirPath = `${jadiDir}${directorio}`
            if (existsSync(dirPath) && statSync(dirPath).isDirectory()) {
                const DSBPreKeys = readdirSync(dirPath).filter(fileInDir => {
                    return fileInDir.startsWith('pre-key-')
                })
                SBprekey = [...SBprekey, ...DSBPreKeys];
                DSBPreKeys.forEach(fileInDir => {
                    if (fileInDir !== 'creds.json') {
                        try {
                            unlinkSync(`${dirPath}/${fileInDir}`)
                        } catch (e) {
                            console.error(`Error eliminando archivo SB ${fileInDir}:`, e)
                        }
                    }
                })
            }
        })
        
        if (SBprekey.length === 0) {
            console.log(chalk.bold.green(`\n╭» ❍ ${global.jadi} ❍\n│→ NADA POR ELIMINAR \n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ⌫ ♻︎`))
        } else {
            console.log(chalk.bold.cyanBright(`\n╭» ❍ ${global.jadi} ❍\n│→ ARCHIVOS NO ESENCIALES ELIMINADOS\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ⌫ ♻︎︎`))
        }
    } catch (err) {
        console.log(chalk.bold.red(`\n╭» ❍ ${global.jadi} ❍\n│→ OCURRIÓ UN ERROR\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ⌫ ♻\n` + err))
    }
}

function purgeOldFiles() {
    const directories = [`./${global.sessions}/`, `./${global.jadi}/`]
    directories.forEach(dir => {
        if (existsSync(dir)) {
            try {
                const files = readdirSync(dir)
                files.forEach(file => {
                    if (file !== 'creds.json') {
                        const filePath = path.join(dir, file);
                        try {
                            unlinkSync(filePath)
                            console.log(chalk.bold.green(`\n╭» ❍ ARCHIVO ❍\n│→ ${file} BORRADO CON ÉXITO\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ⌫ ♻`))
                        } catch (err) {
                            console.log(chalk.bold.red(`\n╭» ❍ ARCHIVO ❍\n│→ ${file} NO SE LOGRÓ BORRAR\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ⌫ ✘\n` + err))
                        }
                    }
                })
            } catch (err) {
                console.error(`Error leyendo directorio ${dir}:`, err)
            }
        }
    })
}

function redefineConsoleMethod(methodName, filterStrings) {
    const originalConsoleMethod = console[methodName]
    console[methodName] = function() {
        const message = arguments[0]
        if (typeof message === 'string' && filterStrings.some(filterString => message.includes(atob(filterString)))) {
            arguments[0] = ""
        }
        originalConsoleMethod.apply(console, arguments)
    }
}

// Intervalos de limpieza
setInterval(async () => {
    if (global.stopped === 'close' || !conn || !conn.user) return
    await clearTmp()
    console.log(chalk.bold.cyanBright(`\n╭» ❍ MULTIMEDIA ❍\n│→ ARCHIVOS DE LA CARPETA TMP ELIMINADAS\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ⌫ ♻`))
}, 1000 * 60 * 4) // 4 min

setInterval(async () => {
    if (global.stopped === 'close' || !conn || !conn.user) return
    await purgeSession()
    console.log(chalk.bold.cyanBright(`\n╭» ❍ ${global.sessions} ❍\n│→ SESIONES NO ESENCIALES ELIMINADAS\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ⌫ ♻`))
}, 1000 * 60 * 10) // 10 min

setInterval(async () => {
    if (global.stopped === 'close' || !conn || !conn.user) return
    await purgeSessionSB()
}, 1000 * 60 * 10)

setInterval(async () => {
    if (global.stopped === 'close' || !conn || !conn.user) return
    await purgeOldFiles()
    console.log(chalk.bold.cyanBright(`\n╭» ❍ ARCHIVOS ❍\n│→ ARCHIVOS RESIDUALES ELIMINADAS\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ⌫ ♻`))
}, 1000 * 60 * 10)

_quickTest().then(() => console.log(chalk.bold(`✦  H E C H O\n`.trim()))).catch(console.error)

async function isValidPhoneNumber(number) {
    try {
        number = number.replace(/\s+/g, '')
        if (number.startsWith('+521')) {
            number = number.replace('+521', '+52');
        } else if (number.startsWith('+52') && number[4] === '1') {
            number = number.replace('+52 1', '+52');
        }
        const parsedNumber = phoneUtil.parseAndKeepRawInput(number)
        return phoneUtil.isValidNumber(parsedNumber)
    } catch (error) {
        return false
    }
    }
