### CHATBOT Whatsapp basado en Baileys

**Con esta librería, puedes construir flujos automatizados de conversación de manera agnóstica al proveedor de WhatsApp,** configurar respuestas automatizadas para preguntas frecuentes, recibir y responder mensajes de manera automatizada, y hacer un seguimiento de las interacciones con los clientes.  Además, puedes configurar fácilmente disparadores que te ayudaran a expandir las funcionalidades sin límites.


```
npm install
npm start
```

---

# Uso de Api

```sh
curl -X POST http://localhost:4000/send-message      -H "Content-Type: application/json"      -d '{"number": "51xxxxxxxxxx", "message": "Hola desde el API WSP"}'
```

modulo de database a completar>
https://www.npmjs.com/package/@bot-whatsapp/database?activeTab=code

Curl de pruebas api envio de mensaje a wsp, los numero puede contener codigo pais o no, 
es indistinto, dentro del api se indentifica

```sh
curl -X POST http://localhost:4000/send-message \
-H "Content-Type: application/json" \
-d '{
    "number": "1234567890",
    "type": "image",
    "mediaUrl": "https://example.com/path/to/image.jpg"
}'
```

```sh
curl -X POST http://0.0.0.0:4000/send-message \
-H "Content-Type: application/json" \
-d '{"number": "xxxxxxxxx", "message": "Aqui tienes un mensaje con un medio curado."}'
```

```sh
curl -X POST http://0.0.0.0:4000/send-message -H "Content-Type: application/json" -d '{
    "number": "51xxxxxxxxxx", 
    "message": "🎓 Descubre el poder de la inteligencia artificial para tu emprendimiento. Súmate aqui 👉 https://lu.ma/Emprende-con-IA_22feb7pm\n\nAprenderás a optimizar procesos, elevar diseños y potenciar tu estrategia de marketing. ¡No te lo pierdas! 🔥👩‍💻🚀\n\n👩‍💼 Contaremos con la presencia de Jorge Paz, Chapter Area Lead del Banco de Crédito del Peru y cuenta con 4 años trabajando con startups en el sector Fintech y en el Sector EdTech👩‍💻🎯\n\n📅 Fecha y Hora: Jueves 22 de febrero - 7 PM (GMT-5)\n📍 Vía: Zoom y LinkedIn Live"
}'
```


## Desplegar en prod:
en primer plano
```sh
docker-compose up
```
en segundo plano
```sh
docker-compose up -d
````

Acceder a consola de docker
```sh
sudo docker-compose exec node_app /bin/sh
```

Reiniciar contenedor despues de hacer cambios en script de node
```sh
sudo docker-compose restart
```

ver log de docker
```sh
sudo docker-compose logs
```
