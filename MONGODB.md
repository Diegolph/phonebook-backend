# Ejercicio 3.12 — MongoDB Atlas y programa de terminal

Estado: código preparado; falta configurar tu clúster y comprobar una escritura
y una lectura reales. La web de Render sigue usando datos en memoria hasta los
ejercicios siguientes. Este programa no modifica la configuración del servidor web.

## 1. Crear cuenta y clúster

1. Entra a https://www.mongodb.com/cloud/atlas/register y crea una cuenta.
2. Crea un proyecto, por ejemplo `FullStackOpen`, si Atlas te lo solicita.
3. En la vista del proyecto selecciona Create para crear un clúster.
4. Selecciona **Free / M0**, un proveedor y una región disponibles; nómbralo `Cluster0`.
5. Crea el clúster. No necesitas cargar datos de ejemplo.

## 2. Crear un usuario de base de datos

En el asistente de seguridad o en Database Access / Database Users:

- Crea un usuario con autenticación por contraseña, por ejemplo `phonebook_user`.
- Guarda su contraseña para usarla localmente. Es un usuario diferente de tu cuenta Atlas.
- Dale el rol `readWrite` sobre la base de datos `phonebook`, desde los permisos específicos.

## 3. Permitir el acceso desde tu computadora

En Network Access / IP Access List, selecciona Add IP Address y después
Add Current IP Address. Guarda la entrada. Si cambia tu IP, actualízala allí.
Para este ejercicio basta permitir tu computadora; Render se configura después.

## 4. Configurar el proyecto

En el clúster, abre Connect → Drivers y elige Node.js. Verás una dirección similar a:

```text
mongodb+srv://phonebook_user:<db_password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

Necesitamos el nombre del usuario y el hostname entre `@` y `/`.
En PowerShell, dentro de `C:\Users\diego\phonebook\backend`, ejecuta una sola vez:

```powershell
Copy-Item .env.example .env
```

Edita `.env` con tus valores reales:

```dotenv
MONGODB_USER=phonebook_user
MONGODB_HOST=cluster0.abc123.mongodb.net
```

El hostname anterior es un ejemplo, debes sustituirlo. No pongas el prefijo
`mongodb+srv://`, usuario, contraseña ni parámetros dentro de MONGODB_HOST.
El programa selecciona automáticamente la base de datos `phonebook`.
`.env` ya está excluido de Git; `.env.example` solo contiene ejemplos publicables.

## 5. Guardar y listar

Desde backend, sustituye TU_CONTRASENA por la contraseña del usuario de base de datos.
Las comillas simples de PowerShell evitan interpretar caracteres como `$`.

```powershell
node mongo.js 'TU_CONTRASENA' 'Anna' '040-1234556'
node mongo.js 'TU_CONTRASENA' 'Arto Vihavainen' '045-1232456'
node mongo.js 'TU_CONTRASENA'
```

Los dos primeros comandos deben mostrar `added ... to phonebook`.
El último debe mostrar:

```text
phonebook:
Anna 040-1234556
Arto Vihavainen 045-1232456
```

El programa cierra la conexión antes de terminar. Ejecutar de nuevo el comando
de listado debe mostrar los mismos contactos: permanecen en MongoDB entre ejecuciones.
En Atlas, Browse Collections / Data Explorer mostrará la base `phonebook` y la
colección `people`, creada por Mongoose a partir del modelo Person.

La contraseña se pasa por terminal como pide el ejercicio; no la incluyas al
compartir capturas o comandos. Si contiene una comilla simple, PowerShell la
representa duplicándola dentro de una cadena entre comillas simples.

## 6. Verificación y entrega

- Lista antes y después de guardar para confirmar el nuevo contacto.
- Prueba un nombre con espacios entre comillas.
- Comprueba en Atlas que los documentos existen.
- Cada comando debe terminar y devolver el prompt de PowerShell.
- `npm test` verifica además la API existente y los errores de uso del programa;
  esas pruebas no sustituyen la conexión real a Atlas.
- No marques el 3.12 completo hasta verificar el guardado y listado reales.

Para subir el código después de comprobarlo:

```powershell
git add mongo.js .env.example MONGODB.md README.md package.json package-lock.json tests/mongo-cli.test.js
git commit -m "Add exercise 3.12 MongoDB command-line phonebook"
git push
```

## Fuentes

- Enunciado: https://fullstackopen.com/es/part3/guardando_datos_en_mongo_db/#ejercicio-3-12
- Clúster gratuito: https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/
- Usuarios: https://www.mongodb.com/docs/atlas/security-add-mongodb-users/
- Acceso de red: https://www.mongodb.com/docs/atlas/security/ip-access-list/
