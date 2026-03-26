const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    res.status(200).send("<h1>¡Bancos!</h1>");
});

module.exports = router;
