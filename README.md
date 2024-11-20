### CHATBOT con IA via Whatsapp

**Con esta librería, puedes construir flujos automatizados de conversación de manera agnóstica al proveedor de WhatsApp,** configurar respuestas automatizadas para preguntas frecuentes, recibir y responder mensajes de manera automatizada, y hacer un seguimiento de las interacciones con los clientes.  Además, puedes configurar fácilmente disparadores que te ayudaran a expandir las funcionalidades sin límites.

Realizar pruebas sin contenedor
```
npm install
npm start
```

---

### Configuración de Variables de Entorno

Antes de ejecutar la aplicación, asegúrate de configurar las variables de entorno necesarias. Puedes hacerlo creando un archivo `.env` en la raíz del proyecto con el siguiente contenido:
- credenciales de la base de datos postgres para alamcenar usuarios y historial de conversaciones
- credencial de la api de openai:`OPENAI_API_KEY` para la inteligencia artificial
- credencial `ASSISTANT_ID`, donde se almacena el id del asistente de openai

```sh
OPENAI_API_KEY=xx
ASSISTANT_ID=xx
POSTGRES_DB_HOST=xx
POSTGRES_DB_USER=xx
POSTGRES_DB_PASSWORD=xx
POSTGRES_DB_NAME=xx
POSTGRES_DB_PORT=5432
```

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

Acceder a consola de docker
```sh
sudo docker-compose exec node_app /bin/sh
```

Reiniciar contenedor despues de hacer cambios en script de node
```sh
sudo docker-compose restart
```

ver log en tiempo real
```sh
sudo docker-compose -f docker-compose.yml logs -f
```

actualizar cambio total, requiere escanero de QR:
```sh
sudo docker-compose down -v
sudo docker-compose up -d --build
```
```sh
sudo docker-compose logs
```

Deplegar solo un app especifico ejem: 
```sh
   sudo docker-compose up -d node_app_rimay
```
log de una app
```sh
   sudo docker-compose logs -f node_app_rimay
```

acceder al contenedor:
```sh
sudo docker exec -it node_app_rimay /bin/sh
```

## Detener y eliminar el contenedor de node_app_rimay

```sh
sudo docker-compose stop node_app_rimay
sudo docker-compose rm -f node_app_rimay
sudo docker-compose up -d --build node_app_rimay
sudo docker-compose logs -f node_app_rimay
```
