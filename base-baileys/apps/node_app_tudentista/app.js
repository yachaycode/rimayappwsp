const express = require("express");
const { join } = require("path");
const { createReadStream } = require("fs");
const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require("@bot-whatsapp/bot");


const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const PostgreSQLAdapter = require('@bot-whatsapp/database/postgres')

// Configuración de la base de datos PostgreSQL desde variables de entorno
const POSTGRES_DB_HOST = process.env.POSTGRES_DB_HOST
const POSTGRES_DB_USER = process.env.POSTGRES_DB_USER
const POSTGRES_DB_PASSWORD = process.env.POSTGRES_DB_PASSWORD
const POSTGRES_DB_NAME = process.env.POSTGRES_DB_NAME
const POSTGRES_DB_PORT = process.env.POSTGRES_DB_PORT


const app = express();
app.use(express.json());

const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('🙌 Hola bienvenido a este *canal*', { 
      catch: (ctx) => ctx.from !== 'bot_id'
    });

const main = async () => {
  const adapterDB = new PostgreSQLAdapter({
      host: POSTGRES_DB_HOST,
      user: POSTGRES_DB_USER,
      database: POSTGRES_DB_NAME,
      password: POSTGRES_DB_PASSWORD,
      port: POSTGRES_DB_PORT,
  })
  const adapterFlow = createFlow([flowPrincipal]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  
const checkCountryCodePhone = () => {
  const dictCountryCode = {
      51: 'PE', 52: 'MX', 55: 'BR',
      56: 'CL', 57: 'CO', 34: 'ES', 591: 'BO',
      502: 'GT', 503: 'SV', 1: 'DO', 595: 'PY', 593: 'EC',
      549: 'AR'
  };
  return Object.keys(dictCountryCode).map(Number);
};

const cellphoneStandard = (cellPhone) => {
  cellPhone = cellPhone.replace('+', '').replace(' ', '').replace('-', '').trim();
  const possibleCountryCode = cellPhone.substring(0, 2);
  const countryCodes = checkCountryCodePhone();
  
  if (countryCodes.includes(parseInt(possibleCountryCode))) {
      return cellPhone;
  } else {
      // Asumimos que es de Perú
      return '51' + cellPhone;
  }
}
  // Agregar endpoint de envío de mensajes
  app.post('/send-message', async(req, res) => {
    const { number, message, mediaUrl } = req.body;
    if (!number || !message) {
        return res.status(400).json({ success: false, error: "number y message son requeridos" });
    }
    const standardizedNumber = cellphoneStandard(number);
    const whatsappId = `${standardizedNumber}@c.us`;
    console.log("Enviando a:", whatsappId, 'mensaje:', message)
    try {
        await adapterProvider.sendText(whatsappId, message, mediaUrl);
        res.status(200).json({ success: true, message: 'Mensaje enviado' });
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/get-qr", async (_, res) => {
    try {
      const YOUR_PATH_QR = join(process.cwd(), `bot.qr.png`);
      const fileStream = createReadStream(YOUR_PATH_QR);

      res.writeHead(200, { "Content-Type": "image/png" });
      fileStream.pipe(res);
    } catch (error) {
      console.error("Error al obtener el QR:", error);
      res.status(500).send({ error: "Error al obtener el QR" });
    }
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`http://0.0.0.0:${PORT}`));
};

main();
