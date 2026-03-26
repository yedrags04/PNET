const express = require("express");
const app = express();
const logger = require("morgan");
const db = require("./db");
const PORT = 8080;

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(logger("dev"));

db.connectDb();

const bancos = require("./routes/bancos.js");
app.use("/api/bancos", bancos);

app.use(express.static(__dirname + "/public"));

const server = require("http").createServer(app);
server.listen(PORT, () => {
    console.log(`Escuchando en http://localhost:${PORT}`);
});
