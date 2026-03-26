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
