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
const { askChatGpt } = require('./ai/chatgpt');
// const { init } = require("bot-ws-plugin-openai");

// Modificar el flujo principal para manejar consultas
const userContexts = new Map();
const processMessage = async (ctx, { flowDynamic, endFlow, gotoFlow }) => {
  try {
      const userId = ctx.from;
      const question = ctx.body.trim().toLowerCase();
      
      // Manejar comandos especiales
      if (question === 'salir') {
          userContexts.delete(userId);
          await flowDynamic('👋 ¡Hasta luego! Espero haber sido de ayuda.');
          return endFlow();
      }
      
      if (question === 'nuevo') {
          userContexts.delete(userId);
          await flowDynamic('🆕 Empecemos un nuevo tema. ¡Adelante!');
          return;
      }

      // Gestionar contexto
      if (!userContexts.has(userId)) {
          userContexts.set(userId, {
              messages: []
          });
      }
      const userContext = userContexts.get(userId);

      // Solo mantener los últimos 4 mensajes para optimizar tokens
      if (userContext.messages.length >= 8) {
          userContext.messages = userContext.messages.slice(-4);
      }

      // Agregar la pregunta actual
      userContext.messages.push({
          role: 'user',
          content: ctx.body
      });

      // Preparar el contexto para ChatGPT
      const contextMessages = [
          {
              role: 'system',
              content: 'Eres un asistente amigable y conciso. Mantén las respuestas breves pero informativas.'
          },
          ...userContext.messages
      ];

      const gptMessage = await askChatGpt(contextMessages);
      
      // Guardar la respuesta en el contexto
      userContext.messages.push({
          role: 'assistant',
          content: gptMessage
      });

      await flowDynamic(gptMessage);
      
  } catch (error) {
      console.error('Error al consultar a ChatGPT:', error);
      await flowDynamic('Lo siento, hubo un error al procesar tu consulta.');
  }
};

const welcomeFlow = addKeyword([''])
    .addAnswer(
        [
            '¡Estoy aquí para ayudarte con lo que necesites!, consultame..'
        ],
        { capture: true },
        async (ctx, props) => {
            await processMessage(ctx, props);
        }
    );


const continuationFlow = addKeyword([''])
  .addAction(
      { capture: true },
      async (ctx, props) => {
          await processMessage(ctx, props);
      }
  );


const app = express();
app.use(express.json());


const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([welcomeFlow, continuationFlow]);
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

  app.post('/send-message-bot-gpt', async (req, res) => {
    try {
        const { number, message } = req.body;
        if (!number || !message) {
            return res.status(400).json({ success: false, error: "number y message son requeridos" });
        }

        const standardizedNumber = cellphoneStandard(number);
        const whatsappId = `${standardizedNumber}@c.us`;
        console.log("Consulta de:", whatsappId, 'pregunta:', message);
        
        // Consultar a ChatGPT
        const gptMessage = await askChatGpt(message); // Usar la función askChatGpt
        await adapterProvider.sendText(whatsappId, gptMessage); // Enviar la respuesta al usuario
        res.status(200).json({ success: true, message: 'Respuesta enviada', response: gptMessage });
    } catch (error) {
        console.error('Error al consultar a ChatGPT:', error);
        res.status(500).json({ success: false, error: error.message });
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
    console.log("Enviando a:", whatsappId, 'mensaje:', message)
    try {
        await adapterProvider.sendText(whatsappId, message, mediaUrl);
        res.status(200).json({ success: true, message: 'Mensaje enviado' });
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).json({ success: false, error: error.message });
    }
  });

  // endpoint para consultas a ChatGPT
  app.post('/ask-chatgpt', async (req, res) => {
    const { number, question } = req.body;
    if (!number || !question) {
        return res.status(400).json({ success: false, error: "number y question son requeridos" });
    }
    const standardizedNumber = cellphoneStandard(number);
    const whatsappId = `${standardizedNumber}@c.us`;
    console.log("Consulta de:", whatsappId, 'pregunta:', question);
    
    try {
        const gptMessage = await askChatGpt(question); // Usar la función askChatGpt
        await adapterProvider.sendText(whatsappId, gptMessage); // Enviar la respuesta al usuario
        res.status(200).json({ success: true, message: 'Respuesta enviada', response: gptMessage });
    } catch (error) {
        console.error('Error al consultar a ChatGPT:', error);
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
