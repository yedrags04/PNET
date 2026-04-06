const express = require("express");
const router = express.Router();
const reservasService = require("../services/reservas-service");

// Esto atiende: POST http://localhost:8080/api/reservas
router.post("/", async (req, res) => {
    try {
        const resultado = await reservasService.create(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Esto atiende: PUT http://localhost:8080/api/reservas/ID_DE_MONGO
router.put("/:id", async (req, res) => {
    try {
        const resultado = await reservasService.update(req.params.id, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
