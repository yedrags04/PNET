const express = require("express");
const path = require("path");
const db = require("#src/db.js");
const logger = require("morgan");

const app = express();

// 1. Configuración (DEBE IR PRIMERO)
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.connectDb();

// 2. Definición de rutas
const reservasRoutes = require("./routes/reservas");
app.use("/api/reservas", reservasRoutes); // El prefijo es /api/reservas

// 3. Estáticos
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`🚀 Servidor listo en http://localhost:${port}`);
});
