# Phonebook backend — Full Stack Open

Ejercicios 3.1–3.11 implementados y publicados en Render.

URL pública: [Agenda telefónica](https://phonebook-backend-besv.onrender.com).

Ejercicio 3.12: `mongo.js` preparado para guardar y listar contactos con Mongoose.
Pendiente de configurar Atlas y verificar escritura/lectura reales.
Sigue [MONGODB.md](MONGODB.md) para crear el clúster y ejecutar el programa.

Verificación HTTP del despliegue: la raíz, `/api/persons` y `/info` responden 200.

## Inicio

Desde esta carpeta ejecuta `npm install` y `npm start`.
Para desarrollo con reinicio automático usa `npm run dev` (Node 22 o posterior).
El servidor usa `PORT` o 3001. Detén json-server si ocupa ese puerto.

## Ejercicios

| Ejercicio | Funcionalidad |
| --- | --- |
| 3.1 | GET /api/persons y scripts start/dev. |
| 3.2 | GET /info muestra cantidad actual y fecha/hora. |
| 3.3 | GET /api/persons/:id responde 200 o 404. |
| 3.4 | DELETE /api/persons/:id responde 204. |
| 3.5 | POST /api/persons crea con id aleatorio y responde 201. |
| 3.6 | Datos incompletos o nombres duplicados devuelven 400 y error JSON. |
| 3.7–3.8 | Morgan registra las solicitudes y el cuerpo de los POST. |
| 3.9 | Conexión con React mediante /api/persons; CORS habilitado. |
| 3.10–3.11 | Backend publicado en Render; Express sirve el build React de dist/. |

La actualización con PUT corresponde al 3.17 y todavía no está implementada.
Los contactos viven en memoria y se restablecen al reiniciar el servidor.

## Frontend compilado

En la estructura local `phonebook/backend`, ejecuta `npm run build:ui` para generar
`backend/dist` a partir del frontend de la carpeta superior. En un repositorio
independiente del backend se sube ese `dist` ya generado: no ejecutes build:ui allí.
Express sirve estos archivos usando una ruta absoluta, sin depender de la carpeta
actual de la terminal. No ignores `dist` al subir el backend a GitHub.

## Pruebas

Ejecuta `npm test`. La prueba de hosting necesita el directorio `dist` generado.
Puedes usar `requests/persons.rest` con REST Client de VS Code o Postman.
Prueba también abrir la raíz del servidor, agregar un contacto, recargar, filtrar
y eliminarlo; al recargar otra vez debe seguir eliminado hasta reiniciar el backend.

## Despliegue

Consulta [DEPLOY.md](DEPLOY.md) para crear tus cuentas y desplegar en Render.
La carpeta backend es un proyecto independiente, preparado para ser la raíz de su
propio repositorio. El archivo package-lock.json fija las dependencias instaladas.
