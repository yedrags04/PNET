const express = require("express");
const app = express();
const logger = require("morgan");
const PORT = 3400;

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(logger("dev"));

const bancos = require("./routes/bancos.js");
app.use("/api/bancos", bancos);

app.use(express.static(__dirname + "/public"));

const server = require("http").createServer(app);
server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
