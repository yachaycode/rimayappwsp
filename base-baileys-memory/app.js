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
const MockAdapter = require("@bot-whatsapp/database/mock");

const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

const flowDocs = addKeyword(['doc', 'documentacion', 'documentación']).addAnswer(
  [
      '📄 Aquí encontras las documentación recuerda que puedes mejorarla',
      'https://bot-whatsapp.netlify.app/',
      '\n*2* Para siguiente paso.',
  ],
  null,
  null,
  [flowSecundario]
)

const flowTuto = addKeyword(['tutorial', 'tuto']).addAnswer(
  [
      '🙌 Aquí encontras un ejemplo rapido',
      'https://bot-whatsapp.netlify.app/docs/example/',
      '\n*2* Para siguiente paso.',
  ],
  null,
  null,
  [flowSecundario]
)

const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
  [
      '🚀 Puedes aportar tu granito de arena a este proyecto',
      '[*opencollective*] https://opencollective.com/bot-whatsapp',
      '[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez',
      '[*patreon*] https://www.patreon.com/leifermendez',
      '\n*2* Para siguiente paso.',
  ],
  null,
  null,
  [flowSecundario]
)

const flowDiscord = addKeyword(['discord']).addAnswer(
  ['🤪 Únete al discord', 'https://link.codigoencasa.com/DISCORD', '\n*2* Para siguiente paso.'],
  null,
  null,
  [flowSecundario]
)

const flowPrincipal = addKeyword(['hola', 'ole', 'alo', 'hello', 'hi'])
    .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
    .addAnswer(
        [
            'te comparto los siguientes links de interes sobre el proyecto',
            '👉 *doc* para ver la documentación',
            '👉 *gracias*  para ver la lista de videos',
            '👉 *discord* unirte al discord',
        ],
        null,
        null,
        [flowDocs, flowGracias, flowTuto, flowDiscord]
    );

const app = express();
app.use(express.json()); // Middleware para analizar JSON en las solicitudes

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([flowPrincipal]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  /**
   * Enviar mensaje con métodos propios del proveedor del bot
   */
  app.post("/send-message-bot", async (req, res) => {
    try {
      const { number, message } = req.body;
      if (!number || !message) {
        return res.status(400).send({ error: "number y message son requeridos" });
      }

      // Verifica el formato del número
      console.log("Número de teléfono recibido:", number);
      const whatsappId = `${number}@c.us`;
      await adapterProvider.sendText(whatsappId, message);
      res.send({ data: "enviado!" });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      res.status(500).send({ error: "Error interno del servidor" });
    }
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
    try {
        await adapterProvider.sendText(whatsappId, message, mediaUrl);
        res.status(200).json({ success: true, message: 'Mensaje enviado' });
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).json({ success: false, error: error.message });
    }
  });

  /**
   * Enviar mensajes con métodos nativos del proveedor
   */
  app.post("/send-message-provider", async (req, res) => {
    try {
      const { number, text } = req.body;
      if (!number || !text) {
        return res.status(400).send({ error: "number y text son requeridos" });
      }

      // Verifica el formato del número
      console.log("Número de teléfono recibido:", number);

      const templateButtons = [
        {
          index: 1,
          urlButton: {
            displayText: ":star: Star Baileys on GitHub!",
            url: "https://github.com/adiwajshing/Baileys",
          },
        },
        {
          index: 2,
          callButton: {
            displayText: "Call me!",
            phoneNumber: "+1 (234) 5678-901",
          },
        },
        {
          index: 3,
          quickReplyButton: {
            displayText: "This is a reply, just like normal buttons!",
            id: "id-like-buttons-message",
          },
        },
      ];

      const templateMessage = {
        text: text,
        footer: "Hello World",
        templateButtons: templateButtons,
      };

      const abc = await adapterProvider.getInstance();
      await abc.sendMessage(number, templateMessage);

      res.send({ data: "enviado!" });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      res.status(500).send({ error: "Error interno del servidor" });
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
