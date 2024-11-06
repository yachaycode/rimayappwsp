# Configuración de NGINX para el proyecto Chatbot

Este directorio contiene los archivos necesarios para configurar y ejecutar NGINX como un proxy inverso para el proyecto de chatbot.

## Archivos incluidos

- **Dockerfile.nginx**: Dockerfile para construir la imagen de NGINX con la configuración personalizada.
- **nginx.conf**: Archivo de configuración de NGINX que define cómo se redirigen las solicitudes al contenedor de Node.js.

## Instrucciones de uso

### 1. Construir y ejecutar los contenedores

Desde el directorio raíz del proyecto, ejecuta el siguiente comando:

```bash
docker-compose up --build

se levanta en:
```sh
localhost:4000
```

