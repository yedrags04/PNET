# 💰 HeistCraft

Una aplicación web para reservar bancos y utensilios para cometer atracos 💵.

Creado por:

- Joaquín Guerra Tocino
- Yedra García Sánchez
- David Cifredo Juliá

## Servidor

El `package.json` incluye un script `start`. Este script puede ser ejecutado
haciendo `npm run start`. Esto abrirá el servidor, que servirá los ficheros de
`/public` en `/` y la api en `/api`.

## Configuración de entorno y carga de datos

Para conectar el proyecto a MongoDB, crea un fichero `.env` en la raíz del
repositorio tomando como base `.env.example`:

1. Copia `.env.example` a `.env`.
2. Rellena las variables con tus valores reales:
    - `MONGODB_URL`: URL de conexión de MongoDB.
    - `MONGODB_NAME`: nombre de la base de datos.

Después de configurar el entorno, ejecuta `npm run seed` para inicializar la
colección de bancos con los datos de ejemplo del proyecto.

Este paso es importante porque:

- Deja la base de datos en un estado conocido para desarrollo y pruebas,
- Carga los bancos que usa la aplicación para mostrar resultados en la API y
  en la interfaz,
- Evita incoherencias cuando la colección está vacía o contiene datos antiguos.

Ten en cuenta que la seed elimina primero los documentos existentes en la
colección `bancos` y luego inserta los nuevos datos de ejemplo.

## Formato de código (Prettier)

Este proyecto usa [Prettier](https://prettier.io/) para mantener un formato de
código consistente.

Se recomienda encarecidamente que todos los desarrolladores usen la extensión
oficial de [Prettier para VS
Code](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode):

El repositorio incluye la configuración en
[`.vscode/settings.json`](.vscode/settings.json), donde está activado
`editor.formatOnSave` y se define Prettier como formateador por defecto para
HTML, CSS, JavaScript y Markdown. Esto hará que el código se formatee
automáticamente al guardar.
