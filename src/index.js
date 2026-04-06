// Imports
const express = require("express");
const app = express();
const logger = require("morgan");
const db = require("#src/db.js");

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
const bancos = require("#src/routes/bancos.js");
app.use("/api/bancos", bancos);

// Ruta de utensilios
const utensilios = require("#src/routes/utensilios.js");
app.use("/api/utensilios", utensilios);

// Ruta de reservas
const reservas = require("#src/routes/reservas.js");
app.use("/api/reservas", reservas);

// Servir la página en ./public
app.use(express.static(__dirname + "/public"));

// Por defecto escucha en el puerto 8080
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Escuchando en http://localhost:${port}`);
});
