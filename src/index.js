// Para que funcione require(@src/...)
require("module-alias/register");

// Imports
const express = require("express");
const app = express();
const logger = require("morgan");
const db = require("./db");

// Código para los logs de morgan
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(logger("dev"));

// Conexión a la base de datos
db.connectDb();

// Ruta de bancos
const bancos = require("./routes/bancos.js");
app.use("/api/bancos", bancos);

// Servir la página en ./public
app.use(express.static(__dirname + "/public"));

// Por defecto escucha en el puerto 8080
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Escuchando en http://localhost:${port}`);
});
