const express = require("express");
const router = express.Router();
const { getAll } = require("../services/bancos-service");

router.get("/", async (req, res) => {
    const bancos = await getAll();
    res.status(200).json(bancos);
});

module.exports = router;
