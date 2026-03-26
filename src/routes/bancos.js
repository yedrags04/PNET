const express = require("express");
const router = express.Router();
const bancosService = require("@src/services/bancos-service");

// Obtener todos los bancos
router.get("/", async (req, res) => {
    const bancos = await bancosService.getAll();
    res.status(200).json(bancos);
});

// Obtener un banco usando el _id de mongodb
router.get("/:_id", async (req, res) => {
    const { _id } = req.params;
    const banco = await bancosService.get(_id);
    console.log(__dirname);
    res.status(200).json(banco);
});

module.exports = router;
