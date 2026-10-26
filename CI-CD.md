# Full Stack Open — ejercicios 11.20 y 11.21

Aplicación propia usada para practicar CI/CD:
[phonebook-backend](https://github.com/Diegolph/phonebook-backend).
Repositorio principal de entrega:
[Pokédex, ejercicios 11.1–11.19](https://github.com/Diegolph/full-stack-open-pokedex).

## Verificaciones

```sh
npm ci
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Se verificaron localmente ESLint, el build, 15 pruebas Node y una prueba de
navegador que agrega un contacto, recarga, filtra y elimina usando la API real.
La prueba de salud comprueba HTTP 503, contenido incorrecto y un commit antiguo.

El repositorio original incluye el frontend compilado en `dist`, sin las fuentes
React. `npm run build` valida los assets y ensambla la aplicación en `release/`;
no recompila un frontend cuyas fuentes no están disponibles. Las pruebas de
hosting comprueban que Express sirve el HTML y sus archivos correctamente.
El script histórico `build:ui` sigue requiriendo las fuentes externas.

## Render

Usar el servicio existente de la agenda o uno separado para el curso.
Si se usa el existente, desactivar Auto-Deploy antes de fusionar este PR para
que GitHub Actions controle los despliegues. El almacenamiento sigue siendo
en memoria: un reinicio restablece los contactos iniciales.

| Campo | Valor |
| --- | --- |
| Rama | `main` |
| Root Directory | vacío |
| Build Command | `npm ci --include=dev && npm run build` |
| Start Command | `npm start` |
| NODE_VERSION | `24.19.0` |
| Health Check Path | `/health` |
| Auto-Deploy | Off |

En Settings → Secrets and variables → Actions del repositorio de la agenda:

- Secret `RENDER_DEPLOY_HOOK_URL`: hook de **este servicio**, no el de Pokédex.
- Variable `APP_URL`: URL pública de **esta agenda**.
- Variable `DEPLOY_ENABLED`: `true` cuando el servicio esté preparado.
- Secret opcional `DISCORD_WEBHOOK_URL` y variable `NOTIFICATIONS_ENABLED=true`.

Los PR pasan verificaciones sin desplegar ni crear tags. Al fusionar a main,
el pipeline despliega el SHA probado, comprueba salud y versión, crea un tag
patch y puede notificar a Discord. `#skip` omite deploy/tag. Usar merge commit;
si se usa squash, conservar `#skip` en el mensaje final de squash.

El workflow diario de salud está en un archivo separado y también admite
ejecución manual. La configuración y el código están preparados; los despliegues,
notificaciones y ejecuciones remotas deben verificarse una vez conectadas las cuentas.

## Revisión del profesor (11.21)

1. Abrir el PR de `feat/part11-cicd` hacia `main`.
2. En Settings → Branches, proteger `main`: exigir PR, una aprobación,
   **Quality checks** exitoso y rama actualizada.
3. Activar **Do not allow bypassing the above settings**, también para admins.
4. En Settings → Collaborators, invitar a `mattiluukkainen`.
5. Solicitar su revisión del PR y avisar en Discord con el enlace de invitación
   de colaborador, como indica el curso.
6. Esperar aprobación; después fusionar y verificar el pipeline y el despliegue.

No se ha enviado ninguna invitación ni mensaje al profesor automáticamente.
La revisión externa y la protección de main quedan pendientes de configuración.
