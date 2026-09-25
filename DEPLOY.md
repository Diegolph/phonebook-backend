# Publicar los ejercicios 3.10–3.11 con GitHub y Render

La aplicación todavía no está publicada. Los pasos siguientes necesitan tus cuentas.
No compartas contraseñas ni códigos de verificación en el chat.

## 1. Crear las cuentas

1. Crea tu cuenta en https://github.com/signup y verifica tu correo.
2. En https://github.com/new crea un repositorio llamado `phonebook-backend`.
   Puedes usar un repositorio privado y permitir que Render acceda a él.
   Créalo vacío, sin agregar README, licencia ni .gitignore: ya están preparados localmente.
3. Regístrate en https://dashboard.render.com y conecta tu cuenta de GitHub.

## 2. Preparar y subir el backend

Desde `C:\Users\diego\phonebook`, genera el frontend:

```powershell
npm run build:full
cd backend
```

Inicializa Git dentro de backend (no en phonebook) y registra los archivos:

```powershell
git init -b main
git add .
git status
git commit -m "Complete exercises 3.9-3.11 deployment preparation"
```

Antes del commit, comprueba que `dist/index.html` y `dist/assets/` aparecen entre
los archivos y que no se incluyen `node_modules` ni `.env`.
Si Git pide tu identidad, configura tu nombre y correo para este repositorio:

```powershell
git config user.name "Tu nombre"
git config user.email "Tu correo de GitHub"
```

Después repite el commit. Copia la URL HTTPS de tu nuevo repositorio y úsala
en este comando, sustituyendo TU_USUARIO:

```powershell
git remote add origin https://github.com/TU_USUARIO/phonebook-backend.git
git push -u origin main
```

Completa el inicio de sesión de GitHub si Git lo solicita.
En GitHub deben verse `package.json`, `index.js`, `app.js` y `dist` directamente
en la raíz. No subas una carpeta contenedora llamada backend dentro del repositorio.

## 3. Crear el servicio en Render

Selecciona **New → Web Service**, conecta el repositorio `phonebook-backend`
y usa estos valores:

| Campo | Valor |
| --- | --- |
| Language / Runtime | Node |
| Branch | main |
| Root Directory | Vacío |
| Build Command | npm ci |
| Start Command | npm start |
| Instance Type | Free |

Es un **Web Service** porque ejecuta Express. React se sirve desde ese mismo
servidor gracias al directorio dist. No hace falta crear un Static Site.
El frontend ya está compilado, así que Render solo instala las dependencias del backend.
El servidor utiliza automáticamente el puerto que Render le proporciona.

Crea el servicio y revisa sus logs hasta que el despliegue termine. Render te
mostrará la URL real con dominio onrender.com.

## 4. Verificar la URL pública

En esa URL comprueba:

1. `/api/persons`: JSON con los cuatro contactos iniciales.
2. `/info`: cantidad de contactos y fecha/hora.
3. `/`: interfaz React de la agenda.
4. Agrega un contacto de prueba y recarga la página: debe permanecer.
5. Elimínalo, confirma y recarga: debe desaparecer.
6. En Network, comprueba que las peticiones van al dominio público y a `/api/persons`,
   no a localhost. Revisa también los logs del servicio en Render.

Cuando funcione, reemplaza la línea "URL pública: pendiente" del README del backend
por el enlace real. Actualiza también el README de phonebook y sube el cambio a GitHub.
Solo entonces los ejercicios 3.10–3.11 están completos.

## Actualizar la aplicación más adelante

Después de modificar React, vuelve a ejecutar `npm run build:full` desde phonebook.
Luego registra y sube los cambios de backend, incluidos los nuevos archivos de dist.
Render puede desplegar automáticamente los cambios de la rama conectada.

El plan Free se suspende después de 15 minutos sin tráfico y puede tardar alrededor
de un minuto en reactivarse. Los datos actuales viven en memoria y se restablecen
cuando el proceso reinicia; la persistencia con MongoDB se implementa después.

## Documentación oficial

- Curso: https://fullstackopen.com/es/part3/despliegue_de_la_aplicacion_a_internet/
- Crear repositorio: https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository
- Express en Render: https://render.com/docs/deploy-node-express-app
- Plan Free: https://render.com/docs/free
