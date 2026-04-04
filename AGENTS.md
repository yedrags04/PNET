# AGENTS.md

## Propósito

Este documento guía a agentes de IA y colaboradores para trabajar en este
repositorio de forma segura, consistente y sin romper funcionalidades
existentes.

Proyecto: **HeistCraft**, aplicación web con frontend estático y API en Express
para consultar bancos y gestionar reservas en clientes.

## Resumen rápido del proyecto

- Backend en Node.js (CommonJS) con Express.
- API disponible bajo `/api`.
- Frontend estático servido desde `src/public`.
- Persistencia en MongoDB (colección `bancos`).
- Datos de ejemplo cargados con script de seed.
- Formato de código con Prettier.

**Rutas y archivos clave:**

- `src/index.js` (arranque del servidor y montaje de middlewares/rutas)
- `src/db.js` (conexión y acceso a colecciones MongoDB)
- `src/routes/bancos.js` (endpoints de bancos)
- `src/services/bancos-service.js` (lógica de acceso a datos)
- `src/seed.js` (reinicializa e inserta datos de ejemplo)
- `src/public/` (HTML/CSS/JS estático)

## Stack y convenciones técnicas

- Runtime: Node.js
- Módulos: CommonJS (`require/module.exports`)
- Servidor: Express
- DB: MongoDB (driver oficial)
- Logging HTTP: morgan
- Alias de módulos: `#src/...` (configurado con `imports` en `package.json` y
  resuelto por el editor con `jsconfig.json`)
- Iconos: Lucide vía CDN UMD (`https://unpkg.com/lucide@1.7.0/dist/umd/lucide.min.js`)
- Formato: Prettier (`printWidth: 100`, `tabWidth: 4`)

**Convenciones:**

- Mantener estilo de importación actual (CommonJS).
- Reutilizar `#src/...` para rutas internas cuando tenga sentido.
- Evitar introducir frameworks/librerías nuevas sin necesidad clara.
- Preservar idioma y tono del contenido de UI (español).
- Mantener Lucide como librería de iconos del frontend (no reintroducir Huge Icons).

## Comandos de desarrollo

- Instalar dependencias:
    - `npm install`
- Levantar servidor en desarrollo:
    - `npm run start`
- Formatear proyecto:
    - `npm run format`
- Cargar datos de ejemplo (seed):
    - `npm run seed`

**Notas:**

- `npm run start` usa `--watch` y `--env-file=.env`.
- `npm run seed` **elimina** primero los documentos de `bancos` y luego inserta
  datos de ejemplo.

## Variables de entorno

Definidas en `.env` (basado en `.env.example`):

- `MONGODB_URL`
- `MONGODB_NAME`
- `PORT` (opcional; por defecto `8080`)

**Reglas:**

- Nunca commitear `.env`.
- Nunca exponer secretos en logs o respuestas de API.

## Arquitectura y flujo de datos

1. `src/index.js` inicia Express y middlewares (`json`, `urlencoded`, `morgan`).
2. Se conecta a MongoDB mediante `connectDb()` de `src/db.js`.
3. Se monta la ruta `/api/bancos` desde `src/routes/bancos.js`.
4. Se sirven archivos estáticos de `src/public`.

**Capa API:**

- Ruta → Servicio → MongoDB
- `routes/bancos.js` delega en `services/bancos-service.js`
- `bancos-service` consulta la colección `bancos` vía `getCollection("bancos")`

## Contrato actual de API

Base URL local: `http://localhost:8080`

- `GET /api/bancos`
    - Devuelve array con todos los bancos.
- `GET /api/bancos/:_id`
    - Devuelve un banco por `_id` (ObjectId de MongoDB).
- `POST /api/bancos`
    - Crea uno o varios bancos (acepta objeto o array) y devuelve mensaje de confirmación.
- `PUT /api/bancos/:_id`
    - Actualiza parcialmente un banco por `_id` y devuelve mensaje según resultado.
- `DELETE /api/bancos`
    - Elimina todos los bancos.
- `DELETE /api/bancos/:_id`
    - Elimina un banco por `_id`.

**Al tocar la API:**

- Mantener compatibilidad con el frontend actual.
- Si cambias estructura de respuesta, documentar impacto y adaptar cliente.

## Frontend: reglas para cambios

Estructura:

- Páginas: `src/public/index.html`, `src/public/bancos.html`,
  `src/public/utensilios.html`, `src/public/FAQ.html`
- Scripts: `src/public/js/script.js` (+ `validacion-formulario.js`)
- Estilos: `src/public/css/base.css`, `styles.css`, `reset.css`
- Componentes web: `src/public/components/site-header.js`, `site-footer.js`

**Reglas:**

- Priorizar accesibilidad y mantener soporte de preferencias A11Y existentes
  (texto grande, contraste, dislexia, reducir animaciones).
- No romper IDs/clases que `script.js` ya utiliza para filtros, modales,
  carrito, FAQ y widget de accesibilidad.
- Mantener diseño responsive (desktop y móvil).

## Guía para agentes de IA (cómo trabajar aquí)

Antes de editar:

1. Leer este archivo y `README.md`.
2. Identificar si el cambio afecta backend, frontend o ambos.
3. Localizar dependencias del flujo (rutas, servicio, HTML, JS y estilos
   conectados).

Durante la edición:

- Cambios pequeños y focalizados.
- No refactorizar en bloque "porque sí".
- No tocar archivos no relacionados con el objetivo.
- Seguir estilo de código existente y pasar Prettier.

Validación mínima:

1. `npm run format`
2. `npm run start` y comprobar que el servidor arranca. Si el puerto está
   ocupado, usar la variable `PORT` para intentar abrirlo en otro puerto.
3. Verificar manualmente:
    - páginas cargan sin errores JS,
    - `/api/bancos` responde,
    - filtros/modales/carrito/FAQ siguen operativos si fueron afectados.

## Seguridad y límites

- No añadir credenciales reales en el repo.
- No hacer cambios destructivos en Git sin instrucción explícita.
- No ejecutar acciones de despliegue o push remoto sin pedirlo.
- Tener cuidado con `seed`: destruye contenido de la colección `bancos`.

## Criterios de entrega (Definition of Done)

Un cambio se considera listo cuando:

- Cumple exactamente la petición.
- Mantiene compatibilidad con comportamiento existente no relacionado.
- Está formateado y consistente con el código actual.
- Se verificó manualmente el flujo impactado.
- Si aplica, se documentaron nuevos comandos, variables o endpoints.
