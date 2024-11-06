### CHATBOT Whatsapp basado en Baileys

**Con esta librería, puedes construir flujos automatizados de conversación de manera agnóstica al proveedor de WhatsApp,** configurar respuestas automatizadas para preguntas frecuentes, recibir y responder mensajes de manera automatizada, y hacer un seguimiento de las interacciones con los clientes.  Además, puedes configurar fácilmente disparadores que te ayudaran a expandir las funcionalidades sin límites. **[Ver documentación](https://bot-whatsapp.netlify.app/)**


```
npm install
npm start
```

---
## Recursos
- [📄 Documentación](https://bot-whatsapp.netlify.app/)
- [🚀 Roadmap](https://github.com/orgs/codigoencasa/projects/1)
- [💻 Discord](https://link.codigoencasa.com/DISCORD)
- [👌 Twitter](https://twitter.com/leifermendez)
- [🎥 Youtube](https://www.youtube.com/watch?v=5lEMCeWEJ8o&list=PL_WGMLcL4jzWPhdhcUyhbFU6bC0oJd2BR)


# Uso de Api

```sh
curl -X POST http://localhost:4000/send-message      -H "Content-Type: application/json"      -d '{"number": "51xxxxxxxxxx", "message": "Hola desde el API WSP"}'
```

modulo de database a completar>
https://www.npmjs.com/package/@bot-whatsapp/database?activeTab=code



curl -X POST http://localhost:4000/send-message \
-H "Content-Type: application/json" \
-d '{
    "number": "1234567890",
    "type": "image",
    "mediaUrl": "https://example.com/path/to/image.jpg"
}'



curl -X POST http://localhost:4000/send-message \
-H "Content-Type: application/json" \
-d '{
    "number": "51xxxxxxxxxx", 
    "message": "Aquí tienes un mensaje con un medio.",
    "mediaUrl": "https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/6ceb/live/a2131a40-9c12-11ef-ab9f-4fae3655f4bc.jpg.webp"
}'



curl -X POST http://localhost:4000/send-message -H "Content-Type: application/json" -d '{
    "number": "51xxxxxxxxxx", 
    "message": "🎓 Descubre el poder de la inteligencia artificial para tu emprendimiento. Súmate aqui 👉 https://lu.ma/Emprende-con-IA_22feb7pm\n\nAprenderás a optimizar procesos, elevar diseños y potenciar tu estrategia de marketing. ¡No te lo pierdas! 🔥👩‍💻🚀\n\n👩‍💼 Contaremos con la presencia de Jorge Paz, Chapter Area Lead del Banco de Crédito del Peru y cuenta con 4 años trabajando con startups en el sector Fintech y en el Sector EdTech👩‍💻🎯\n\n📅 Fecha y Hora: Jueves 22 de febrero - 7 PM (GMT-5)\n📍 Vía: Zoom y LinkedIn Live"
}'


## Desplegar en prod:
en primer plano
```sh
docker-compose up
```
en segundo plano >
```sh
docker-compose up -d
````

