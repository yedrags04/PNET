const express = require("express");
const router = express.Router();
const reservasService = require("#src/services/reservas-service.js");

// Obtener todas las reservas
router.get("/", async (_, res) => {
    try {
        const reservas = await reservasService.getAll();
        res.status(200).json(reservas);
    } catch (e) {
        res.status(404).json({ msg: "No se pudieron obtener las reservas" });
    }
});

// Obtener una reserva usando el _id de mongodb
router.get("/:_id", async (req, res) => {
    const { _id } = req.params;
    try {
        const reserva = await reservasService.get(_id);
        res.status(200).json(reserva);
    } catch (e) {
        res.status(404).json({ msg: `No se pudo obtener la reserva con _id: ${_id}` });
    }
});

// Crear una reserva
router.post("/", async (req, res) => {
    try {
        const result = await reservasService.create(req.body);
        if (result.insertedCount) {
            res.status(200).json({
                msg: "Reservas creadas correctamente",
            });
        } else {
            res.status(200).json({
                msg: `Reserva creada correctamente con id: ${result.insertedId}`,
            });
        }
    } catch (e) {
        res.status(400).json({ msg: "No se pudo crear la reserva" });
    }
});

router.put("/:_id", async (req, res) => {
    const { _id } = req.params;
    try {
        const result = await reservasService.update(_id, req.body);
        if (result.modifiedCount) {
            res.status(200).json({
                msg: `Reserva con _id: ${_id} actualizada correctamente`,
            });
        } else {
            res.status(200).json({
                msg: `No se pudo actualizar la reserva con _id: ${_id}`,
            });
        }
    } catch (e) {
        res.status(400).json({ msg: `No se pudo actualizar la reserva con _id: ${_id}` });
    }
});

// Eliminar todas las reservas
router.delete("/", async (_, res) => {
    try {
        await reservasService.deleteAll();
        res.status(200).json({ msg: "Reservas eliminadas correctamente" });
    } catch (e) {
        res.status(400).json({ msg: "No se pudieron eliminar las reservas" });
    }
});

// Eliminar una reserva usando el _id de mongodb
router.delete("/:_id", async (req, res) => {
    const { _id } = req.params;
    try {
        await reservasService.delete(_id);
        res.status(200).json({ msg: `Reserva ${_id} eliminada correctamente` });
    } catch (e) {
        res.status(400).json({ msg: `No se pudo eliminar la reserva con _id: ${_id}` });
    }
});

module.exports = router;
